import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";

export async function mint(
  minter: Keypair,
  recipient: PublicKey,
  mint: PublicKey,
  amount: bigint
) {
  const RPC = "https://api.devnet.solana.com";
  const connection = new Connection(RPC, "finalized");

  const recipientAta = await getOrCreateAssociatedTokenAccount(
    connection,
    minter,
    mint,
    recipient,
    false,
    "confirmed",
    {
      commitment: "confirmed",
    },
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return mintTo(
    connection,
    minter,
    mint,
    recipientAta.address,
    minter.publicKey,
    amount,
    [],
    {
      commitment: "confirmed",
    },
    TOKEN_PROGRAM_ID
  );
}
