import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
  import path from "path";
  import * as fs from "fs";


const keypairFile = path.resolve(__dirname, "keypair.json");

// Generate a new keypair (secret key and public (wallet address)) and save it to keypair.json
const generateKeypair = async () => {
    const keypair = Keypair.generate();
  
    const keypairString = JSON.stringify({
      publicKey: keypair.publicKey.toBase58(),
      secretKey: Array.from(keypair.secretKey) ,
    });
  
    fs.writeFileSync(keypairFile, keypairString);
  
    console.log("✅ Keypair generated and saved to keypair.json", keypairString);
  };

  // Fetch keypair from keypair.json file
const fetchKeypair = async () => {
    if (fs.existsSync(keypairFile)) {
      console.log("🔑 Keypair found in keypair.json");
      const { secretKey } = JSON.parse(fs.readFileSync(keypairFile, "utf8"));
      const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));
      console.log(`🔑 Keypair loaded: ${keypair}`);
      return keypair;
    } else {

        console.log(
            "❌ Keypair not found in keypair.json >>> generating new keypair"
        );
        await generateKeypair();
        return fetchKeypair();
    }
  };