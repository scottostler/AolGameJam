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
		var ship = 			CreateScreenUI(this,0.5,0.5,"mm_SpaceShip","background");
		var GameName = 		CreateScreenUI(this,0.5,0.1,"GameName","background");
		ship.scaleX = 0.5;
		ship.scaleY = 0.5;
		//this.titleText = 	CreateTextUI(this,0.5,0.1,"Main Menu","bold 40px Arial","center","white");
		var playButton =	CreateButtonUI(this,0.5,0.3,"PlayButton",this.playGame.bind(this),1,"background");
		var HelpButton =	CreateButtonUI(this,0.5,0.35,"HelpButton",this.playGame.bind(this),1,"background");
		var HighScoreButton =	CreateButtonUI(this,0.5,0.4,"HighScoreButton",this.playGame.bind(this),1,"background");
		//playButton.addChild(CreateTextUI(this,0,0,"Play Game","bold 32px Arial","center","black"));
		playButton.scaleX = 0.56;
		playButton.scaleY = 0.56;
		HelpButton.scaleX = 0.56;
		HelpButton.scaleY = 0.56;
		HighScoreButton.scaleX = 0.56;
		HighScoreButton.scaleY = 0.56;
		
	},
	

	playGame: function(func)
	{
		this.Close();
		this.Game().PlayGame();
	},
	
};


extend(MainMenu, TGE.Screen, null);

