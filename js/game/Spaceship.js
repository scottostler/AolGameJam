
Spaceship = function(game)
{
    // Make sure to call the constructor for the TGE.Game superclass
    Spaceship.superclass.constructor.call(this,game);

    this.mDesiredX = 0;
    this.mThrowsLeft = true;
    this.mMoving = false;
    this.mSpeed = 250;
	this.isDragged = false;
	this.highestBarrier = 0.7;
	this.fireCooldown = 0;
}


Spaceship.prototype =
{
    Setup: function(xPos,yPos,sprite,background)
    {
		var x = this.mGame.mScreenManager.XFromPercentage(xPos);
		var y = this.mGame.mScreenManager.YFromPercentage(yPos);
        Spaceship.superclass.Setup.call(this,x,y,sprite,background);
		this.isDragged = false;
		this.epoch = 0;
		return this;
    },

    subclassUpdate: function(elapsedTime)
    {
    	this.fireCooldown -= elapsedTime;
		this.mouseClickedMe();
		this.x = this.mGame.mMouseX;
		if(this.mGame.mMouseY < this.mGame.mScreenManager.XFromPercentage(this.highestBarrier)+50)
		{
			this.y = this.mGame.mScreenManager.YFromPercentage(this.highestBarrier)-50;
		}
		else
		{
			this.y = this.mGame.mMouseY+50;
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
	},

	resetEpoch: function(){
		this.epoch = 0;
	},

	updateEpoch: function(elapsedTime) {
		this.epoch += elapsedTime;
	},

	attemptFireBullet: function() {
		if (this.fireCooldown > 0) {
			return null;
		}

		this.fireCooldown = 0.5;
		var bullet = this.mGame.CreateWorldEntity(Bullet).Setup(this);
		return bullet;
	}
}
extend(Spaceship,TGE.ScreenEntity);