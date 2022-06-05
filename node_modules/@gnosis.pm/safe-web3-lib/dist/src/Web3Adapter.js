"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Web3Adapter_web3, _Web3Adapter_signerAddress;
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_1 = require("@ethersproject/bignumber");
const safe_core_sdk_utils_1 = require("@gnosis.pm/safe-core-sdk-utils");
const contractInstancesWeb3_1 = require("./contracts/contractInstancesWeb3");
class Web3Adapter {
    constructor({ web3, signerAddress }) {
        _Web3Adapter_web3.set(this, void 0);
        _Web3Adapter_signerAddress.set(this, void 0);
        if (!web3) {
            throw new Error('web3 property missing from options');
        }
        __classPrivateFieldSet(this, _Web3Adapter_web3, web3, "f");
        __classPrivateFieldSet(this, _Web3Adapter_signerAddress, signerAddress, "f");
    }
    isAddress(address) {
        return __classPrivateFieldGet(this, _Web3Adapter_web3, "f").utils.isAddress(address);
    }
    async getEip3770Address(fullAddress) {
        const chainId = await this.getChainId();
        return (0, safe_core_sdk_utils_1.validateEip3770Address)(fullAddress, chainId);
    }
    async getBalance(address) {
        return bignumber_1.BigNumber.from(await __classPrivateFieldGet(this, _Web3Adapter_web3, "f").eth.getBalance(address));
    }
    async getChainId() {
        return __classPrivateFieldGet(this, _Web3Adapter_web3, "f").eth.getChainId();
    }
    getSafeContract({ safeVersion, chainId, singletonDeployment, customContractAddress, customContractAbi }) {
        const contractAddress = customContractAddress !== null && customContractAddress !== void 0 ? customContractAddress : singletonDeployment === null || singletonDeployment === void 0 ? void 0 : singletonDeployment.networkAddresses[chainId];
        if (!contractAddress) {
            throw new Error('Invalid Safe Proxy contract address');
        }
        const safeContract = this.getContract(contractAddress, customContractAbi !== null && customContractAbi !== void 0 ? customContractAbi : singletonDeployment === null || singletonDeployment === void 0 ? void 0 : singletonDeployment.abi);
        return (0, contractInstancesWeb3_1.getSafeContractInstance)(safeVersion, safeContract);
    }
    getMultiSendContract({ safeVersion, chainId, singletonDeployment, customContractAddress, customContractAbi }) {
        const contractAddress = customContractAddress !== null && customContractAddress !== void 0 ? customContractAddress : singletonDeployment === null || singletonDeployment === void 0 ? void 0 : singletonDeployment.networkAddresses[chainId];
        if (!contractAddress) {
            throw new Error('Invalid Multi Send contract addresss');
        }
        const multiSendContract = this.getContract(contractAddress, customContractAbi !== null && customContractAbi !== void 0 ? customContractAbi : singletonDeployment === null || singletonDeployment === void 0 ? void 0 : singletonDeployment.abi);
        return (0, contractInstancesWeb3_1.getMultiSendContractInstance)(safeVersion, multiSendContract);
    }
    getSafeProxyFactoryContract({ safeVersion, chainId, singletonDeployment, customContractAddress, customContractAbi }) {
        const contractAddress = customContractAddress !== null && customContractAddress !== void 0 ? customContractAddress : singletonDeployment === null || singletonDeployment === void 0 ? void 0 : singletonDeployment.networkAddresses[chainId];
        if (!contractAddress) {
            throw new Error('Invalid Safe Proxy Factory contract address');
        }
        const proxyFactoryContract = this.getContract(contractAddress, customContractAbi !== null && customContractAbi !== void 0 ? customContractAbi : singletonDeployment === null || singletonDeployment === void 0 ? void 0 : singletonDeployment.abi);
        return (0, contractInstancesWeb3_1.getGnosisSafeProxyFactoryContractInstance)(safeVersion, proxyFactoryContract);
    }
    getContract(address, abi, options) {
        return new (__classPrivateFieldGet(this, _Web3Adapter_web3, "f").eth.Contract)(abi, address, options);
    }
    async getContractCode(address) {
        return __classPrivateFieldGet(this, _Web3Adapter_web3, "f").eth.getCode(address);
    }
    async isContractDeployed(address) {
        const contractCode = await __classPrivateFieldGet(this, _Web3Adapter_web3, "f").eth.getCode(address);
        return contractCode !== '0x';
    }
    async getTransaction(transactionHash) {
        return __classPrivateFieldGet(this, _Web3Adapter_web3, "f").eth.getTransaction(transactionHash);
    }
    async getSignerAddress() {
        return __classPrivateFieldGet(this, _Web3Adapter_signerAddress, "f");
    }
    signMessage(message) {
        return __classPrivateFieldGet(this, _Web3Adapter_web3, "f").eth.sign(message, __classPrivateFieldGet(this, _Web3Adapter_signerAddress, "f"));
    }
    estimateGas(transaction, callback) {
        return __classPrivateFieldGet(this, _Web3Adapter_web3, "f").eth.estimateGas(transaction, callback);
    }
    call(transaction) {
        return __classPrivateFieldGet(this, _Web3Adapter_web3, "f").eth.call(transaction);
    }
}
_Web3Adapter_web3 = new WeakMap(), _Web3Adapter_signerAddress = new WeakMap();
exports.default = Web3Adapter;
//# sourceMappingURL=Web3Adapter.js.map