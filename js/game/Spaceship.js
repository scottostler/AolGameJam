
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
        this.LoadAnimation("flying",sprite,1,3,3,24,true);
        this.PlayAnimation("flying");
		return this;
    },

    subclassUpdate: function(elapsedTime)
    {
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
		if(!this.mGame.isMouseDown())
		{
			this.isDragged = false;
		}
	},
	
	collisionDetection: function()
	{
		var enemyArray = this.mGame.enemies;
		var x = this.x;
		var y = this.y-this.yOffset;
		for(var i = enemyArray.length-1; i > -1; i--)
		{
			if(this.mGame.collided(enemyArray[i].x,enemyArray[i].y,x,y,this.radius+enemyArray[i].width/2))
			{
				enemyArray[i].visible = false;
				enemyArray[i].markForRemoval();
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