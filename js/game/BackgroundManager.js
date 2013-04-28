BackgroundManager = function(game) {
	this.mGame = game;
	this.backgroundElements = [];
	this.fallSpeed =300;
};


BackgroundManager.prototype =
{
    Setup: function(xPos,yPos)
    {
		var static_back = CreateScreenUI(this.mGame,0.5,0.5,"MainBackground","background");
		var background = CreateScreenUI(this.mGame,0.5,0.5,"scroll","background");
		var secondBg = CreateScreenUI(this.mGame,0.5,0.5,"scroll","background");
		this.backgroundElements.push(background);
		this.addToTop(secondBg);
		
    },

    subclassUpdate: function(elapsedTime)
    {
    	this.y += 120 * elapsedTime;
    },
	
	moveObjects: function(elapsedTime)
	{
		for(var i = 0; i < this.backgroundElements.length; i++)
		{
			this.backgroundElements[i].y += elapsedTime * this.fallSpeed * this.mGame.speedMultiplier;
			if(this.backgroundElements[i].y > this.mGame.Height()+this.backgroundElements[i].height/2)
			{
				this.addToTop(CreateScreenUI(this.mGame,0.5,0.5,"scroll","background"));
				this.backgroundElements[i].markForRemoval();
				this.backgroundElements.splice(i,1);
			}
		}
	},
	
	addToTop: function(object)
	{
		var highestY = 0;
		for(var i = 0; i < this.backgroundElements.length; i++)
		{
			if(this.backgroundElements[i].y < highestY)
			{
				highestY = this.backgroundElements[i].y;
			}
		}
		object.y = highestY - object.height/2;
		this.backgroundElements.push(object);
	}
}