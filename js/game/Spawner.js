function getURLParameter(name) {
    decodeURIComponent( (RegExp(name + '=' + '(.+?)(&|$)').exec(window.location.search)||[,""])[1] )
}

Spawner = function(game) {
    this.mGame = game;
    this.totalGameTime = 0;
    this.accumulatedTime = 0;
    this.rateOfAsteroid = 1.4;

    this.gameLength = Infinity;
    this.stopSpawningSecondsBefore = 3;

    this.nextAsteroid = 2;
    this.scale = 1.5;
};

function lerp(a, b, f)
{
    return a + f * (b - a);
}

function clamp(f, a, b) {
    return Math.max(a, Math.max(b, f));
}

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

        if (this.accumulatedTime > this.nextAsteroid) {
            this.accumulatedTime = 0;
            var spawnScale = clamp(this.totalGameTime / 240 * this.scale, 0, 1);
            this.nextAsteroid = Math.max(Math.random() * 4 / lerp(1, 5, spawnScale), 0.25);
            var asteroid = this.mGame.CreateWorldEntity(Asteroid).Setup(Math.random(), 0,this.totalGameTime);
            asteroid.asteroidSpeed *= (1 + this.totalGameTime / 120 * this.scale);
        }
    }
};