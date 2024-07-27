import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getRecentBlockhash,
  solConnection,
  toPublicKey,
} from "./utils/constants";

const sendSol = async (
  connection: Connection,
  sender: Keypair,
  recipient: PublicKey | string, // Accepts both PublicKey and string (wallet address)
  amount: number
) => {
  const transaction = new Transaction();
  const recipientPublicKey = toPublicKey(recipient);
  const feePayer = sender.publicKey;
  try {
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: recipientPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    transaction.recentBlockhash = (await getRecentBlockhash(
      solConnection
    )) as string;
    transaction.feePayer = feePayer;
    transaction.partialSign(sender);

    const serializedTransaction = transaction.serialize();
    const signature = await connection.sendRawTransaction(
      serializedTransaction
    );

    console.log(`✍️trx signature: ${signature}`);
    console.log(
      `Sucess: 💸 Sent ${amount} SOL from ${sender.publicKey.toBase58()} to ${recipientPublicKey.toBase58()}`
    );
  } catch (error) {
    console.error(`❌ Transaction Failed: ${error}`);
  }
};
