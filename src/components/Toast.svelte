<script lang="ts">
  import { toastStore } from "$lib";

  function removeAlert(alertId: number) {
    toastStore.remove(alertId);
  }
</script>

<div class="toast toast-top toast-start z-50">
  {#each $toastStore as alert}
    <div class="alert alert-{alert.alertType} max-w-screen-sm flex">
      <span
        class="text-xs md:text-base overflow-hidden whitespace-normal text-ellipsis w-full"
        >{@html alert.alertMessage}</span
      >
      <button
        class="justify-self-end flex flex-wrap content-center h-full !m-0"
        on:click={() => removeAlert(alert.alertId)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  {/each}
</div>

<div class="hidden alert-success alert-info alert-warning alert-error" />
