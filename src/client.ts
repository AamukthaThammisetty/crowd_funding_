// lib/client.ts
import { createThirdwebClient, defineChain, getContract } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!; // this will be used on the client
const secretKey = process.env.THIRDWEB_SECRET_KEY!; // this will be used on the server-side

export const client = createThirdwebClient(
  secretKey ? { secretKey } : { clientId },
);

export const contract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0x95Eb935CbbB7bd45E94bf6B42A38cb1C3Be3F13e",
});

