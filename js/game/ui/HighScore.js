// Inherit from Screen
HighScore.prototype = new TGE.Screen();
HighScore.prototype.constructor = HighScore;
function HighScore(screenManager)
{
    TGE.Screen.call(this,screenManager);
	var titleText;
    return this;
}

HighScore.prototype =
{
	Setup: function()
	{
		this.Game().mainMenuInstance = this;
		
		var background = 	CreateScreenUI(this,0.5,0.5,"MainBackground","background");
		var HighScoresTitle = 		CreateScreenUI(this,0.5,0.1,"HighScores","background");
		HighScoresTitle.scaleX = 0.5;
		HighScoresTitle.scaleY = 0.5;
		var NumbersImage = 		CreateScreenUI(this,0.1,0.5,"Numbers","background");
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


extend(HighScore, TGE.Screen, null);

