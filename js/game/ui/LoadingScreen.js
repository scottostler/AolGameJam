// Inherit from Screen
LoadingScreen.prototype = new TGE.Screen();
LoadingScreen.prototype.constructor = LoadingScreen;
function LoadingScreen(screenManager)
{
    TGE.Screen.call(this,screenManager);
    this.mLoadingText = null;
    return this;
}


LoadingScreen.prototype.Setup = function()
{
	var background = this.CreateUIEntity(TGE.ScreenEntity).Setup(this.mScreenManager.XFromPercentage(0.5),
																this.mScreenManager.YFromPercentage(0.5),
																"splash", "background");
	var fueling = this.CreateUIEntity(TGE.ScreenEntity).Setup(this.mScreenManager.XFromPercentage(0.5),
																this.mScreenManager.YFromPercentage(0.75),
																"FuelingShip", "background");		
	var hater = this.CreateUIEntity(TGE.ScreenEntity).Setup(this.mScreenManager.XFromPercentage(0.5),
																this.mScreenManager.YFromPercentage(0.18),
																"AsteroidHater", "background");															
	this.mLoadingText = this.CreateUIEntity(TGE.Text).Setup(this.mScreenManager.XFromPercentage(0.5), this.mScreenManager.YFromPercentage(0.83),
					"Loading: 0" , "bold 40px Arial", "center", "middle", "black", "UI");
};

LoadingScreen.prototype.UpdateProgress = function(percentComplete)
{
	this.mLoadingText.text = "Loading: " + Math.floor(percentComplete*100) + "%";
};