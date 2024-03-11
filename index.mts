import {
  ViemWalletEip712Signer,
  ID_REGISTRY_ADDRESS,
  idRegistryABI,
} from "@farcaster/hub-web";
import {
  fromWalletClient,
  toAccount,
  publicClient,
  fromAccount,
} from "./clients.mts";
import { readNonce, getDeadline, getFID } from "./helpers.mts";
import { toHex } from "viem";
import { english, generateMnemonic } from "viem/accounts";
import { confirm } from "@inquirer/prompts";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.OLD_SEED) {
  throw new Error("OLD_SEED is not set");
}

if (!process.env.NEW_SEED) {
  console.log("NEW_SEED is not set, generating mnemonic...");
  process.env.NEW_SEED = generateMnemonic(english);
  console.log(
    "Farcaster ID will be transferred to the first account in:\n",
    process.env.NEW_SEED
  );
}

const nonce = await readNonce();
const deadline = getDeadline();
const fid = await getFID();

const eip712Signer = new ViemWalletEip712Signer(fromWalletClient);
const signature = (
  await eip712Signer.signTransfer({
    fid,
    to: toAccount.address,
    nonce,
    deadline,
  })
)._unsafeUnwrap();

const { request } = await publicClient.simulateContract({
  account: fromAccount,
  address: ID_REGISTRY_ADDRESS,
  abi: idRegistryABI,
  functionName: "transfer",
  // to, deadline, signature
  args: [toAccount.address, deadline, toHex(signature)],
});

console.log(`Simulation succeeded.`);

const answer = await confirm({
  message: `Are you sure you want to transfer FID ${fid} to ${toAccount.address}?`,
});

if (!answer) {
  console.log("Aborted.");
  process.exit(0);
}

const hash = await fromWalletClient.writeContract(request);
console.log(
  `Transaction sent! Follow progress on the explorer: https://optimistic.etherscan.io/tx/${hash}`
);
