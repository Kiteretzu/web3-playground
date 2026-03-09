import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import './App.css'

function App() {
  const mnemonic = generateMnemonic()

  const seed = mnemonicToSeedSync(mnemonic)

  const path = `m/44'/501'/0'/0'`; // This is the derivation path

  const deriverdSeed =derivePath(path, seed.toString("hex"))
  console.log("\nkey", deriverdSeed.key) // uint8 array 32 bytes PRIVATE KEY
  
  const derivedPrivateSeedKey = deriverdSeed.key

  console.log(derivedPrivateSeedKey)

  const resp = nacl.sign.keyPair.fromSecretKey(derivedPrivateSeedKey) // nacl is helpful to create keypairs ffrom 

  console.log('resp', resp)
  

  return (
    <>
      hello 
    </>
  )
}

export default App
