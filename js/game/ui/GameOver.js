// Inherit from Screen
GameOver.prototype = new TGE.Screen();
GameOver.prototype.constructor = GameOver;

function GameOver(screenManager)
{
    TGE.Screen.call(this,screenManager);
    this.mAd = null;
    return this;
}

GameOver.prototype =
{
	Setup: function()
	{
		this.Game().gameOverInstance = this;
		var background = 	CreateScreenUI(this,0.5,0.5,"gameover_background","UI");
		this.titleText = 	CreateTextUI(this,0.5,0.1,"GameOver","bold 40px Arial","center","black");
		
		//Create Button to replay game
		var replayGame =		CreateButtonUI(this,0.3,0.5,"button",this.replayGame.bind(this),1,"UI");
		replayGame.addChild(CreateTextUI(this,0,0,"Replay Game","bold 24px Arial","center","black"));
		
		var quitGame =		CreateButtonUI(this,0.7,0.5,"button",this.goToMain.bind(this),1,"UI");
		quitGame.addChild(CreateTextUI(this,0,0,"Main Menu","bold 32px Arial","center","black"));
		this.Game().audioManager.Pause("MX_GAME");
	},

	goToMain: function()
	{
		this.Close();
		this.Game().GotoMainMenu();
	},
	
	replayGame: function()
	{
		
		this.Close();
		this.Game().PlayGame();
	},
};
extend(GameOver,TGE.Screen);


