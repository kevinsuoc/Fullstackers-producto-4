export const socket = io("http://localhost:8080");

socket.on("connect", () => {
  console.log("Socket.io conectado");
});

const SubscriptionClient = SubscriptionsTransportWs.SubscriptionClient

export const wsClient = new SubscriptionClient('ws://localhost:8080/graphql', {
    reconnect: true,
});

wsClient.on('connected', () => {
   console.log('WS Conectado');
});

wsClient.on('disconnected', () => {
  // console.log('WS Desconectado');
});
