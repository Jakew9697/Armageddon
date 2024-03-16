class Sprite {
  // wrapping arguments to remove the issue of remembering which order of arguments. The wrapped arguments are now "and/or" rather than "required". ALso, cleaner and easier to manage.
  constructor({ position, imageSrc, scale = 1 }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
  }
}

class Fighter {
  // wrapping arguments to remove the issue of remembering which order of arguments. The wrapped arguments are now "and/or" rather than "required". ALso, cleaner and easier to manage.
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
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
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    // attack box
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
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
