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

        var scale = spaceship.epoch > 2 ? 1 : 0.5;
        this.scaleX = scale;
        this.scaleY = scale;
        this.offsetX = 0;
        this.offsetY = 0;
        this.radius = 80 * scale;
        return this;
    },

    subclassUpdate: function(elapsedTime)
    {
    	this.y -= 200 * elapsedTime;
        this.detectAsteroidCollisions();
    },

    detectAsteroidCollisions: function() {
        var eIndex = detectFirstCollision(this, this.mGame.enemies, function(bullet, enemy) {
            bullet.visible = false;
            bullet.markForRemoval();

            enemy.visible = false;
            enemy.markForRemoval();
        });

        if (eIndex >= 0) {
            var bIndex = this.mGame.bullets.indexOf(this);
            this.mGame.bullets.splice(bIndex, 1);
            this.mGame.enemies.splice(eIndex, 1);
            this.mGame.score += 100;
        }
    }
}

extend(Bullet,TGE.ScreenEntity);