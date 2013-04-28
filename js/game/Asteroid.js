Asteroid = function(game)
{
    // Make sure to call the constructor for the TGE.Game superclass
    Asteroid.superclass.constructor.call(this,game);
    this.asteroidSpeed = 400;
    this.radius = 50;
    this.offsetX = 0;
    this.offsetY = 0;
    this.level = 0;
    this.myRotation = 0;
    this.pointsForKilling = 0;
};


Asteroid.prototype =
{
    Setup: function(xPos,yPos,totalTime)
    {
    var rand = Math.random();
    this.level = 1;
    this.myRotation = 120;
    this.type = "asteroid_small";
    this.pointsForKilling = 100;
    if(rand > 0.6 && totalTime >10)
    {
      this.myRotation = 40;
      this.asteroidSpeed = 300;
      this.type = "asteroid_big";
      this.level = 2;
      this.pointsForKilling = 200;
    }
    if(rand > 0.8 && this.mGame.maxHuge < 2 && totalTime > 30)
    {
      this.myRotation = 20;
      this.asteroidSpeed = 200;
      this.type = "asteroid_giant";
      this.level = 3;
      this.pointsForKilling = 400;
      this.mGame.maxHuge++;
    }
    var x = this.mGame.mScreenManager.XFromPercentage(xPos);
    var y = this.mGame.mScreenManager.YFromPercentage(yPos) - this.radius;
        Asteroid.superclass.Setup.call(this,x,y,this.type, "asteroid");
    this.radius = this.width/2-10;
    this.mGame.allAsteroids.push(this);
    return this;
    },

    subclassUpdate: function(elapsedTime)
    {
      this.y += this.asteroidSpeed * elapsedTime * this.mGame.speedMultiplier;
    this.rotation += elapsedTime *this.myRotation;
        if (this.y - this.radius> this.mGame.Height()) {
            this.markForRemoval();
            if (this.level == 3) {
              this.mGame.maxHuge--;
            }
        }

    }
}
extend(Asteroid,TGE.ScreenEntity);