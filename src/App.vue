<template>
  <div class="container flex-col">
    <div class="flex justify-center">
      <button id="tonwalletbtn" style="border: none; background: none;"></button>
    </div>
    <div style="display: flex; flex-direction: column; gap: 10px;">
        <input
          type="text"
          class="ton-input"
          placeholder="input amount"
          v-model="amount"
        />
        <input
          type="text"
          class="ton-input"
          placeholder="input address"
          v-model="address"
        />
        <button class="send-btn" @click="sendPayment">Send</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { TonConnectUI, THEME } from "@tonconnect/ui";

export default {
  setup() {
    const amount = ref(0);
    const address = ref("");
    const myJettonAddress = ref("");
    const myAddress = ref("");
    let tonConnectUI;

    onMounted(() => {
      if (typeof window !== "undefined" && window.localStorage) {
        tonConnectUI = new TonConnectUI({
          manifestUrl: "https://tonconnect-vue.vercel.app/tonconnect-manifest.json",
          buttonRootId: "tonwalletbtn",
        });
        
        const unsubscribe = tonConnectUI.onSingleWalletModalStateChange((state) => {
          alert(`modal state ${state}`);
        });

        // Call `unsubscribe` when you want to stop listening to the state changes
        unsubscribe();

        tonConnectUI.uiOptions = {
          language: "en",
          uiPreferences: {
            theme: THEME.LIGHT,
          },
        };
      } else {
        console.error("localStorage is unavailable, TonConnect cannot be initialized.");
      }
    });

    const sendPayment = async () => {
      if (amount.value > 0 && address.value !== "") {
        const tonAddress = tonConnectUI.account.address;

        const jettonAddressResponse = await fetch("/api/getJettonAddress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tonAddress,
          }),
        });
        const result = await jettonAddressResponse.json();
        myAddress.value = result.userAddress;
        myJettonAddress.value = result.notcoin;

        const jettonWalletAddress = myJettonAddress.value;
        const toAddress = address.value;
        const responseAddress = myAddress.value;
        const jettonAmount = Number(amount.value * Math.pow(10, 9));

        const response = await fetch("/api/createTransferBody", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jettonWalletAddress,
            toAddress,
            responseAddress,
            jettonAmount,
          }),
        });
        const { payload } = await response.json();

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 360,
          messages: [
            {
              address: jettonWalletAddress,
              amount: "100000000",
              payload: payload,
            },
          ],
        };

        try {
          const result = await tonConnectUI.sendTransaction(transaction);
          console.log("Transaction sent:", result);
          const bocHash = result.boc;
        } catch (error) {
          console.error("Transaction failed:", error);
        }
      }
    };

    return {
      amount,
      address,
      myJettonAddress,
      myAddress,
      sendPayment,
    };
  },
};
</script>

<style>
.container {
  max-width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}
.ton-input {
  padding: 10px;
  border-radius: 10px;
  width: 100%;
}
.send-btn {
  padding: 10px;
  width: 100%;
  background-color: blue;
  color: white;
  border-radius: 10px;
}
</style>