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
		if(this.Game().win)
		{
			this.gotoMain();
		}
		var background = 	CreateScreenUI(this,0.5,0.5,"MainBackground","UI");
		this.Game().gameOverInstance = this;
		
		var resultText = 	CreateScreenUI(this,0.5,0.2,"GameOver","UI");
		resultText.scaleX = 0.9;
		resultText.scaleY = 0.9;
		var other = 	CreateScreenUI(this,0.5,0.32,"Score","UI");
		if(this.scoreText == null)
			this.scoreText = CreateTextUI(this,0.8,0.315,""+this.Game().score,"bold 64px Arial","center","red");
		//Create Button to replay game
		var replayGame =		CreateButtonUI(this,0.5,0.55,"ReplayButton",this.replayGame.bind(this),1,"UI");
		
		var quitGame =		CreateButtonUI(this,0.5,0.65,"MainMenuButton",this.goToMain.bind(this),1,"UI");
		
		this.Game().audioManager.Pause("MX_GAME");
		
		for(var i = this.Game().allAsteroids.length-1; i > -1; i--)
		{
			this.Game().allAsteroids[i].markForRemoval();
			this.Game().allAsteroids[i].y += 1000;
			this.Game().allAsteroids.splice(i,1);
		}
	},

	goToMain: function()
	{
		this.Game().audioManager.Play({id:"UI_Click", loop:false});
		this.Close();
		this.Game().GotoMainMenu();
	},
	
	replayGame: function()
	{
		this.Game().audioManager.Play({id:"UI_Click", loop:false});
		this.Close();
		this.Game().PlayGame();
	},
};
extend(GameOver,TGE.Screen);


