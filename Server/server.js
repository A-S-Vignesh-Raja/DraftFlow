const mongoose = require('mongoose');
require('dotenv').config();

const { Schema } = mongoose;
const io = require("socket.io")(3001, {
  cors: {
    origin: "https://draft-flow.vercel.app",
    //origin:"http://localhost:5173",
    methods: ["GET", "POST"],
    credentials:true,
  },
});

mongoose.connect(process.env.Mongo_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the document schema
const documentSchema = new Schema({
  _id: String,
  data: Object,
});

// Create a Mongoose model for the documents
const Document = mongoose.model('Document', documentSchema);

// Load the document or create a new one
const findOrCreateDocument = async (id) => {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;

  return await Document.create({ _id: id, data: "" });
};

io.on("connection", socket => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });

    socket.on("start-call", () => {
      socket.broadcast.to(documentId).emit("start-call");
    });

    socket.on("offer", ({ offer }) => {
      socket.broadcast.to(documentId).emit("offer", { offer });
    });

    socket.on("answer", ({ answer }) => {
      socket.broadcast.to(documentId).emit("answer", { answer });
    });

    socket.on("ice-candidate", ({ candidate }) => {
      socket.broadcast.to(documentId).emit("ice-candidate", { candidate });
    });

    socket.on("end-call", () => {
      socket.broadcast.to(documentId).emit("end-call");
    });

    // Handle when the user disconnects
    socket.on("disconnect", async () => {
      const room = io.sockets.adapter.rooms.get(documentId);
      const remainingUsers = room ? room.size : 0;

      if (remainingUsers === 0) {
        // If no users are left in the room, delete the document
        await Document.findByIdAndDelete(documentId);
        console.log(`Document ${documentId} deleted as all users have left`);
      }
    });
  });
});
