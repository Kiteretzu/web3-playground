import { generateMnemonic, mnemonicToSeedSync } from "bip39"; // creates mnemocToSeedSync
import { derivePath } from "ed25519-hd-key"; // helps finding derivable address from seed
import nacl from "tweetnacl"; // helps creating keypairs from seed
import {Keypair} from "@solana/web3.js" // helps uint8 to base58 + also helps creating keypair
import bs58 from "bs58" // converts uint8 to bse58


function App() {
  const mnemonic = generateMnemonic()

  const seed = mnemonicToSeedSync(mnemonic)

  const path = `m/44'/501'/0'/0'`; // This is the derivation path

  const deriverdSeed =derivePath(path, seed.toString("hex"))
  // console.log("\nkey", deriverdSeed.key) // uint8 array 32 bytes PRIVATE KEY
  
  const derivedPrivateSeedKey = deriverdSeed.key

  // console.log(derivedPrivateSeedKey)

  const keypair = nacl.sign.keyPair.fromSeed(derivedPrivateSeedKey) // nacl is helpful to create keypairs -> you get public and private key 

  // now we make keypairs as valid address look like

  console.log("Public key", Keypair.fromSecretKey(keypair.secretKey).publicKey.toBase58())
  console.log("Private key", bs58.encode(keypair.secretKey))


  return (
    <>
      hello 
    </>
  )
}

export default App
