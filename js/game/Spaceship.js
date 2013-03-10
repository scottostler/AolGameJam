
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
	this.xOffset = 0;
	this.yOffset = 50;
	this.radius = 50;
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
		this.collisionDetection();
		this.x = this.mGame.mMouseX;
		if(this.mGame.mMouseY < this.mGame.mScreenManager.XFromPercentage(this.highestBarrier)+this.yOffset)
		{
			this.y = this.mGame.mScreenManager.YFromPercentage(this.highestBarrier)-this.yOffset;
		}
		else
		{
			this.y = this.mGame.mMouseY+this.yOffset;
		}
    },
	
	mouseClickedMe: function()
	{
		if(!this.isDragged)
		{
			var mX = this.mGame.mMouseX;
			var mY = this.mGame.mMouseY;
			if(mX > this.x - this.width/2 && mX < this.x + this.width/2 &&
			   mY > this.y - this.height/2 && mY < this.y + this.height/2 &&
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
	},
	
	collisionDetection: function()
	{
		var enemyArray = this.mGame.enemies;
		var x = this.x;
		var y = this.y-this.yOffset;
		for(var i = enemyArray.length-1; i > -1; i--)
		{
			var enemy = enemyArray[i];
			if(collided(enemy.x,enemy.y,x,y,this.radius+enemy.radius))
			{
				enemy.visible = false;
				enemy.markForRemoval();
				enemyArray.splice(i,1);
			}
		}
	},
	
	Destroy: function()
	{
		this.markForRemoval();
	},

}
extend(Spaceship,TGE.ScreenEntity);