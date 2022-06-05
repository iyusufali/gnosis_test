import type { NextPage } from "next";
import { Moralis } from "moralis";
import Web3Adapter from "@gnosis.pm/safe-web3-lib";
import Safe,{ EthSignSignature } from "@gnosis.pm/safe-core-sdk";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import { AbiItem } from "web3-utils";
import { useState, useEffect } from "react";
import safeSignTypedData from "../utils/signTyped";
import { BigNumber } from "bignumber.js";
import {
  getSafeDetails,
  postTransaction,
  getSignedOwners,
  postConfirmation,
} from "../utils/transactionServices";
import { connectToUser, connectToUserWEthers } from "../utils/connectWallet";

const disperse_smart_contract = "0xD152f549545093347A162Dce210e7293f1452150";
const disperse_abi = [
  {
    constant: false,
    inputs: [
      { name: "token", type: "address" },
      { name: "recipients", type: "address[]" },
      { name: "values", type: "uint256[]" },
    ],
    name: "disperseTokenSimple",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "token", type: "address" },
      { name: "recipients", type: "address[]" },
      { name: "values", type: "uint256[]" },
    ],
    name: "disperseToken",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "recipients", type: "address[]" },
      { name: "values", type: "uint256[]" },
    ],
    name: "disperseEther",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];
const serverUrl = "https://ggc7hvp12r3h.usemoralis.com:2053/server";
const appId = "j8RyEYNLacS0vITt7rIrkOnYxNbbFNTF8UFKmj8a";

async function generateTransaction(
  safeSdk: any,
  web3Js: any,
  recipients: string[],
  amounts: string[],
  totalAmount: string
) {
  const contract = new web3Js.eth.Contract(
    disperse_abi as AbiItem[],
    disperse_smart_contract
  );
  const data_param = contract.methods
    .disperseEther(recipients, amounts)
    .encodeABI();
  const transaction: SafeTransactionDataPartial = {
    to: disperse_smart_contract,
    value: totalAmount,
    data: data_param,
  };
  const safeTransaction = await safeSdk.createTransaction(transaction);
  return safeTransaction;
}

const init = async function (
  safeAddress: string,
  recipients: string[],
  amounts: string[],
  totalAmount: string
) {
  const { userAddress, web3, signer } = await connectToUserWEthers();
  const ethAdapter = new Web3Adapter({
    web3,
    signerAddress: userAddress,
  });
  const safe = await Safe.create({ ethAdapter, safeAddress });
  let transaction = await generateTransaction(
    safe,
    web3,
    recipients,
    amounts,
    totalAmount
  );
  const contract = new web3.eth.Contract(
    disperse_abi as AbiItem[],
    disperse_smart_contract
  );
  const data_param = contract.methods
    .disperseEther(recipients, amounts)
    .encodeABI();
  const contractTransactionHash = await safe.getTransactionHash(transaction);
  let txParam = {
    to: web3.utils.toChecksumAddress(disperse_smart_contract),
    value: totalAmount.toString(),
    data: data_param,
    operation: 0,
    safeTxGas: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: transaction.data.gasToken,
    refundReceiver: transaction.data.refundReceiver,
    nonce: transaction.data.nonce,
  };
  const sig = await safeSignTypedData(
    signer,
    web3.utils.toChecksumAddress(safe.getAddress()),
    txParam,
    await safe.getChainId()
  );
  await postTransaction(
    web3.utils.toChecksumAddress(safe.getAddress()),
    txParam,
    sig.data as string,
    web3.utils.toChecksumAddress(userAddress),
    contractTransactionHash
  );
  return {
    retSafeTxHash: await safe.getTransactionHash(transaction),
    retToSign: txParam,
  };
};

const executeTransaction = async function (
  recipients: string[],
  amounts: string[],
  totalAmount: string,
  safeAddress: string,
  signatures: any[]
) {
  const { userAddress, web3 } = await connectToUser();
  const ethAdapter = new Web3Adapter({
    web3,
    signerAddress: userAddress,
  });
  const safe = await Safe.create({ ethAdapter, safeAddress });
  const safeSdk2 = await safe.connect({
    ethAdapter,
    safeAddress,
  });
  const transaction = await generateTransaction(
    safe,
    web3,
    recipients,
    amounts,
    totalAmount
  );
  signatures.map((e: any) => {
    const signature = new EthSignSignature(e.owner, e.signature);
    transaction.addSignature(signature);
  });
  const executeTxResponse = await safeSdk2.executeTransaction(transaction);
  await executeTxResponse.transactionResponse?.wait();
};

const gnosis_sign = async function (
  safeTxHash: string,
  safeAddress: string,
  chainId: number,
  toSign: any
) {
  const { userAddress, web3, signer } = await connectToUserWEthers();
  const sig = await safeSignTypedData(
    signer,
    web3.utils.toChecksumAddress(safeAddress),
    toSign,
    chainId
  );
  await postConfirmation(safeTxHash, sig.data);
};

const Home: NextPage = () => {
  Moralis.start({ serverUrl, appId });
  const [page, setPage] = useState(1);
  const [safeAddress, setSafeAddress] = useState("");
  const [recipients, setRecipients] = useState([""]);
  const [amounts, setAmounts] = useState([""]);
  const [totalAmount, setTotalAmount] = useState("");
  const [owners, setOwners] = useState([""]);
  const [safeTxHash, setSafeTxHash] = useState("");
  const [toSign, setToSign] = useState({});
  const [signedOwners, setSignedOwners] = useState([{}]);
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    getSafeDetails(safeAddress).then((e) => {
      setOwners(e);
    });
  }, [safeAddress]);

  useEffect(()=>{
    let t = new BigNumber("0");
    console.log("AMOUNTS : ",amounts);
    amounts.map((e: string) => {
      t = BigNumber.sum(t,new BigNumber(e));
    });
    console.log("total Amount : ",t.toString());
    console.log(typeof t);
    setTotalAmount(t.toString());
  },[amounts])

  if (page === 1) {
    return (
      <>
        <h1>Need to be logged in as one of the owners</h1>
        <label>safe address : </label>
        <input
          onChange={(e) => {
            // setSafeAddress("0x88b9d741199A872915B6b30E7de5980aA88efb53");
            setSafeAddress(e.target.value);
          }}
        ></input>
        <label>recipients (seperated by spaces) : </label>
        <input
          onChange={(e) => {
            // setRecipients(["0x19CC07D2b10f530228b6fdbe8698CB379a53fDde"]);
            setRecipients(e.target.value.split(" ").length===1 && e.target.value.split(" ")[0]==="" ? [e.target.value] : e.target.value.split(" "));
          }}
        ></input>
        <label>values (seperated by spaces wei) : </label>
        <input
          onChange={(e) => {
            // setAmounts(["1000000000000"]);
            setAmounts(e.target.value.split(" ").length===1 && e.target.value.split(" ")[0]==="" ? [e.target.value] : e.target.value.split(" "));
          }}
        ></input>
        <button
          onClick={async (e) => {
            const { retSafeTxHash, retToSign } = await init(
              safeAddress,
              recipients,
              amounts,
              totalAmount
            );
            setSafeTxHash(retSafeTxHash);
            setToSign(retToSign);
            console.log("RET SAFE TX HASH : ",retSafeTxHash);
            await getSignedOwners(retSafeTxHash).then((e) => {
              const { retComplete, retSignedOwners } = e as any;
              console.log(e);
              setSignedOwners(retSignedOwners);
              setSignatures(retComplete);
            });
            setPage(2);
          }}
        >
          Submit
        </button>
      </>
    );
  } else if (page === 2) {
    return (
      <>
        <h1>welcome</h1>
        {owners.map((e) => (
          <div key={e}>
            <button
              key={e}
              onClick={() => {
                gnosis_sign(safeTxHash, safeAddress, 4, toSign).then((f) => {
                  getSignedOwners(safeTxHash).then((k) => {
                    const { retComplete, retSignedOwners } = k as any;
                    setSignedOwners(retSignedOwners);
                    setSignatures(retComplete);
                  });
                });
              }}
              disabled={signedOwners.includes(e)}
            >
              {signedOwners.includes(e) ? `alrdy signed ${e}` : `sign for ${e}`}
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            executeTransaction(
              recipients,
              amounts,
              totalAmount,
              safeAddress,
              signatures
            );
          }}
        >
          Execute Transaction
        </button>
        <button
          onClick={() => {
            getSignedOwners(safeTxHash).then((k) => {
              const { retComplete, retSignedOwners } = k as any;
              setSignedOwners(retSignedOwners);
              setSignatures(retComplete);
            });
          }}
        >
          refresh signers
        </button>
      </>
    );
  } else {
    return <></>;
  }
};

export default Home;
