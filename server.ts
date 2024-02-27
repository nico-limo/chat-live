const port = process.env.PORT || 3000;

const server = Bun.serve<WebSocketData>({
  port,
  fetch(req, server) {
    server.upgrade(req, {
      data: {
        channelId: new URL(req.url).searchParams.get("channelId"),
      },
    });
    return undefined;
  },
  websocket: {
    open(ws) {
      const chatId = ws.data.channelId;
      console.log("Connection opened ", ws.data.channelId);
      ws.subscribe(chatId);
    },
    close(ws) {
      console.log("Connection close ", ws.data.channelId);
    },
    message(ws, message) {
      console.log("Message sent ", ws.data.channelId);
      const chatId = ws.data.channelId;
      ws.publish(chatId, message);
    },
  },
});

console.log(`Listening on Localhost: ${server.port}`);

type WebSocketData = {
  channelId: string;
};
