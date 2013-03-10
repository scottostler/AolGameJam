// Inherit from Screen
MainMenu.prototype = new TGE.Screen();
MainMenu.prototype.constructor = MainMenu;
function MainMenu(screenManager)
{
    TGE.Screen.call(this,screenManager);
	var titleText;
    return this;
}

MainMenu.prototype =
{
	Setup: function()
	{
		this.Game().mainMenuInstance = this;
		
		var background = 	CreateScreenUI(this,0.5,0.5,"MainBackground","background");
		var ship = 			CreateScreenUI(this,0.5,0.6,"mm_SpaceShip","background");
		var GameName = 		CreateScreenUI(this,0.5,0.1,"GameName","background");
		//this.titleText = 	CreateTextUI(this,0.5,0.1,"Main Menu","bold 40px Arial","center","white");
		var playButton =	CreateButtonUI(this,0.5,0.4,"PlayButton",this.goToHelp.bind(this),1,"background");
		var HelpButton =	CreateButtonUI(this,0.5,0.45,"HelpButton",this.doNothing.bind(this),1,"background");
		var HighScoreButton =	CreateButtonUI(this,0.5,0.5,"HighScoreButton",this.goToHigh.bind(this),1,"background");
		//playButton.addChild(CreateTextUI(this,0,0,"Play Game","bold 32px Arial","center","black"));
		
	},
	

	playGame: function(func)
	{
		this.Close();
		this.Game().PlayGame();
	},
	goToHigh: function()
	{
		this.Close();
		this.Game().ShowScreen(HighScore);
	},
	doNothing: function()
	{
	},
	goToHelp: function()
	{
		this.Close();
		this.Game().ShowScreen(HelpScreen);
	}
};


extend(MainMenu, TGE.Screen, null);

