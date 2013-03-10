Spawner = function(game) {
	this.mGame = game;
	this.accumulatedTime = 0;
	this.rateOfAsteroid = 2;
};

Spawner.prototype =
{
    Setup: function(spaceship)
    {
	},
	
	update: function(elapsedTime) {
	this.accumulatedTime += elapsedTime;

		if (this.accumulatedTime > this.rateOfAsteroid) {
			this.accumulatedTime = 0;
			this.rateOfAsteroid -= 0.1;
			var asteroid = this.mGame.CreateWorldEntity(Asteroid).Setup(Math.random(), 0);

			this.mGame.enemies.push(asteroid);
		}
	},

};