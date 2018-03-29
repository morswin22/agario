let player;
let blobs = [];

let zoom = 1;
const START_SIZE = 32

let socket;

function setup() {
    createCanvas(600,600);

    socket = io.connect('http://localhost:3000');

    socket.on('heartbeat', data=>{
        blobs = [];
        for(let i = 0; i < data.length; i++) {
            if (data[i].id !== socket.id) {
                let b = new Blob(data[i].x, data[i].y, data[i].r);
                b.id = data[i].id;
                blobs.push(b);
            }
        }
    });

    player = new Blob(random(-width,width), random(-height,height), START_SIZE);
    socket.emit('start', player.toServer());

}

function draw() {
    background(0);

    translate(width/2, height/2);
    let newzoom = START_SIZE / player.r;
    zoom = lerp(zoom, newzoom, 0.1);
    scale(zoom);
    translate(-player.pos.x, -player.pos.y)

    player.update();
    player.show();

    for(let i = blobs.length-1; i >= 0; i--) {
        blobs[i].show();
        if (player.eats(blobs[i])) {
            socket.emit('eat', {id: blobs[i].id});
            blobs.splice(i,1);
        }
    }

    socket.emit('update', player.toServer());
}