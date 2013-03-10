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
        var eIndex = detectFirstCollision(this, this.mGame.getAsteroids(), function(bullet, enemy) {
            if (!bullet.isMega) {
                bullet.visible = false;
                bullet.markForRemoval();
            }

            enemy.visible = false;
            enemy.markForRemoval();
        });

        if (eIndex >= 0) {
            this.mGame.score += 100;
        }
    }
}

extend(Bullet,TGE.ScreenEntity);