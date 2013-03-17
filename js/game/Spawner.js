Spawner = function(game) {
	this.mGame = game;
	this.totalGameTime = 0;
	this.accumulatedTime = 0;
	this.rateOfAsteroid = 1.4;

	this.gameLength = 5;
	this.stopSpawningSecondsBefore = 3;
};

Spawner.prototype =
{
    Setup: function(spaceship)
    {
		this.totalGameTime = 0;
	},
	
	update: function(elapsedTime) {
		this.accumulatedTime += elapsedTime;
		this.totalGameTime += elapsedTime;
		
		if (this.totalGameTime > this.gameLength) {
			this.mGame.win = true;
			return;
		} else if (this.totalGameTime > this.gameLength - this.stopSpawningSecondsBefore) {
			return;
		}

		if (this.accumulatedTime > this.rateOfAsteroid) {
			this.accumulatedTime = 0;
			this.rateOfAsteroid -= 0.05;
			if(this.rateOfAsteroid < 1)
			{
				this.rateOfAsteroid += 0.02;
			}
			if(this.rateOfAsteroid < 0.6)
			{
				this.rateOfAsteroid = 0.6;
			}
			this.mGame.CreateWorldEntity(Asteroid).Setup(Math.random(), 0,this.totalGameTime);
		}
	},
};