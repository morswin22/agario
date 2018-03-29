class Blob {
    constructor (x,y,r) {
        this.pos = createVector(x,y);
        this.r = r;
        this.vel = createVector(0,0);
    }

    update() {
        let newvel = createVector(mouseX-width/2, mouseY-height/2);
        newvel.div(50);
        //newvel.setMag(3);
        newvel.limit(3);
        this.vel.lerp(newvel, 0.2);
        this.pos.add(this.vel);

        this.pos.x = constrain(this.pos.x, -width, width);
        this.pos.y = constrain(this.pos.y, -height, height);
    }

    eats(other) {
        let d = this.pos.dist(other.pos);
        if (d < this.r + other.r) {
            let sum = PI * this.r * this.r + PI * other.r * other.r;
            this.r = sqrt(sum / PI);
            return true;
        }
        return false;
    }

    show() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    }

    toServer() {
        return {
            x: this.pos.x,
            y: this.pos.y,
            r: this.r
        };
    }
}