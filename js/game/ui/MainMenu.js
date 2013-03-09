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
		
		var background = 	CreateScreenUI(this,0.5,0.5,"game_background","background");
		this.titleText = 	CreateTextUI(this,0.5,0.1,"Main Menu","bold 40px Arial","center","black")
		var playButton =	CreateButtonUI(this,0.5,0.5,"button",this.playGame.bind(this),1,"background")
		playButton.addChild(CreateTextUI(this,0,0,"Play Game","bold 32px Arial","center","black"));
	},
	

	playGame: function(func)
	{
		this.titleText.text = "Good job";
		this.Close();
		this.Game().PlayGame();
	},
	
};


extend(MainMenu, TGE.Screen, null);

