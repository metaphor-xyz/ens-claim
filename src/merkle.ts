import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

const ARWEAVE_MANIFEST_HASH = "WGjQfqn4C7bpf-5vxscrYOpbIzy2IDH129k-N647xAE";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hashLeaf([address, entry]: [string, any]) {
  return solidityKeccak256(["address", "uint256"], [address, entry.balance]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getIndex(address: string, entry: any, proof: string[]) {
  const normalizedAddress = address.toLowerCase();
  let index = 0;
  let computedHash = hashLeaf([normalizedAddress, entry]);

  for (let i = 0; i < proof.length; i++) {
    index *= 2;
    const proofElement = proof[i];

    if (computedHash <= proofElement) {
      // Hash(current computed hash + current element of the proof)
      computedHash = solidityKeccak256(
        ["bytes32", "bytes32"],
        [computedHash, proofElement]
      );
    } else {
      // Hash(current element of the proof + current computed hash)
      computedHash = solidityKeccak256(
        ["bytes32", "bytes32"],
        [proofElement, computedHash]
      );
      index += 1;
    }
  }
  return index;
}

const SHARD_NYBBLES = 2;

export async function getProof(address: string, customGateway?: string) {
  const normalizedAddress = address.toLowerCase();
  const arweaveGateway = customGateway || "https://arweave.net";
  const shardid = normalizedAddress.slice(2, 2 + SHARD_NYBBLES);
  const response = await fetch(
    `${arweaveGateway}/${ARWEAVE_MANIFEST_HASH}/${shardid}.json`
  );

  if (!response.ok) {
    return null;
  }

  const shard = await response.json();

  if (shard === undefined) {
    return null;
  }

  const tree = new MerkleTree(
    Object.entries(shard.entries).map(hashLeaf),
    keccak256,
    { sort: true }
  );
  const entry = shard.entries[normalizedAddress];
  const leaf = hashLeaf([normalizedAddress, entry]);
  const proof = tree
    .getProof(leaf)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((e: any) => "0x" + e.data.toString("hex"));

  return [entry, proof.concat(shard.proof), leaf];
}
