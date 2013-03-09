Asteroid = function(game)
{
    // Make sure to call the constructor for the TGE.Game superclass
    Asteroid.superclass.constructor.call(this,game);
};


Asteroid.prototype =
{
    Setup: function(xPos,yPos)
    {
		var x = this.mGame.mScreenManager.XFromPercentage(xPos);
		var y = this.mGame.mScreenManager.YFromPercentage(yPos);
        Spaceship.superclass.Setup.call(this,x,y,"asteroid_small");
		return this;
    },

    subclassUpdate: function(elapsedTime)
    {
    	this.y += 120 * elapsedTime;
    },
}
extend(Asteroid,TGE.ScreenEntity);