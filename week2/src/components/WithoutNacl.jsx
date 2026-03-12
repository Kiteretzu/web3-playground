import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

function App() {
  const mnemonic = generateMnemonic();

  const seed = mnemonicToSeedSync(mnemonic);

  const path = `m/44'/501'/0'/0'`;

  const derivedSeed = derivePath(path, seed.toString("hex"));

  const derivedPrivateSeedKey = derivedSeed.key; // 32 bytes

  // Directly create keypair
  const keypair = Keypair.fromSeed(derivedPrivateSeedKey);

  console.log("Public key:", keypair.publicKey.toBase58());
  console.log("Private key:", bs58.encode(keypair.secretKey));

  return <>hello</>;
}

export default App;