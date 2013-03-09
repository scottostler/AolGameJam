
Spaceship = function(game)
{
    // Make sure to call the constructor for the TGE.Game superclass
    Spaceship.superclass.constructor.call(this,game);

    this.mDesiredX = 0;
    this.mThrowsLeft = true;
    this.mMoving = false;
    this.mSpeed = 250;
	this.isDragged = false;
}


Spaceship.prototype =
{
    Setup: function(xPos,yPos,sprite,background)
    {
		var x = this.mGame.mScreenManager.XFromPercentage(xPos);
		var y = this.mGame.mScreenManager.YFromPercentage(yPos);
        Spaceship.superclass.Setup.call(this,x,y,sprite,background);
		this.isDragged = false;
		console.log("created " + x + " " + y);
		return this;
    },

    subclassUpdate: function(elapsedTime)
    {
		this.mouseClickedMe();
		if(this.isDragged)
		{
			this.x = this.mGame.mMouseX;
			this.y = this.mGame.mMouseY;
		}
    },

	mouseClickedMe: function()
	{
		if(!this.isDragged)
		{
			var mX = this.mGame.mMouseX;
			var mY = this.mGame.mMouseY;
			if(mX > this.x && mX < this.x + this.width &&
			   mY > this.y && mY < this.y + this.height &&
			   this.mGame.isMouseDown())
			{
				this.isDragged = true;
			}
		}
		if(!this.mGame.isMouseDown())
		{
			this.isDragged = false;
		}
	},
}
extend(Spaceship,TGE.ScreenEntity);