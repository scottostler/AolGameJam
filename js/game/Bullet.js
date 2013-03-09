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
        Bullet.superclass.Setup.call(this,spaceship.x,yPos,"selection");

        var scale = spaceship.epoch > 2 ? 1 : 0.5;
        this.scaleX = scale;
        this.scaleY = scale;
        return this;
    },

    subclassUpdate: function(elapsedTime)
    {
    	this.y -= 200 * elapsedTime;
    }
}

extend(Bullet,TGE.ScreenEntity);