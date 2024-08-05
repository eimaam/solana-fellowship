// src/utils/solanaUtils.ts

import { Connection, PublicKey, Transaction, Keypair, clusterApiUrl } from '@solana/web3.js';
import {  getAccount, TOKEN_PROGRAM_ID, TokenInvalidAccountOwnerError, transfer } from '@solana/spl-token';
import { mintTo, getOrCreateAssociatedTokenAccount, createMint } from '@solana/spl-token';

export const createConnection = () => new Connection(clusterApiUrl('devnet'), 'confirmed');

export const loadKeypair = (keypairJson: string): Keypair => {
  const secretKey = Uint8Array.from(JSON.parse(keypairJson));
  return Keypair.fromSecretKey(secretKey);
};

export const createToken = async (connection: Connection, payer: Keypair, decimals: number): Promise<PublicKey> => {
  try {
    // Create the mint account
    const mint = await createMint(
      connection,
      payer,                 // The payer for the transaction fees
      payer.publicKey,       // The authority for the mint
      null,                  // Optional freeze authority (set to null if not needed)
      decimals,              // Number of decimal places for the token
    );

    return mint; // Return the public key of the mint account
  } catch (error) {
    console.error('Error creating token:', error);
    throw error; // Re-throw error to handle it in the component
  }
};


/**
 * Mint tokens to a specific token account
 * @param connection - The Solana connection object
 * @param payer - The payer Keypair
 * @param mint - The mint address (token's mint address)
 * @param destination - The destination token account to mint to
 * @param amount - The amount of tokens to mint
 */
// mint tokens to a specific token account
export const mintTokens = async (connection: Connection, mintAddress: PublicKey, payer: Keypair, recipientAddress: PublicKey, amount: number) => {
  // Get or create associated token account for the recipient
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintAddress,
    recipientAddress
  );

  // Mint tokens to the recipient's token account
  await mintTo(
    connection,
    payer,
    mintAddress,
    recipientTokenAccount.address,
    payer,
    amount
  );
};



export const transferTokens = async (
  connection: Connection,
  payer: Keypair,
  mintAddress: PublicKey,
  fromTokenAccountAddress: PublicKey,
  toWalletPublicKey: PublicKey,
  amount: number
) => {
  try {
    // Ensuring the receiver's token account exists, create it if it does not
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintAddress,
      toWalletPublicKey
    );


    // Fetch and validate the sender's token account
    const fromTokenAccount = await getAccount(connection, fromTokenAccountAddress);

    console.log({ fromTokenAccount });

    // Check if the sender's token account is owned by the SPL Token program
    // if (!fromTokenAccount.owner.equals(TOKEN_PROGRAM_ID)) {
    //   throw new TokenInvalidAccountOwnerError();
    // }

    // Fetch and validate the receiver's token account
    const toTokenAccountInfo = await getAccount(connection, toTokenAccount.address);
console.log
    // Check if the receiver's token account is owned by the SPL Token program
    // if (!toTokenAccountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
    //   throw new TokenInvalidAccountOwnerError();
    // }


  // Transfer tokens from sender's token account to receiver's token account
    const signature = await transfer(
      connection,
      payer,
      fromTokenAccountAddress,
      toTokenAccount.address,
      payer.publicKey,
      amount
    );

    const recentBlockhash = await connection.getLatestBlockhash();

    // Confirm the transaction
    await connection.confirmTransaction({
      blockhash: recentBlockhash.blockhash,
      lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
      signature
    });

    // Fetch and log the updated balances
    console.log('Transaction signature:', signature);

    const updatedFromTokenAccountInfo = await getAccount(connection, fromTokenAccountAddress);
    const updatedToTokenAccountInfo = await getAccount(connection, toTokenAccount.address);

    console.log('Sender Token Account Balance:', updatedFromTokenAccountInfo.amount.toString());
    console.log('Receiver Token Account Balance:', updatedToTokenAccountInfo.amount.toString());

    return signature;
  } catch (error) {
    if (error instanceof TokenInvalidAccountOwnerError) {
      console.error('Error: Invalid account owner for the token account');
    } else {
      console.error('Error during token transfer:', error);
    }
    throw error;
  }
};

