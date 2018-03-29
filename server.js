let blobs = [];

function Blob(id,x,y,r){
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
}

const express = require('express');

const app = express();

const server = app.listen(process.env.PORT || 3000, listen);

function listen() {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Example app listening at http://${host}:${port}/`);
}

app.use(express.static('public'));

const io = require('socket.io')(server);

setInterval(()=>{
    io.sockets.emit('heartbeat', blobs);
}, 1000/30);

io.sockets.on('connection', 
    socket=>{
        console.log(`We have a new client: ${socket.id}`);

        socket.on('start',
            data=>{
                console.log(`${socket.id}: ${data.x} ${data.y} ${data.r}`);

                let blob = new Blob(socket.id, data.x, data.y, data.r);
                blobs.push(blob);
            }
        );

        socket.on('update',
            data=>{
                let blob = undefined;
                for (let i = 0; i < blobs.length; i++) {
                    if (socket.id == blobs[i].id) {
                        blob = blobs[i];
                    }
                }
                if (blob) {
                    blob.x = data.x;
                    blob.y = data.y;
                    blob.r = data.r;
                }
            }
        )

        socket.on('eat',
            data=>{
                let blob = undefined;
                for (let i = 0; i < blobs.length; i++) {
                    if (data.id == blobs[i].id) {
                        blob = blobs[i];
                    }
                }
                if (blob) {
                    blobs.splice(data.id, 1);
                }
            }
        )
    }
);