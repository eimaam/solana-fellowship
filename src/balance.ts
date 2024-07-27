import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { toPublicKey } from "./utils/constants";

const getBalance = async (
  connection: Connection,
  publicKey: PublicKey | string
) => {
  try {
    const recipientPublicKey = toPublicKey(publicKey);

    const balance = await connection.getBalance(recipientPublicKey);
    console.log(`💰 Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  } catch (error) {
    console.error(`Error getting balance: ${error}`);
  }
};
