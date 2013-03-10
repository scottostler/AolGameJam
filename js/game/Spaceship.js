
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
	this.maxFireCooldown = 0.2;
	this.xOffset = 0;
	this.yOffset = 50;
	this.radius = 50;
	this.maxPowerCharge = 2.0;
	this.lost = false;
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
		this.isDragged = false;
		this.powerCharge = 0;
		this.lost = false;
		return this;
    },

    subclassUpdate: function(elapsedTime)
    {

		if(this.lost)
		{
			return;
		}
    	this.fireCooldown -= elapsedTime;
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

	resetPowerCharge: function(){
		this.powerCharge = 0;
	},

	updatePowerCharge: function(elapsedTime) {
		this.powerCharge += elapsedTime;
	},

	powerChargeFraction: function() {
		return Math.min(1, this.powerCharge / this.maxPowerCharge);
	},

	attemptFireBullet: function() {
		if (this.fireCooldown > 0) {
			return null;
		}

		this.fireCooldown = this.maxFireCooldown;
		this.mGame.CreateWorldEntity(Bullet).Setup(this);
	},
	
	collisionDetection: function()
	{
		var enemyArray = this.mGame.getAsteroids();
		var x = this.x;
		var y = this.y-this.yOffset;
		for(var i = enemyArray.length-1; i > -1; i--)
		{
			var enemy = enemyArray[i];
			if(collided(enemy.x,enemy.y,x,y,this.radius+enemy.width/2))
			{
				enemy.visible = false;
				enemy.markForRemoval();
				this.LoadAnimation("death","ship_death",2,7,14,24,false);
				this.PlayAnimation("death",this.Destroy.bind(this));
				
				this.mGame.audioManager.Play({id:"ShipDeath", loop:false});
				this.lost = true;
			}
		}
	},
	
	fadeOutScreen: function()
	{
		
	},
	
	Destroy: function()
	{
		this.mGame.lose = true;
		this.markForRemoval();
	},

}
extend(Spaceship,TGE.ScreenEntity);