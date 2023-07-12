import type { RequestHandler } from "@sveltejs/kit";
import { PRIVATE_MINTER_PRIVATE_KEY } from "$env/static/private";
import { mint } from "$lib";
import { Keypair, PublicKey } from "@solana/web3.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

/** @type {import('./$types').ServerLoad} */
export const POST = (async ({ request }) => {
  const { recipient, mint: tokenMint, amount: _amount } = await request.json();

  const minter = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(PRIVATE_MINTER_PRIVATE_KEY))
  );

  const recipientPubKey = new PublicKey(recipient);
  const mintPubKey = new PublicKey(tokenMint);
  const amount = BigInt(_amount);
  console.log("Attempting to mint");
  console.log({ minter, recipientPubKey, mintPubKey, amount });

  try {
    const res = await mint(minter, recipientPubKey, mintPubKey, amount);
    console.log({ res });
    return new Response(JSON.stringify({ txHash: res }, null, 2), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.log({ err });
    return new Response(
      JSON.stringify({ ok: false, message: err.name }, null, 2),
      {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          ...corsHeaders,
        },
        status: 500,
      }
    );
  }
}) satisfies RequestHandler;
