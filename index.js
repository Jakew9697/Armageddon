const canvas = document.querySelector("canvas");
// calling c because we are going to be using a lot. This is my 1 exception for calling a variable a very short name.
const c = canvas.getContext("2d");

// 16x9 ratio for most screen sizes.
canvas.width = 1024;
canvas.height = 576;

// drawing area
c.fillRect(0, 0, canvas.width, canvas.height);

// ?added global gravity but now hit boxes are melting off screen when they reach the bottom of the canvas.?
const gravity = 0.24;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/Background.png",
});

const shop = new Sprite({
  position: {
    x: 650,
    y: 180,
  },
  imageSrc: "./img/shop_anim.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    // place new sprite at top left of screen to start
    x: 80,
    y: 0,
  },
  velocity: {
    // 2d velocity to move left and right as well as up and down. Not moving by default.
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 180,
  },
});

const enemy = new Fighter({
  position: {
    // place new sprite at top right of screen to start
    x: 894,
    y: 0,
  },
  velocity: {
    // 2d velocity to move left and right as well as up and down. Not moving by default.
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  color: "blue",
});

console.log(player);

const keys = {
  // player keys
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
  // enemy keys
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  // animation loop over and over
  window.requestAnimationFrame(animate);
  // *? hit box stretching problem solved but hit boxes disappear at bottom of screen now.*?
  //
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  // calling background.update uses the draw function to add the background.
  background.update();
  shop.update();
  // ? calling player.update and enemy.update made the hit boxes fall but created a stretching effect?
  player.update();
  enemy.update();

  // the code below fixes the issue of a player/enemy stopping from moving when (for example) both keys "a" and "d" are pressed, but only one is lifted regardless of which one.
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -3.5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 3.5;
  } else if (keys.s.pressed && player.lastKey === "s") {
    player.velocity.y = 6.5;
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -3.5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 3.5;
  } else if (keys.ArrowDown.pressed && enemy.lastKey === "ArrowDown") {
    enemy.velocity.y = 6.5;
  }

  // detect for combat collisions.
  // selecting left right side of players attack box NOT THE LEFT SIDE. console logging "hit" if colliding with enemy sprite.
  // is the left side of the attack box less than or equal too the right side of the enemy
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    // setting isAttacking to false will prevent the enemy from being hit more than once when the attack key is pressed. This is important to track and subtract the amount of health taken from the enemy.
    player.isAttacking = false;
    enemy.health -= 10;
    // selecting enemyHealth id, specifically style and width to deduct health from enemy's health.
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    console.log("player attack hit");
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    // setting isAttacking to false will prevent the enemy from being hit more than once when the attack key is pressed. This is important to track and subtract the amount of health taken from the enemy.
    enemy.isAttacking = false;
    player.health -= 10;
    document.querySelector("#playerHealth").style.width = player.health + "%";
    console.log("enemy attack hit");
  }
  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();
// listen for keydown event that occurs whenever you press a key on keyboard
window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    // move player left with "a" key on keyboard.
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;

    // move player right with "d" key on keyboard.
    case "d":
      keys.d.pressed = true;
      // lastKey's added to override the previous key pressed if pressing 2 keys at once. in this case if "a" were pressed ud now be moving to the right.
      player.lastKey = "d";
      break;

    // player will jump when w is pressed
    case "w":
      player.velocity.y = -7;
      break;

    // player will drop faster when in air when s is pressed.
    case "s":
      keys.a.pressed = true;
      player.velocity.y = 7;
      break;

    //player will attack when the space bar is pressed
    case " ":
      player.attack();
      break;

    // enemy will move right when ArrowRight is pressed.
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;

    //enemy will move left when ArrowLeft is pressed
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;

    // enemy will jump when the ArrowUp key is pressed.
    case "ArrowUp":
      enemy.velocity.y = -7;
      break;

    // enemy will drop faster when in air when ArrowDown is pressed
    case "ArrowDown":
      enemy.velocity.y = 10;
      break;

    // enemy will attack when the the num pad #5 is pressed
    case "Clear":
      enemy.attack();
      break;
  }
  console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  // player keys
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

  // enemy keys
  switch (event.key) {
    // stop player from moving right when the "d" is no longer being pressed
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    // stop player from moving left when the "a" is no longer being pressed
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;

    case "ArrowDown":
      keys.ArrowDown.pressed = false;
      break;
  }
  console.log(event.key);
});
