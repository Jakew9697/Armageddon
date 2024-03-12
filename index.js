const canvas = document.querySelector("canvas");
// calling c because we are going to be using alot. This is my 1 exception for calling a variable a very short name.
const c = canvas.getContext("2d");

// 16x9 ratio for most screen sizes.
canvas.width = 1024;
canvas.height = 576;

// drawing area
c.fillRect(0, 0, canvas.width, canvas.height);

// ?added global gravity but now hit boxes are melting off screen when they reach the bottom of the canvas.?
const gravity = 0.16;

class Sprite {
  // wrapping arguments to remove the issue of remembering which order of arguments. The wrapped arguments are now "and/or" rather than "required". ALso, cleaner and easier to manage.
constructor({ position, velocity }) {
    this.position = position;
    // altering Sprites position
    this.velocity = velocity;
    this.height = 150;
}

draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
}

  //
update() {
    this.draw();
    // in order to make sprites fall
    // for position on y axis, add on y velocity.
    this.position.y += this.velocity.y;
    // for position on x axis, add on x velocity.
    this.position.x += this.velocity.x;
    // if player jumps, gravity makes them fall down
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
    this.velocity.y = 0;
      // only add gravity onto y velocity if our player and the enemy are above the canvas height. This stops them from melting below the canvas.
    } else this.velocity.y += gravity;
}
}

const player = new Sprite({
position: {
    // place new sprite at top left of screen to start
    x: 0,
    y: 0,
},
velocity: {
    // 2d velocity to move left and right as well as up and down. Not moving by default.
    x: 0,
    y: 0,
},
});

const enemy = new Sprite({
position: {
    // place new sprite at top left of screen to start
    x: 400,
    y: 100,
},
velocity: {
    // 2d velocity to move left and right as well as up and down. Not moving by default.
    x: 0,
    y: 0,
},
});

console.log(player);

const keys = {
a: {
    pressed: false,
},
d: {
    pressed: false,
},
w: {
    pressed: false,
},
s: {
    pressed: false,
},
};
let lastKey;

function animate() {
  // animation loop over and over
window.requestAnimationFrame(animate);
  // *? hit box stretching problem solved but hit boxes disappear at bottom of screen now.*?
  //
c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);
  // ? calling player.update and enemy.update made the hit boxes fall but created a stretching effect?
player.update();
enemy.update();

  // the code below fixes the issue of a player stopping from moving when (for example) both keys "a" and "d" are pressed, but only one is lifted regardless of which one.
player.velocity.x = 0;

if (keys.a.pressed && lastKey === "a") {
    player.velocity.x = -2;
} else if (keys.d.pressed && lastKey === "d") {
    player.velocity.x = 2;
} else if (keys.s.pressed && lastKey === "s") {
    player.velocity.y = 6.5;
}
}

//
animate();

// listen for keydown event that occurs whenever you press a key on keyboard
window.addEventListener("keydown", (event) => {
console.log(event.key);
switch (event.key) {
    // move player left with "a" key on keyboard.
    case "a":
keys.a.pressed = true;
lastKey = "a";
break;

    // move player right with "d" key on keyboard.
    case "d":
keys.d.pressed = true;
      // lastKey's added to override the previous key pressed if pressing 2 keys at once. in this case if "a" were pressed ud now be moving to the right.
lastKey = "d";
break;

    // player will jump when w is pressed
    case "w":
player.velocity.y = -7;
break;

    // player will crouch (or drop faster when in air) when s is pressed.
    case "s":
keys.a.pressed = true;
player.velocity.y = 6.5;
break;
}
console.log(event.key);
});

window.addEventListener("keyup", (event) => {
switch (event.key) {
    // stop player from moving right when the "d" is no longer being pressed
    case "d":
keys.d.pressed = false;
break;
    // stop player from moving left when the "a" is no longer being pressed
    case "a":
keys.a.pressed = false;
break;

    case "w":
keys.w.pressed = false;
break;

    case "s":
keys.s.pressed = false;
break;
}
console.log(event.key);
});
