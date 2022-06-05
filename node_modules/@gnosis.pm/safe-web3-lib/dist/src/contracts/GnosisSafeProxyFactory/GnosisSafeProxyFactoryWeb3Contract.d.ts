import { GnosisSafeProxyFactoryContract } from '@gnosis.pm/safe-core-sdk-types';
import { ProxyFactory as ProxyFactory_V1_1_1 } from '../../../typechain/src/web3-v1/v1.1.1/proxy_factory';
import { ProxyFactory as ProxyFactory_V1_3_0 } from '../../../typechain/src/web3-v1/v1.3.0/proxy_factory';
import { Web3TransactionOptions } from '../../types';
export interface CreateProxyProps {
    safeMasterCopyAddress: string;
    initializer: string;
    saltNonce: number;
    options?: Web3TransactionOptions;
    callback?: (txHash: string) => void;
}
declare class GnosisSafeProxyFactoryWeb3Contract implements GnosisSafeProxyFactoryContract {
    contract: ProxyFactory_V1_3_0 | ProxyFactory_V1_1_1;
    constructor(contract: ProxyFactory_V1_3_0 | ProxyFactory_V1_1_1);
    getAddress(): string;
    createProxy({ safeMasterCopyAddress, initializer, saltNonce, options, callback }: CreateProxyProps): Promise<string>;
    encode(methodName: string, params: any[]): string;
    estimateGas(methodName: string, params: any[], options: Web3TransactionOptions): Promise<number>;
}
export default GnosisSafeProxyFactoryWeb3Contract;
