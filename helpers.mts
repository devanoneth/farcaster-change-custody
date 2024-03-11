import { ID_REGISTRY_ADDRESS, idRegistryABI } from "@farcaster/hub-web";
import { publicClient, fromAccount, toAccount } from "./clients.mts";

export const getDeadline = () => {
  const now = Math.floor(Date.now() / 1000);
  const oneHour = 60 * 60;
  return BigInt(now + oneHour);
};

export const readNonce = async () => {
  return await publicClient.readContract({
    address: ID_REGISTRY_ADDRESS,
    abi: idRegistryABI,
    functionName: "nonces",
    args: [toAccount.address],
  });
};

export const getFID = async () => {
  return await publicClient.readContract({
    address: ID_REGISTRY_ADDRESS,
    abi: idRegistryABI,
    functionName: "idOf",
    args: [fromAccount.address],
  });
};
