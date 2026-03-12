import { useEffect, useMemo, useState } from "react";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { motion } from "framer-motion";
import { HDKey } from "@scure/bip32";
import { getPublicKey } from "@noble/secp256k1";
import { sha256 } from "@noble/hashes/sha2.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import bs58 from "bs58";
import { Card } from "./components/ui/Card.jsx";
import { Button } from "./components/ui/Button.jsx";
import { TextArea } from "./components/ui/TextArea.jsx";
import { ToggleGroup } from "./components/ui/ToggleGroup.jsx";

const BTC_PATH = "m/44'/0'/0'/0";
const ETH_PATH = "m/44'/60'/0'/0";
const SOL_PATH_PREFIX = "m/44'/501'";

const DEFAULT_INDICES = [0, 1, 2];

function shorten(str, chars = 6) {
  if (!str) return "";
  if (str.length <= chars * 2 + 3) return str;
  return `${str.slice(0, chars)}…${str.slice(-chars)}`;
}

/** Base58check encode (version byte + payload), used for Bitcoin P2PKH. */
function base58check(version, payload) {
  const v = new Uint8Array([version]);
  const data = new Uint8Array(v.length + payload.length);
  data.set(v, 0);
  data.set(payload, 1);
  const hash = sha256(sha256(data));
  const out = new Uint8Array(data.length + 4);
  out.set(data, 0);
  out.set(hash.subarray(0, 4), data.length);
  return bs58.encode(out);
}

AXPoud3Xkop938eZcY221iFW1gtq7FMDdrkRc1yHU2Pn
AkfRKR9iDLPhLUuLeckgzn6mqAkwCkn9pZf7xFaFTNo7


function deriveBtcAccounts(mnemonic, indices) {
  if (!mnemonic) return [];
  const seed = mnemonicToSeedSync(mnemonic);
  const seedBytes = new Uint8Array(seed);
  const root = HDKey.fromMasterSeed(seedBytes);

  return indices.map((index) => {
    const path = `${BTC_PATH}/${index}`;
    const node = root.derive(path);
    if (!node.identifier) throw new Error("Missing identifier");
    const address = base58check(0x00, node.identifier);
    return { chain: "bitcoin", index, path, address };
  });
}

function deriveEthAccounts(mnemonic, indices) {
  if (!mnemonic) return [];
  const seed = mnemonicToSeedSync(mnemonic);
  const seedBytes = new Uint8Array(seed);
  const root = HDKey.fromMasterSeed(seedBytes);

  return indices.map((index) => {
    const path = `${ETH_PATH}/${index}`;
    const node = root.derive(path);
    if (!node.privateKey) throw new Error("Missing private key");
    const uncompressed = getPublicKey(node.privateKey, false);
    const hash = keccak_256(uncompressed.subarray(1));
    const address = "0x" + Array.from(hash.subarray(-20))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return { chain: "ethereum", index, path, address };
  });
}

function deriveSolAccounts(mnemonic, indices) {
  if (!mnemonic) return [];
  const seed = mnemonicToSeedSync(mnemonic);
  const seedHex = seed.toString("hex");

  return indices.map((index) => {
    const path = `${SOL_PATH_PREFIX}/${index}'/0'`;
    const derived = derivePath(path, seedHex);
    const keypair = Keypair.fromSeed(derived.key);
    return {
      chain: "solana",
      index,
      path,
      address: keypair.publicKey.toBase58(),
      publicKey: keypair.publicKey.toBase58(),
    };
  });
}

const badgeClasses = {
  bitcoin: "bg-amber-500/10 text-amber-300 border-amber-500/40",
  ethereum: "bg-violet-500/10 text-violet-300 border-violet-500/40",
  solana: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
};

const badgeLabel = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
};

function App() {
  const [mode, setMode] = useState("generate"); // "generate" | "custom"
  const [mnemonic, setMnemonic] = useState("");
  const [selectedChains, setSelectedChains] = useState(["bitcoin", "ethereum", "solana"]);
  const [error, setError] = useState("");

  const isMnemonicValid = useMemo(() => {
    const trimmed = mnemonic.trim();
    if (!trimmed) {
      return false;
    }
    const valid = validateMnemonic(trimmed);
    if (!valid) {
      return false;
    }
    return true;
  }, [mnemonic]);

  useEffect(() => {
    // Keep this effect for simple demo feedback; eslint warning is acceptable here.
    const trimmed = mnemonic.trim();
    if (!trimmed) {
      setError("");
      return;
    }
    if (!validateMnemonic(trimmed)) {
      setError("Mnemonic is not valid BIP39. Please check the words and spacing.");
    } else {
      setError("");
    }
  }, [mnemonic]);

  const accounts = useMemo(() => {
    if (!isMnemonicValid || selectedChains.length === 0) return [];

    const all = [];
    if (selectedChains.includes("bitcoin")) {
      all.push(...deriveBtcAccounts(mnemonic.trim(), DEFAULT_INDICES));
    }
    if (selectedChains.includes("ethereum")) {
      all.push(...deriveEthAccounts(mnemonic.trim(), DEFAULT_INDICES));
    }
    if (selectedChains.includes("solana")) {
      all.push(...deriveSolAccounts(mnemonic.trim(), DEFAULT_INDICES));
    }
    return all;
  }, [mnemonic, isMnemonicValid, selectedChains]);

  const handleGenerate = () => {
    const next = generateMnemonic();
    setMode("generate");
    setMnemonic(next);
  };

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // ignore
    }
  };

  const disableDerive = !isMnemonicValid || selectedChains.length === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400/80">
            Week 2 • Mnemonics
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            Mnemonic &amp; Derivation Playground
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Generate a mnemonic phrase or paste your own, then derive{" "}
            <span className="font-semibold text-sky-300">
              Bitcoin, Ethereum, and Solana
            </span>{" "}
            accounts using standard paths.
          </p>
        </header>

        <main className="grid flex-1 gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="space-y-4">
            <Card className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    Mnemonic phrase
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Choose how you want to provide the seed phrase.
                  </p>
                </div>
                <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/80 p-1 text-xs">
                  <Button
                    type="button"
                    variant={mode === "generate" ? "primary" : "ghost"}
                    className="rounded-lg px-3 py-1 text-[11px]"
                    onClick={() => setMode("generate")}
                  >
                    Generate
                  </Button>
                  <Button
                    type="button"
                    variant={mode === "custom" ? "primary" : "ghost"}
                    className="rounded-lg px-3 py-1 text-[11px]"
                    onClick={() => setMode("custom")}
                  >
                    Enter your own
                  </Button>
                </div>
              </div>

              <TextArea
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                readOnly={mode === "generate"}
                placeholder="treat noodle lion ... (12 or 24 words)"
                className="text-xs leading-relaxed"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="px-3 py-1 text-[11px]"
                    onClick={handleGenerate}
                  >
                    Generate new phrase
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-3 py-1 text-[11px]"
                    onClick={() => handleCopy(mnemonic)}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Words:{" "}
                  <span className="font-mono text-slate-300">
                    {mnemonic.trim() ? mnemonic.trim().split(/\s+/).length : 0}
                  </span>{" "}
                  • {isMnemonicValid ? "Valid BIP39" : "Not valid BIP39"}
                </p>
              </div>

              {error && (
                <p className="text-[11px] font-medium text-rose-400">{error}</p>
              )}

              <p className="mt-1 text-[10px] text-slate-500">
                Never use real wallet seed phrases here. This is for{" "}
                <span className="font-semibold text-slate-300">
                  learning only
                </span>
                .
              </p>
            </Card>

            <Card className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    Chains &amp; derivation
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Pick which chains to derive from this mnemonic.
                  </p>
                </div>
                <ToggleGroup
                  value={selectedChains}
                  onChange={setSelectedChains}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <p className="text-[11px] text-slate-400">
                  Using indices{" "}
                  <span className="font-mono text-slate-200">
                    {DEFAULT_INDICES.join(", ")}
                  </span>{" "}
                  for each enabled chain.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  disabled={disableDerive}
                  className="px-3 py-1 text-[11px]"
                >
                  Derive accounts
                </Button>
              </div>
            </Card>
          </section>

          <section className="space-y-3">
            <Card className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    Derived accounts
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Paths and addresses based on your mnemonic.
                  </p>
                </div>
                <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-400">
                  {accounts.length} account{accounts.length === 1 ? "" : "s"}
                </span>
              </div>

              {disableDerive ? (
                <p className="text-xs text-slate-500">
                  Enter a{" "}
                  <span className="font-semibold text-slate-300">
                    valid mnemonic
                  </span>{" "}
                  and select at least one chain to see derived accounts.
                </p>
              ) : accounts.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No accounts to show yet. Adjust your selection above.
                </p>
              ) : (
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="divide-y divide-slate-800/80"
                >
                  {accounts.map((acc) => (
                    <motion.li
                      key={`${acc.chain}-${acc.index}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-start justify-between gap-3 py-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${badgeClasses[acc.chain]}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {badgeLabel[acc.chain]} • idx {acc.index}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {acc.path}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-100">
                          {shorten(acc.address, 8)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="mt-1 whitespace-nowrap px-2 py-1 text-[11px]"
                        onClick={() => handleCopy(acc.address)}
                      >
                        Copy
                      </Button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
