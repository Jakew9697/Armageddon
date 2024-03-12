const canvas = document.querySelector('canvas');
// calling c because we are going to be using alot. This is my 1 exception for calling a variable a very short name.
const c = canvas.getContext('2d');

// 16x9 ratio for most screen sizes.
canvas.width = 1024
canvas.height = 576

// drawing area
c.fillRect(0, 0, canvas.width, canvas.height)

// ?added global gravity but now hit boxes are melting off screen when they reach the bottom of the canvas.?
const gravity = 0.2

class Sprite {
    // wrapping arguments to remove the issue of remembering which order of arguments. The wrapped arguments are now "and/or" rather than "required". ALso, cleaner and easier to manage. 
    constructor({position, velocity}) {
        this.position = position;
        // altering Sprites position
        this.velocity = velocity;
        this.height = 150
    }

    draw(){
        c.fillStyle ='red';
        c.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    // 
    update(){
        this.draw()
        // in order to make sprites fall
        // for position on y axis, add on y velocity.
        this.position.y += this.velocity.y;

        // if player jumps, gravity makes them fall down
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
            // only add gravity onto y velocity if our player and the enemy are above the canvas height. This stops them from melting below the canvas.
        } else this.velocity.y += gravity
    }
}

const player = new Sprite({
    position:{
    // place new sprite at top left of screen to start
    x: 0,
    y: 0
},
    velocity: {
    // 2d velocity to move left and right as well as up and down. Not moving by default.
    x: 0,
    y: 0,
}
})


const enemy = new Sprite({
    position:{
    // place new sprite at top left of screen to start
    x: 400,
    y: 100
},
    velocity: {
    // 2d velocity to move left and right as well as up and down. Not moving by default.
    x: 0,
    y: 0,
}
})


console.log(player);

function animate(){
    // animation loop over and over
    window.requestAnimationFrame(animate)
    // *? hit box stretching problem solved but hit boxes disappear at bottom of screen now.*?
    // 
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    // ? calling player.update and enemy.update made the hit boxes fall but created a stretching effect?
    player.update()
    enemy.update()
}

// 
animate()

// listen for keydown event that occurs whenever you press a key on keyboard
window.addEventListener('keydown', (event) => {
    console.log(event)
})