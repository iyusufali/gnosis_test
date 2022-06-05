import { SafeTransaction } from "@gnosis.pm/safe-core-sdk-types";

export async function getSafeDetails(safeAddress: string) {
  if (safeAddress === "") {
    return [];
  }
  try {
    const response = await apiCallGet(
      `https://safe-client.gnosis.io/v1/chains/4/safes/${safeAddress}`
    );
    let ret: any[] = [];
    response.owners.map((e: any) => {
      ret.push(e.value);
    });
    return ret;
  } catch {
    return [];
  }
}

export async function apiCallGet(url: string): Promise<any> {
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
}

export async function apiCallPost(url: string, data: any): Promise<any> {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    return res.status === 201;
  });
}

export async function getSignedOwners(safeTxHash : string){
  if (safeTxHash==="") return {retComplete : [],retSignedOwners:[]};
  let retComplete : any[] = [];
  let retSignedOwners : string[] = []
  const resp = await apiCallGet(`https://safe-transaction.rinkeby.gnosis.io/api/v1/multisig-transactions/${safeTxHash}/confirmations/`);
  resp.results.map((e: any)=>{
    retComplete.push({owner:e.owner,signature:e.signature});
    retSignedOwners.push(e.owner);
  })
  return {retComplete,retSignedOwners};
}

export interface transaction_services_tx {
  to: string;
  value: string;
  data: string;
  operation: number;
  safeTxGas: number;
  baseGas: number;
  gasPrice: number;
  nonce: number;
}

export async function postTransaction(
  safeAddress: string,
  tx: transaction_services_tx,
  signature: string,
  sender: string,
  contractTransactionHash: string
) {
  const data = {
    safe: safeAddress,
    ...tx,
    signature,
    sender,
    contractTransactionHash,
  };
  apiCallPost(
    `https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/${safeAddress}/multisig-transactions/`,
    data
  );
};

export async function postConfirmation(safeTxHash : string,signature:string){
  await apiCallPost(
    `https://safe-transaction.rinkeby.gnosis.io/api/v1/multisig-transactions/${safeTxHash}/confirmations/`,
    {signature}
  );
};
