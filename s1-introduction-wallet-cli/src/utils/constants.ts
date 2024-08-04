import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import * as path from "path";

//  Constants
export const cluster = "devnet";
export const solConnection: Connection = new Connection(
  clusterApiUrl(cluster),
  "confirmed"
);
/**
 * 
 * @param input PublicKey | Wallet Address (string)
 * @returns PublicKey type
 * @description Converts a string to PublicKey type else returns the PublicKey
 */
export const toPublicKey = (input: PublicKey | string): PublicKey => {
    return typeof input === 'string' ? new PublicKey(input) : input;
  };

// Helper Functions
export const getRecentBlockhash = async (connection: Connection) => {
  try {
    const recentBlockHash = await connection.getLatestBlockhash();
    return recentBlockHash.blockhash;
  } catch (error) {
    console.error(`Error fetching recent blockhash: ${error}`);
  }
};
