import { Moralis } from "moralis";
import Web3 from "web3"; // Only when using npm/yarn
import { ethers } from "ethers";

export async function connectToUser() {
    let web3 : any;
    let userAddress : string = "";
    await Moralis.authenticate().then(async function (t) {
        await Moralis.enableWeb3().then(async (e) => {
            web3 = new Web3(Moralis.provider as any);
            userAddress = t.get("ethAddress");
            return {userAddress,web3};
        })
    })
    return {userAddress,web3};
}

export async function connectToUserWEthers() {
    let web3 : any;
    let userAddress : string = "";
    let provider : any;
    let signer :any;
    await Moralis.authenticate().then(async function (t) {
        await Moralis.enableWeb3().then(async (e) => {
            web3 = new Web3(Moralis.provider as any);
            userAddress = t.get("ethAddress");
            provider = new ethers.providers.Web3Provider(
                web3.currentProvider
              );
            signer = provider.getSigner();
            return {userAddress,web3,signer};
        })
    })
    return {userAddress,web3,signer};
};
