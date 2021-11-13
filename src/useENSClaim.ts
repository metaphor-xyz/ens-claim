import { getProof, getIndex } from "./merkle";
import { Contract } from "@ethersproject/contracts";
import {
  Web3Provider,
  getDefaultProvider,
  BaseProvider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from "@ethersproject/providers";
import { useEffect, useState } from "react";

const ENS_TOKEN_CONTRACT_ADDRESS = "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72";
const ENS_TOKEN_ABI = ["function isClaimed(uint256 index) view returns (bool)"];

const ethersProvider = (
  provider: BaseProvider | ExternalProvider | JsonRpcFetchFunc | undefined
): BaseProvider => {
  if (!provider) {
    return getDefaultProvider();
  }

  // @ts-ignore
  if (provider.network?.chainId) {
    // is ethers
    return provider as BaseProvider;
  } else {
    // is web3.js
    // @ts-ignore
    return new Web3Provider(provider.currentProvider);
  }
};

export default function useENSClaim(
  address: string | null,
  provider?: BaseProvider | ExternalProvider | JsonRpcFetchFunc
) {
  const [hasClaimed, setHasClaimed] = useState<boolean | null>(null);

  useEffect(() => {
    if (address) {
      const ENSTokenContract = new Contract(
        ENS_TOKEN_CONTRACT_ADDRESS,
        ENS_TOKEN_ABI,
        ethersProvider(provider)
      );
      getProof(address)
        .then((proofResult) => {
          if (!proofResult) {
            return false;
          }

          const [entry, proof] = proofResult;
          const index = getIndex(address, entry, proof);
          return ENSTokenContract.isClaimed(index);
        })
        .then((result) => setHasClaimed(result));
    } else {
      setHasClaimed(null);
    }
  }, [address, provider]);

  return { hasClaimed };
}
