<<<<<<< HEAD

/*const io=require("socket.io")(3001,{
=======
// need to add voice or chat in this connection
const io=require("socket.io")(3001,{
>>>>>>> 2917368eeb6d5d2c1c1211edbbc640b916405834
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
    },
})

io.on("connection",socket =>{

    socket.on("get-document",documentId=>{
        const data = ""
        socket.join(documentId)
        socket.emit("load-document",data)

        socket.on("send-changes",delta=>{
            socket.broadcast.to(documentId).emit("receive-changes",delta)
        })

    })
    
<<<<<<< HEAD
})*/

const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

io.on("connection", socket => {

    socket.on("get-document", documentId => {
        const data = ""
        socket.join(documentId)
        socket.emit("load-document", data)

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

        socket.on("send-audio", audioBuffer => {
            socket.broadcast.to(documentId).emit("receive-audio", audioBuffer)
        })
    })
=======
>>>>>>> 2917368eeb6d5d2c1c1211edbbc640b916405834
})
