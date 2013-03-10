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
		var NumbersImage = 		CreateScreenUI(this,0.2,0.5,"Numbers","background");
		//this.titleText = 	CreateTextUI(this,0.5,0.1,"Main Menu","bold 40px Arial","center","white");
		var BackButton =	CreateButtonUI(this,0.5,0.88,"BackButton",this.playGame.bind(this),1,"background");
		//playButton.addChild(CreateTextUI(this,0,0,"Play Game","bold 32px Arial","center","black"));

		GAMESAPI.getLeaders(GAMESAPI.DATA.ALLTIME, function(response) {
			var scores = response['data']['scores'];
			this.displayLeaderboard(scores);
		}.bind(this), function(response) {
			console.error(response);
		});	
	},

	displayLeaderboard: function(entries) {
		var topEntries = entries.slice(0, 10);
		for (var i = 0; i < topEntries.length; i++) {
			var entry = topEntries[i];
			console.log(entry.playerInfo.gamerHandle + " got " + entry.score);
		}
	},
	
	playGame: function(func)
	{
		this.Close();
		this.Game().GotoMainMenu();
	},
	
};


extend(HighScore, TGE.Screen, null);

