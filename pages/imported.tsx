import React, { useEffect } from 'react'
import { ethers , Contract, Wallet, utils, BigNumber, BigNumberish, Signer, PopulatedTransaction } from "ethers"
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { Moralis } from "moralis";
import Web3 from "web3"; // Only when using npm/yarn

export const EIP_DOMAIN = {
    EIP712Domain: [
        { type: "uint256", name: "chainId" },
        { type: "address", name: "verifyingContract" }
    ]
}

export const EIP712_SAFE_TX_TYPE = {
    // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
    SafeTx: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "safeTxGas" },
        { type: "uint256", name: "baseGas" },
        { type: "uint256", name: "gasPrice" },
        { type: "address", name: "gasToken" },
        { type: "address", name: "refundReceiver" },
        { type: "uint256", name: "nonce" },
    ]
}

export const EIP712_SAFE_MESSAGE_TYPE = {
    // "SafeMessage(bytes message)"
    SafeMessage: [
        { type: "bytes", name: "message" },
    ]
}

export interface MetaTransaction {
    to: string,
    value: string | number | BigNumber,
    data: string,
    operation: number,
}

export interface SafeTransaction extends MetaTransaction {
    safeTxGas: string | number,
    baseGas: string | number,
    gasPrice: string | number,
    gasToken: string,
    refundReceiver: string,
    nonce: string | number
}

export interface SafeSignature {
    signer: string,
    data: string
}

const safeSignTypedData = async (signer: Signer & TypedDataSigner, safe: string, safeTx: SafeTransaction, chainId?: BigNumberish): Promise<SafeSignature> => {
    if (!chainId && !signer.provider) throw Error("Provider required to retrieve chainId")
    const cid = chainId || (await signer.provider!!.getNetwork()).chainId
    const signerAddress = await signer.getAddress()
    return {
        signer: signerAddress,
        data: await signer._signTypedData({ verifyingContract: safe, chainId: cid }, EIP712_SAFE_TX_TYPE, safeTx)
    }
};

const serverUrl = "https://ggc7hvp12r3h.usemoralis.com:2053/server";
const appId = "j8RyEYNLacS0vITt7rIrkOnYxNbbFNTF8UFKmj8a";
const Imported = () => {

    useEffect(()=>{
        Moralis.start({ serverUrl, appId });

        Moralis.authenticate().then(function (t) {
            console.log(t.get("ethAddress"));
            Moralis.enableWeb3().then(async (e) => {
                const web3Js = new Web3(Moralis.provider);

                const provider = new ethers.providers.Web3Provider(
                    web3Js.currentProvider
                  );
                  const signer = provider.getSigner();
                  const tx : SafeTransaction = {
                    to:"0xD152f549545093347A162Dce210e7293f1452150",
                    value:"2000000000000",
                    data:"0x",
                    operation:0,
                    safeTxGas: 0,
                    baseGas: 0,
                    gasPrice: 0,
                    gasToken: "0xD152f549545093347A162Dce210e7293f1452150",
                    refundReceiver: "0xD152f549545093347A162Dce210e7293f1452150",
                    nonce: 8,
                  }
        safeSignTypedData(signer,"0x88b9d741199A872915B6b30E7de5980aA88efb53",tx,4)
            })})
    },[])

  return (
    <div>imported</div>
  )
}

export default Imported