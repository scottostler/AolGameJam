Spawner = function(game) {
	this.mGame = game;
	this.accumulatedTime = 0;
};

Spawner.prototype.update = function(elapsedTime) {
	this.accumulatedTime += elapsedTime;

	if (this.accumulatedTime > 2) {
		this.accumulatedTime = 0;

		var asteroid = this.mGame.CreateWorldEntity(Asteroid).Setup(Math.random(), 0);

    	this.mGame.enemies.push(asteroid);
	}

};