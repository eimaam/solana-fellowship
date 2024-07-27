import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
import { toPublicKey } from "./utils/constants";

// airdrop sols to a wallet address
const airdrop = async (
    connection: Connection,
    recipient: PublicKey | string, // Accepts both PublicKey and string
    amount: number
  ) => {
    try {
      // Convert recipient to PublicKey if it's a string
      const recipientPublicKey = toPublicKey(recipient);
  
      const latestBlockhash = await connection.getLatestBlockhash();
      console.log(`Latest Blockhash: ${latestBlockhash.blockhash}`);
  
      const airdropSignature = await connection.requestAirdrop(
        recipientPublicKey,
        amount * LAMPORTS_PER_SOL
      );
  
      // Wait for airdrop confirmation
      await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: airdropSignature,
      });
  
      console.log(`💰 Airdropped ${amount} SOL to ${recipientPublicKey.toBase58()}`);
    } catch (error) {
      console.error(`Oops! Airdrop failed: ${error}`);
      throw new Error(`Airdrop failed`);
    }
  };