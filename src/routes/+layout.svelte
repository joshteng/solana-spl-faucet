<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import Toast from "../components/Toast.svelte";
  import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
  import { PUBLIC_MINTER_PUBLIC_KEY } from "$env/static/public";

  let balance: number;

  onMount(async () => {
    const RPC = "https://api.devnet.solana.com";
    const connection = new Connection(RPC, "finalized");
    balance =
      (await connection.getBalance(new PublicKey(PUBLIC_MINTER_PUBLIC_KEY))) /
      LAMPORTS_PER_SOL;
  });
</script>

<div class="safe-top safe-left safe-right safe-bottom">
  <div class="flex flex-col min-h-screen">
    <Toast />
    <header>
      <div class="navbar bg-base-100">
        <div class="flex-1 flex-wrap">
          <a href="/" class="btn btn-ghost normal-case text-xl px-1 md:px-4"
            >Raccoons Faucet<span class="hidden md:inline">&nbsp;(devnet)</span
            ></a
          >
        </div>
        {#if balance}
          <div class="flex-none">
            <div class="tooltip tooltip-bottom" data-tip="Minter's sol balance">
              <a
                class="btn btn-ghost"
                target="_blank"
                href={`https://solscan.io/account/${PUBLIC_MINTER_PUBLIC_KEY}?cluster=devnet`}
                >SOL: {balance}</a
              >
            </div>
          </div>
        {/if}
      </div>
    </header>

    <content class="flex-grow">
      <div class="mx-auto w-11/12">
        <slot />
      </div>
    </content>

    <footer class="mb-5">
      <div class="text-center text-xs">
        Raccoons &copy; {new Date().getFullYear()}
      </div>
    </footer>
  </div>
</div>
