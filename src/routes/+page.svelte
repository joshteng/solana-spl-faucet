<script lang="ts">
  import { toastStore, tokens } from "$lib";
  import { PublicKey } from "@solana/web3.js";

  let recipient: string;
  let mint: string;
  let amount: string;
  let tokenDecimals: number;
  let loading = false;

  async function _submit() {
    if (mint === "0" || !mint) {
      toastStore.add("error", "Select a token");
      return;
    }

    if (!recipient) {
      toastStore.add("error", "Input recipient address");
      return;
    }
    if (!amount) {
      toastStore.add("error", "Input amount");
      return;
    }

    try {
      new PublicKey(mint.trim());
    } catch (err) {
      toastStore.add("error", "Select a token");
    }

    try {
      new PublicKey(recipient.trim());
    } catch (err) {
      toastStore.add("error", "Recipient address invalid");
    }

    const resp = await fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({
        recipient,
        mint,
        amount: (BigInt(amount) * BigInt(10 ** tokenDecimals)).toString(),
      }),
    });
    const res = await resp.json();

    if (resp.status != 200) {
      toastStore.add("error", "Failed to mint: " + res.message);
      return;
    }

    toastStore.add(
      "success",
      "Enjoy your new found wealth: " +
        `<a href="https://solscan.io/tx/${res.txHash}?cluster=devnet">click to see tx</a>`
    );
  }

  async function submit() {
    try {
      loading = true;
      await _submit();
    } catch (err) {
      console.log(err);
    } finally {
      loading = false;
    }
  }

  $: if (mint) {
    for (const [i, token] of tokens.entries()) {
      if (mint === token.publicKey.toBase58())
        tokenDecimals = tokens[i].decimals;
    }
  }
</script>

<div class="mt-10 md:mt-28 w-full flex justify-center">
  <form class="w-full md:w-1/2" on:submit|preventDefault={submit}>
    <div class="form-control w-full">
      <label class="label" for="">
        <span class="label-text">Token</span>
      </label>
      <select class="select select-bordered w-full" bind:value={mint}>
        <option disabled selected value="0">Pick your token</option>
        {#each tokens as token}
          <option value={token.publicKey.toBase58()}>{token.name}</option>
        {/each}
      </select>
      {#if tokenDecimals}
        <label class="label pb-0" for="">
          <span class="hidden md:block label-text leading-none">{tokenDecimals} decimals</span>
          <span class="label-text-alt leading-none">{mint}</span>
        </label>
      {/if}
    </div>

    <div class="form-control w-full mt-5 md:mt-8">
      <label class="label" for="">
        <span class="label-text">Recipient</span>
      </label>
      <input
        type="text"
        placeholder="JUPUftwg2cSudukhrjAV3P5uXjoDSvw3Wpw6CxA5Ndm"
        bind:value={recipient}
        class="input input-bordered w-full"
      />
    </div>

    <div class="form-control w-full mt-5 md:mt-8">
      <label class="label" for="">
        <span class="label-text">How much?</span>
      </label>
      <input
        type="number"
        placeholder="10000"
        bind:value={amount}
        class="input input-bordered w-full"
      />
    </div>

    <div class="form-control w-full mt-5 md:mt-8">
      <button class="btn btn-primary w-full">
        Mint
        {#if loading}
          <span class="loading loading-infinity loading-md" />
        {/if}
      </button>
    </div>
  </form>
</div>
