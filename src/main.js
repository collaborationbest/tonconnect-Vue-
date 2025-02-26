import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import {
    createTonConnectUIProvider,
    TonConnectUIContext,
    TonConnectUIOptionsContext
} from 'ton-ui-vue';

const { tonConnectUI, setOptions } = createTonConnectUIProvider({
    manifestUrl: 'https://tonconnect-vue.vercel.app/tonconnect-manifest.json'
});

const app = createApp(App);

app.provide(TonConnectUIContext, tonConnectUI);
app.provide(TonConnectUIOptionsContext, setOptions);

app.mount('#app');
