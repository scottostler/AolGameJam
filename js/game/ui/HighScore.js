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
        this.closed = false;
        var background =    CreateScreenUI(this,0.5,0.5,"MainBackground","background");
        var HighScoresTitle =       CreateScreenUI(this,0.5,0.1,"HighScores","background");
        HighScoresTitle.scaleX = 0.5;
        HighScoresTitle.scaleY = 0.5;
        var BackButton =    CreateButtonUI(this,0.5,0.88,"BackButton",this.playGame.bind(this),1,"background");
        this.textLines = [];

        GAMESAPI.getLeaders(GAMESAPI.DATA.ALLTIME, function(response) {
            var scores = response['data']['scores'];
            this.displayLeaderboard(scores);
        }.bind(this), function(response) {
            console.error(response);
        }); 
    },

    displayLeaderboard: function(entries) {
        if (this.closed) {
            return;
        }

        var topEntries = entries.slice(0, 7);
        for (var i = 0; i < topEntries.length; i++) {
            var entry = topEntries[i];
            var text = (i + 1) + ".  " + entry.playerInfo.gamerHandle + "      " + entry.score;
            var textUI = CreateTextUI(this, 0.15, 0.20 + 0.10 * i, text, "bold 40px Digital-7", "left", "#E85552");
            this.textLines.push(textUI);
        }
    },
    
    playGame: function(func)
    {
        this.textLines.forEach(function(t) {
            t.visible = false;
            t.markForRemoval();
        });
        this.textLines = [];
        this.closed = true;
        this.Close();
        this.Game().playSound({id:"UI_Click", loop:false});
        this.Game().GotoMainMenu();
    },
    
};


extend(HighScore, TGE.Screen, null);

