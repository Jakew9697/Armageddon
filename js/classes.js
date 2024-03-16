class Sprite {
  // wrapping arguments to remove the issue of remembering which order of arguments. The wrapped arguments are now "and/or" rather than "required". ALso, cleaner and easier to manage.
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 14;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
}

class Fighter extends Sprite {
  // wrapping arguments to remove the issue of remembering which order of arguments. The wrapped arguments are now "and/or" rather than "required". ALso, cleaner and easier to manage.
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    // altering Sprites position
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 14;
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    // in order to make sprites fall
    // for position on y axis, add on y velocity.
    this.position.y += this.velocity.y;
    // for position on x axis, add on x velocity.
    this.position.x += this.velocity.x;

    // Check boundaries of canvas to ensure player/enemy cant move out of the screen.
    if (this.position.x < 0) {
      this.position.x = 0;
    } else if (this.position.x + 50 > canvas.width) {
      this.position.x = canvas.width - 50;
    }
    if (this.position.y < 0) {
      this.position.y = 0;
    } else if (this.position.y + this.height > canvas.height) {
      this.position.y = canvas.height - this.height;
    }

    // if player jumps, gravity makes them fall down
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 44) {
      this.velocity.y = 0;
      // only add gravity onto y velocity if our player and the enemy are above the canvas height. This stops them from melting below the canvas.
    } else this.velocity.y += gravity;

    // this.velocity.y += gravity;
    // let nextY = this.position.y + this.velocity.y;
    // // Prevent the character from going below the canvas
    // if (nextY + this.height <= canvas.height) {
    //   this.position.y = nextY;
    // } else {
    //   this.position.y = canvas.height - this.height;
    // }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}
