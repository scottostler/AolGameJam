Shield = function(game)
{
    Shield.superclass.constructor.call(this,game);
};


Shield.prototype =
{
    Setup: function(spaceship)
    {
        Shield.superclass.Setup.call(this, spaceship.x, spaceship.y, "shield","asteroid");
        this.radius=this.width/2;
        this.activeLife = 0;
        this.lastActiveScore = 0;
        this.visible=false;
        this.activated = false;
        this.LoadAnimation("shielding","shield",1,3,3,24,true);
        this.PlayAnimation("shielding");
        //this.activate(10);
        return this;
    },

    subclassUpdate: function(elapsedTime)
    {
        if (this.activated){
            this.activeLife -= elapsedTime;
            if (this.activeLife <= 0){
                this.lastActiveScore=this.mGame.score;
                this.deactivate();
            }
        }
        else {
            if (this.mGame.score-this.lastActiveScore >= 500){      // simple mechanic: acquire shield every 500 points
                this.activate(10);
            }
        }
    },

    activate: function(duration){
        this.visible=true;
        this.activated=true;
        this.activeLife = duration; // TODO: check for invalid durations?
        console.log("Activated...");
    },

    deactivate: function(){
        this.activated = false;
        this.visible = false;
        this.activeLife=0;
        console.log("Deactivated...");
    },

    syncPosition: function(x,y){
        this.x = x;
        this.y = y;
        if (this.activated) {
            this.collisionDetection();
        }
    },

    collisionDetection: function()
    {
        var enemyArray = this.mGame.getAsteroids();
        for(var i = enemyArray.length-1; i > -1; i--)
        {
            var enemy = enemyArray[i];
            if(collided(enemy.x,enemy.y, this.x, this.y,this.radius+enemy.width/4))
            {
                enemy.visible = false;
                enemy.markForRemoval();
                if (enemy.level == 3) {
                    this.mGame.maxHuge--;
                }
            }
        }
    }
};

extend(Shield,TGE.ScreenEntity);