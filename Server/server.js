
const io = require("socket.io")(3001, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
  
  
  io.on("connection", socket => {
  
    socket.on("get-document", documentId => {
      const data = "";
      socket.join(documentId);
      socket.emit("load-document", data);
  
      socket.on("send-changes", delta => {
        socket.broadcast.to(documentId).emit("receive-changes", delta);
      });
  
      socket.on("start-call", () => {
        socket.broadcast.to(documentId).emit("start-call");
      });
  
      socket.on("offer", ({ offer, documentId }) => {
        socket.broadcast.to(documentId).emit("offer", { offer });
      });
  
      socket.on("answer", ({ answer, documentId }) => {
        socket.broadcast.to(documentId).emit("answer", { answer });
      });
  
      socket.on("ice-candidate", ({ candidate, documentId }) => {
        socket.broadcast.to(documentId).emit("ice-candidate", { candidate });
      });
  
      socket.on("end-call", () => {
        socket.broadcast.to(documentId).emit("end-call");
      });
    });
  });
