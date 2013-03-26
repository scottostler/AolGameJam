// Inherit from Screen
PauseScreen.prototype = new TGE.Screen();
PauseScreen.prototype.constructor = PauseScreen;
function PauseScreen(screenManager)
{
    TGE.Screen.call(this,screenManager);
    return this;
}


PauseScreen.prototype.Setup = function()
{
	var resultText = 	CreateScreenUI(this,0.5,0.2,"PauseButton","UI");
	var contButton =	CreateButtonUI(this,0.5,0.4,"ContinueButton",this.resumeGame.bind(this),1,"UI");
	var mmButton =	CreateButtonUI(this,0.5,0.5,"MainMenuButton",this.goToMain.bind(this),1,"UI");
	
  this.Game().muteSounds();
};


PauseScreen.prototype.resumeGame = function()
{
    this.Game().unmuteSounds();
	this.Game().playSound({id:"UI_Click", loop:false});
    this.Game().PauseGame(false);
};
PauseScreen.prototype.goToMain = function()
{
    this.Game().unmuteSounds();
    this.Game().stopSounds();
	this.Game().playSound({id:"UI_Click", loop:false});
	this.Close();
	this.Game().GotoMainMenu();
};
