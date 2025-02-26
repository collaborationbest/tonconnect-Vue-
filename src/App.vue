<template>
  <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
    <div v-if="address">Connected Address: {{ address }}</div>
    <TonConnectButton />

    <div v-if="!sending" style="margin-top: 10px; display: flex; justify-content: center; align-items: center;">
      <button @click="sendTransaction"
        style="border: none; outline: none; border-radius: 10px; padding: 10px 20px; background: blue; color: white;">Send
        Transaction</button>
    </div>
    <div v-if="error">{{ error.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { TonConnectButton } from 'ton-ui-vue';
import { useTonAddress, useSendTransaction } from 'ton-ui-vue';

const address = useTonAddress();
const { sendTransaction, addMessage, sending, error } = useSendTransaction();

// Add a message for a wallet address
addMessage(
  "0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad",
  "100000000"
);
// Add another message for a contract address
addMessage(
  "0:a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef",
  "500000000"
);
</script>