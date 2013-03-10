Bullet = function(game)
{
    // Make sure to call the constructor for the TGE.Game superclass
    Bullet.superclass.constructor.call(this,game);
};


Bullet.prototype =
{
    Setup: function(spaceship)
    {
        var yPos = spaceship.y - spaceship.height / 2;
        Bullet.superclass.Setup.call(this, spaceship.x, yPos, "selection","spaceship");

        this.isMega = spaceship.powerCharge >= 1;
        var scale = this.isMega ? 1 : 0.5;
        this.scaleX = scale;
        this.scaleY = scale;
        this.offsetX = 0;
        this.offsetY = 0;
        this.radius = 70 * scale;
        this.speed = this.isMega ? 200 : 400;
        return this;
    },

    subclassUpdate: function(elapsedTime)
    {
    	this.y -= this.speed * elapsedTime * this.mGame.speedMultiplier;
        this.detectAsteroidCollisions();

        if (this.y + this.radius < 0) {
            this.markForRemoval();
        }
    },

    detectAsteroidCollisions: function() {
        var eIndex = detectFirstCollision(this, this.mGame.getAsteroids(),this.callBack.bind(this));

        if (eIndex >= 0) {
            this.mGame.score += 100;
        }
    },
	
	 callBack: function(bullet, enemy) {
            if (!bullet.isMega) {
                bullet.visible = false;
                bullet.markForRemoval();
            }

            enemy.visible = false;
            enemy.markForRemoval();
			this.createAsteroidDeath(enemy.x/this.mGame.Width(),enemy.y/this.mGame.Height());
			
    },
	
	createAsteroidDeath: function (xPos,yPos)
	{
		var anim = CreateScreenUI(this.mGame,xPos,yPos,"ast_death","asteroid");
		anim.LoadAnimation("exploding","ast_death",5,5,8,24,false);
		anim.PlayAnimation("exploding",this.markForRemoval.bind(anim));
	},
}

extend(Bullet,TGE.ScreenEntity);