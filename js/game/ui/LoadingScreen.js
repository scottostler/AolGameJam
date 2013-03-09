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
	this.mLoadingText = this.CreateUIEntity(TGE.Text).Setup(480, 480, "Loading: 0" , "bold 40px Arial", "center", "middle", "black", "UI");
};

LoadingScreen.prototype.UpdateProgress = function(percentComplete)
{
	this.mLoadingText.text = "Loading: " + (percentComplete*100) + "%";
};