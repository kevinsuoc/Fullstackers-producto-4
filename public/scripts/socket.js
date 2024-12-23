import { getWsEndpoint } from "./querisFr.js";

export const socket = io();

socket.on("connect", () => {
  console.log("Socket.io conectado");
});

const SubscriptionClient = SubscriptionsTransportWs.SubscriptionClient;

export const wsClient = new SubscriptionClient(getWsEndpoint(), {
  reconnect: true,
});

wsClient.on("connected", () => {
  console.log("WS Conectado");
});

wsClient.on("disconnected", () => {
  // console.log('WS Desconectado');
});
