Asteroid = function(game)
{
    // Make sure to call the constructor for the TGE.Game superclass
    Asteroid.superclass.constructor.call(this,game);
	this.asteroidSpeed = 400;
    this.radius = 50;
    this.offsetX = 0;
    this.offsetY = 0;
};


Asteroid.prototype =
{
    Setup: function(xPos,yPos)
    {
		var rand = Math.random();
		this.type = "asteroid_small";
		if(rand > 0.6)
		{
			this.type = "asteroid_big";
		}
		if(rand > 0.8)
		{
			this.type = "asteroid_giant";
		}
		var x = this.mGame.mScreenManager.XFromPercentage(xPos);
		var y = this.mGame.mScreenManager.YFromPercentage(yPos) - this.radius;
        Spaceship.superclass.Setup.call(this,x,y,this.type, "asteroid");
		this.radius = this.width/2-10;
		return this;
    },

    subclassUpdate: function(elapsedTime)
    {
    	this.y += this.asteroidSpeed * elapsedTime * this.mGame.speedMultiplier;

        if (this.y - this.radius> this.mGame.Height()) {
            this.markForRemoval();
        }

    },
}
extend(Asteroid,TGE.ScreenEntity);