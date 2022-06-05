import { useState } from "react";
import { connectToUser } from "../utils/connectWallet";
import Web3Adapter from "@gnosis.pm/safe-web3-lib";
import { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk'
import { Moralis } from "moralis";

export const createSafe = async (callback : (txHash:string)=>void) => {
    const { userAddress, web3 } = await connectToUser();
    const ethAdapter = new Web3Adapter({
    web3,
    signerAddress: userAddress,
    });
    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safeAccountConfig: SafeAccountConfig = {
        owners:[userAddress],
        threshold: 1,
    }
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, callback });
};

export const loadSafe = async (txHash: string) => {
    const { userAddress, web3 } = await connectToUser();
    const txReceipt = await web3.eth.getTransactionReceipt(txHash); //This will return pending if transaction does not get executed 
    console.log("LOADING SAFE : ", txHash);
    console.log("TX RECEIPT : ", txReceipt);
    console.log("TX RECEIPT LOGS DATA : ", web3.eth.abi.decodeParameters(['address', 'address'], txReceipt.logs[1].data));
    const safe_address = (web3.eth.abi.decodeParameters(['address', 'address'], txReceipt.logs[1].data)as any)[0];
};

const serverUrl = "https://ggc7hvp12r3h.usemoralis.com:2053/server";
const appId = "j8RyEYNLacS0vITt7rIrkOnYxNbbFNTF8UFKmj8a";
export const txInfo = () => {
    Moralis.start({ serverUrl, appId });
    const [txHash, setTxHash] = useState("");
    const callback = (txHash: string): void => {
        console.log("TX HASH CREATED : ", { txHash });
        setTxHash(txHash);
    }
    return (    
        <>

            <button onClick={()=>{createSafe(callback)}}>
                Create Safe
            </button>
            <button onClick={() => { console.log(txHash) }}>
                Log Tx Hash
            </button>
            <button onClick={() => { loadSafe(txHash) }}>
                Load Safe
            </button>
        </>
    )
};

export default txInfo;