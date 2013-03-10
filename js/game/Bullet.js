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
		this.percentFull = spaceship.powerCharge/spaceship.maxPowerCharge;
        this.type = "shot";
		this.sound = "Laser1";
		this.speed =400;
		var row = 1;
		var col = 4;
		var frames = 4;
		var framerate = 24;
		this.level = 1;
		if(this.percentFull > 0.33)
		{
			this.type = "three_beam";
			this.sound = "Laser2";
			this.speed =	300;
			row = 1;
			col = 3;
			frames = 3;
			framerate = 24;
			this.level = 2;
		}
		if(this.percentFull > 0.66)
		{
			this.type = "energy_ball";
			this.sound = "Laser3";
			this.speed =	200;
			row = 1;
			col = 4;
			frames = 4;
			framerate = 24;
			this.level = 3;
		}
		
        Bullet.superclass.Setup.call(this, spaceship.x, yPos, this.type,"spaceship");
		
		this.LoadAnimation("moving",this.type,row,col,frames,framerate,true);
		this.PlayAnimation("moving");
		this.mGame.audioManager.Play({id:this.sound, loop:false});
        this.offsetX = 0;
        this.offsetY = 0;
        this.radius = this.width/2;
		this.soundDelay = 0.255;
		this.maxSoundDelay = 0.255;
        return this;
    },

    subclassUpdate: function(elapsedTime)
    {
    	this.y -= this.speed * elapsedTime * this.mGame.speedMultiplier;
        this.detectAsteroidCollisions();

        if (this.y + this.radius < 0) {
            this.markForRemoval();
        }
		this.soundDelay -= elapsedTime;
    },

    detectAsteroidCollisions: function() {	
        var eIndex = detectFirstCollision(this, this.mGame.getAsteroids(),this.callBack.bind(this));

        if (eIndex >= 0) {
            this.mGame.score += 100;
        }
    },
	
	 callBack: function(bullet, enemy) {
            if (bullet.level < enemy.level) {
                bullet.visible = false;
                bullet.markForRemoval();
            }
			else if(bullet.level == enemy.level)
			{
                bullet.visible = false;
                bullet.markForRemoval();
				enemy.visible = false;
				enemy.markForRemoval();
				if(enemy.level == 3)
				{
					this.mGame.maxHuge--;
				}
				this.createAsteroidDeath(enemy.x/this.mGame.Width(),enemy.y/this.mGame.Height(),enemy.type);
			}
			else
			{
				enemy.visible = false;
				enemy.markForRemoval();
				this.createAsteroidDeath(enemy.x/this.mGame.Width(),enemy.y/this.mGame.Height(),enemy.type);
			}
			
    },
	
	createAsteroidDeath: function (xPos,yPos,type)
	{
		var anim = CreateScreenUI(this.mGame,xPos,yPos,"ast_death","asteroid");
		
		var img = "ast_death";
		var row = 1;
		var col = 6;
		var frames = 6;
		var framerate = 24;
		var soundName = "Explosion1_01";
		var scaleMe = 1;
		if(type == "asteroid_big")
		{
			img = "big_ast_death";
			row = 3;
			col = 5;
			frames = 15;
			framerate = 24;
			soundName = "Explosion2_01";
			var scaleMe = 2;
		}
		else if(type == "asteroid_giant")
		{
			img = "giant_ast_death";
			row = 5;
			col = 5;
			frames = 25;
			framerate = 24;
			soundName = "Explosion2_02";
			var scaleMe = 10;
			
		}
		anim.LoadAnimation("exploding",img,row,col,frames,framerate,false);
		anim.PlayAnimation("exploding",this.markForRemoval.bind(anim));
		anim.scaleX = scaleMe;
		anim.scaleY = scaleMe;
		if(this.soundDelay < 0)
		{
			this.mGame.audioManager.Play({id:soundName, loop:false});
			this.soundDelay = this.maxSoundDelay;
		}
	},
}

extend(Bullet,TGE.ScreenEntity);