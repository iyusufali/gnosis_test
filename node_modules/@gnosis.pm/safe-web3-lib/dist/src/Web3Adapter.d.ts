import { BigNumber } from '@ethersproject/bignumber';
import { Eip3770Address, EthAdapter, EthAdapterTransaction, GetContractProps } from '@gnosis.pm/safe-core-sdk-types';
import Web3 from 'web3';
import { Transaction } from 'web3-core';
import { ContractOptions } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import GnosisSafeContractWeb3 from './contracts/GnosisSafe/GnosisSafeContractWeb3';
import GnosisSafeProxyFactoryWeb3Contract from './contracts/GnosisSafeProxyFactory/GnosisSafeProxyFactoryWeb3Contract';
import MultiSendWeb3Contract from './contracts/MultiSend/MultiSendWeb3Contract';
export interface Web3AdapterConfig {
    /** web3 - Web3 library */
    web3: Web3;
    /** signerAddress - Address of the signer */
    signerAddress: string;
}
declare class Web3Adapter implements EthAdapter {
    #private;
    constructor({ web3, signerAddress }: Web3AdapterConfig);
    isAddress(address: string): boolean;
    getEip3770Address(fullAddress: string): Promise<Eip3770Address>;
    getBalance(address: string): Promise<BigNumber>;
    getChainId(): Promise<number>;
    getSafeContract({ safeVersion, chainId, singletonDeployment, customContractAddress, customContractAbi }: GetContractProps): GnosisSafeContractWeb3;
    getMultiSendContract({ safeVersion, chainId, singletonDeployment, customContractAddress, customContractAbi }: GetContractProps): MultiSendWeb3Contract;
    getSafeProxyFactoryContract({ safeVersion, chainId, singletonDeployment, customContractAddress, customContractAbi }: GetContractProps): GnosisSafeProxyFactoryWeb3Contract;
    getContract(address: string, abi: AbiItem | AbiItem[], options?: ContractOptions): any;
    getContractCode(address: string): Promise<string>;
    isContractDeployed(address: string): Promise<boolean>;
    getTransaction(transactionHash: string): Promise<Transaction>;
    getSignerAddress(): Promise<string>;
    signMessage(message: string): Promise<string>;
    estimateGas(transaction: EthAdapterTransaction, callback?: (error: Error, gas: number) => void): Promise<number>;
    call(transaction: EthAdapterTransaction): Promise<string>;
}
export default Web3Adapter;
