export interface Frame {
  firstPipe: PipePair;
  secondPipe: PipePair;
  bird: Bird;
  gameOver: boolean;
  gameStarted: boolean;
  width: number;
  height: number;
  score: number;
  ground: Ground;
}

export interface Bird {
  top: number;
  left: number;
  size: number;
}

export interface Ground {
  height: number;
}

export interface PipePair {
  topPipe: Pipe;
  bottomPipe: Pipe;
  show: boolean;
  left: number;
  width: number;
}

export interface Pipe {
  top: number;
  height: number;
}

export class GameController {
  private frame: Frame;

  private velocity = 0;

  constructor(
    public readonly height = 800,
    public readonly width = 400,
    public readonly pipeWidth = 50,
    public readonly pipeGap = 150,
    public readonly minTopForTopPipe = 70,
    public readonly maxTopForTopPipe = 350,
    public readonly generateNewPipePercent = 0.7,
    public readonly speed = 1,
    public readonly groundHeight = 20,
    public readonly birdX = 40,
    public readonly birdSize = 20,
    public readonly gravity = 1.5,
    public readonly jumpVelocity = 10,
    public readonly slowVelocityBy = 0.3
  ) {}

  public newGame() {
    let firstPipe = this.createPipe(true);
    let secondPipe = this.createPipe(false);

    this.frame = {
      firstPipe,
      secondPipe,
      score: 0,
      width: this.width,
      height: this.height,
      gameOver: false,
      gameStarted: false,
      bird: {
        left: this.birdX,
        top: this.height / 2 - this.birdSize / 2,
        size: this.birdSize,
      },
      ground: {
        height: this.groundHeight,
      },
    };

    return this.frame;
  }

  public nextFrame() {
    if (this.frame.gameOver || !this.frame.gameStarted) {
      return this.frame;
    }
    this.frame.firstPipe = this.movePipe(
      this.frame.firstPipe,
      this.frame.secondPipe
    );
    this.frame.secondPipe = this.movePipe(
      this.frame.secondPipe,
      this.frame.firstPipe
    );

    if (
      this.frame.bird.top >=
      this.height - this.groundHeight - this.birdSize
    ) {
      this.frame.bird.top = this.height - this.groundHeight - this.birdSize;
      this.frame.gameOver = true;
      return this.frame;
    }

    if (this.hasCollidedWithPipe()) {
      this.frame.gameOver = true;
      return this.frame;
    }

    // Gravity section
    if (this.velocity > 0) {
      this.velocity -= this.slowVelocityBy;
    }

    this.frame.bird.top += Math.pow(this.gravity, 2) - this.velocity;

    // Add score
    if (this.frame.firstPipe.left + this.pipeWidth == this.birdX - this.speed) {
      this.frame.score += 1;
    }

    // Add Score
    if (
      this.frame.secondPipe.left + this.pipeWidth ==
      this.birdX - this.speed
    ) {
      this.frame.score += 1;
    }

    return this.frame;
  }

  public start() {
    this.newGame();
    this.frame.gameStarted = true;
    return this.frame;
  }

  public jump() {
    if (this.velocity <= 0) {
      this.velocity += this.jumpVelocity;
    }
  }

  private hasCollidedWithPipe() {
    if (
      this.frame.firstPipe.show &&
      this.checkPipe(this.frame.firstPipe.left)
    ) {
      return !(
        this.frame.bird.top > this.frame.firstPipe.topPipe.height &&
        this.frame.bird.top + this.birdSize <
          this.frame.firstPipe.bottomPipe.top
      );
    }

    if (
      this.frame.secondPipe.show &&
      this.checkPipe(this.frame.secondPipe.left)
    ) {
      return !(
        this.frame.bird.top > this.frame.secondPipe.topPipe.height &&
        this.frame.bird.top + this.birdSize <
          this.frame.secondPipe.bottomPipe.top
      );
    }

    return false;
  }

  private checkPipe(left: number) {
    return (
      left <= this.birdX + this.birdSize && left + this.pipeWidth >= this.birdX
    );
  }

  private randomYForTopPipe(): number {
    return (
      this.minTopForTopPipe +
      (this.maxTopForTopPipe - this.minTopForTopPipe) * Math.random()
    );
  }

  private createPipe(show: boolean): PipePair {
    const height = this.randomYForTopPipe();

    return {
      topPipe: {
        top: 0,
        height,
      },
      bottomPipe: {
        top: height + this.pipeGap,
        height: this.height,
      },
      left: this.width - this.pipeWidth,
      width: this.pipeWidth,
      show,
    };
  }

  private movePipe(pipe: PipePair, otherPipe: PipePair) {
    if (pipe.show && pipe.left <= this.pipeWidth * -1) {
      pipe.show = false;
      return pipe;
    }

    if (pipe.show) {
      pipe.left -= this.speed;
    }

    if (
      otherPipe.left < this.width * (1 - this.generateNewPipePercent) &&
      otherPipe.show &&
      !pipe.show
    ) {
      return this.createPipe(true);
    }

    return pipe;
  }
}
