import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

export type AlertType = "success" | "info" | "warning" | "error";

interface ToastStore {
  alertType: AlertType;
  alertMessage: string;
  alertId: number;
}

function createToastStore() {
  let alerts: ToastStore[] = [];

  const { subscribe, set } = writable(alerts);

  return {
    subscribe,
    add: (alertType: AlertType, alertMessage: string) => {
      alerts.push({
        alertType,
        alertMessage,
        alertId: uuidv4(),
      });
      set(alerts);
    },
    remove: (alertId: number) => {
      alerts = alerts.filter((alert) => alert.alertId !== alertId);
      set(alerts);
    },
  };
}

export const toastStore = createToastStore();
