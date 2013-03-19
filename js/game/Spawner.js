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
    this.spawnFrequency = 3;
    this.maxSpeedMultiplier = 2;
    this.maxSpawnMultiplier = 2;
    this.rampupInMinutes = 3;
};

function lerp(a, b, f)
{
    return a + f * (b - a);
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

            var speedMultiplier = lerp(1, this.maxSpeedMultiplier, Math.min(this.totalGameTime / (60 * this.rampupInMinutes), 1));
            var spawnMultipler =  lerp(1, this.maxSpawnMultiplier, Math.min(this.totalGameTime / (60 * this.rampupInMinutes), 1));

            if (window.inDevMode) {
                document.getElementById("debug-frequency").innerHTML = 'Asterioid Spawns Every ' + (this.spawnFrequency / 2).toFixed(1) + 's';
                document.getElementById('debug-speed').innerHTML = 'Asteroid Speed ' + speedMultiplier.toFixed(2) + 'x';
                document.getElementById('debug-spawn').innerHTML = 'Asteroid Spawn ' + spawnMultipler.toFixed(2) + 'x';
            }

            this.accumulatedTime = 0;
            this.nextAsteroid = Math.random() * this.spawnFrequency / spawnMultipler;

            var asteroid = this.mGame.CreateWorldEntity(Asteroid).Setup(Math.random(), 0,this.totalGameTime);
            asteroid.asteroidSpeed *= speedMultiplier;
        }
    }
};