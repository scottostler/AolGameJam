// Inherit from Screen
HelpScreen.prototype = new TGE.Screen();
HelpScreen.prototype.constructor = HelpScreen;
function HelpScreen(screenManager)
{
    TGE.Screen.call(this,screenManager);
	var titleText;
	this.currentBg;
	this.iter;
	this.timePassed;
	this.fadeScreen;
	this.doOnce = false;
    return this;
}

HelpScreen.prototype =
{
	Setup: function()
	{
		this.Game().helperInstance = this;
		this.parent = this.Game();
		this.iter = 0;
		this.timePassed = 0;
		this.currentBg = CreateScreenUI(this,0.5,0.5,"MainBackground","background");
		this.Game().audioManager.Play({id:"INTRO_SFX", loop:false});
		
	},
	
	Update: function(elapsedTime)
	{
		if(this.parent == null)
		{
			return;
		}
		this.timePassed += elapsedTime;
		this.iter = Math.floor(this.timePassed*90);
		var newId = "movie_"+this.iter;
		if(this.iter < 180)
		{
			this.currentBg.SetImage(newId,1,1);
		}
		else
		{
			if(!this.doOnce)
			{
				this.doOnce = true;
				this.fadeScreen = this.Game().createBox("black",this.Game().Width(),this.Game().Height(),this.mScreenManager.XFromPercentage(0),this.mScreenManager.YFromPercentage(0),"background");
				this.currentBg.SetImage("MainBackground",1,1);
			}
			else
			{
				this.fadeScreen.alpha -= elapsedTime*3;
			}
		}
		this.iter++;
		if(this.iter > 200)
		{
			this.parent = null;
			this.fadeScreen.markForRemoval();
			this.playGame();
		}
	},

	playGame: function(func)
	{
		this.Close();
		this.Game().PlayGame();
	},
	
};


extend(HelpScreen, TGE.Screen, null);

