import { BigNumber } from '@ethersproject/bignumber';
import { GnosisSafeContract, SafeTransaction, SafeTransactionData, SafeVersion } from '@gnosis.pm/safe-core-sdk-types';
import { GnosisSafe as GnosisSafe_V1_1_1 } from '../../../typechain/src/web3-v1/v1.1.1/gnosis_safe';
import { GnosisSafe as GnosisSafe_V1_2_0 } from '../../../typechain/src/web3-v1/v1.2.0/gnosis_safe';
import { GnosisSafe as GnosisSafe_V1_3_0 } from '../../../typechain/src/web3-v1/v1.3.0/gnosis_safe';
import { Web3TransactionOptions, Web3TransactionResult } from '../../types';
declare abstract class GnosisSafeContractWeb3 implements GnosisSafeContract {
    contract: GnosisSafe_V1_1_1 | GnosisSafe_V1_2_0 | GnosisSafe_V1_3_0;
    constructor(contract: GnosisSafe_V1_1_1 | GnosisSafe_V1_2_0 | GnosisSafe_V1_3_0);
    getVersion(): Promise<SafeVersion>;
    getAddress(): string;
    getNonce(): Promise<number>;
    getThreshold(): Promise<number>;
    getOwners(): Promise<string[]>;
    isOwner(address: string): Promise<boolean>;
    getTransactionHash(safeTransactionData: SafeTransactionData): Promise<string>;
    approvedHashes(ownerAddress: string, hash: string): Promise<BigNumber>;
    approveHash(hash: string, options?: Web3TransactionOptions): Promise<Web3TransactionResult>;
    abstract getModules(): Promise<string[]>;
    abstract isModuleEnabled(moduleAddress: string): Promise<boolean>;
    execTransaction(safeTransaction: SafeTransaction, options?: Web3TransactionOptions): Promise<Web3TransactionResult>;
    encode(methodName: string, params: any[]): string;
    estimateGas(methodName: string, params: any[], options: Web3TransactionOptions): Promise<number>;
}
export default GnosisSafeContractWeb3;
