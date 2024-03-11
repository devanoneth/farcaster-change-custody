import { createWalletClient, createPublicClient, http } from "viem";
import { optimism } from "viem/chains";
import { mnemonicToAccount } from "viem/accounts";

export const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
});

export const fromAccount = mnemonicToAccount(process.env.OLD_SEED!);

export const toAccount = mnemonicToAccount(process.env.NEW_SEED!);

export const fromWalletClient = createWalletClient({
  account: fromAccount,
  chain: optimism,
  transport: http(),
});

export const toWalletClient = createWalletClient({
  account: toAccount,
  chain: optimism,
  transport: http(),
});
