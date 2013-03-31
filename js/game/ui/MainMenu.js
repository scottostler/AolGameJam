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
		var ship = 			CreateScreenUI(this,0.5,0.57,"mm_SpaceShip","background");
    ship.scaleY = .94;
		var GameName = 		CreateScreenUI(this,0.5,0.11,"AsteroidHater","background");
		//this.titleText = 	CreateTextUI(this,0.5,0.1,"Main Menu","bold 40px Arial","center","white");
		var playButton =	CreateButtonUI(this,0.49,0.41,"PlayButton",this.playGame.bind(this),1,"background");
	//	var HelpButton =	CreateButtonUI(this,0.5,0.45,"HelpButton",this.doNothing.bind(this),1,"background");
		var HighScoreButton =	CreateButtonUI(this,0.5,0.49,"HighScoreButton",this.goToHigh.bind(this),1,"background");
		//playButton.addChild(CreateTextUI(this,0,0,"Play Game","bold 32px Arial","center","black"));

    this.authorNames = [
      'Mulango Akpo-Esambe', 'Sande Chen', 'Johnnery De Jesus', 'Jonathan Gran',
      'Nitya Narasimhan', 'Scott Ostler', 'Son Ca Vu', 'Zac Zinger'
    ];
    this.creditsText = CreateTextUI(this, 1, 0.97, 'By: ' + this.authorNames.join(', '), "bold 32px Digital-7","left","#E85552");
		
		this.Game().playSound({id:"TitleScreenAmbience", loop:true});
	},
	

	playGame: function(func)
	{
    this.Game().stopSounds();
    this.Game().playSound({id: 'UI_Click'});

        if (supports_h264_baseline_video())  {
            playVideo('video/Spaceship_Launch.mov', function() {
                this.Close();
                this.Game().PlayGame();
            }.bind(this));
        }
        else if (supports_ogg_theora_video())  {
            playVideo('video/Spaceship_Launch.ogv', function() {
                this.Close();
                this.Game().PlayGame();
            }.bind(this));
        } else {
          this.Close();
          this.Game().PlayGame();          
        }
	},
	goToHigh: function()
	{
		this.Game().playSound({id:"UI_Click", loop:false});
		this.Close();
		this.Game().ShowScreen(HighScore);
	},
	doNothing: function()
	{
	},
	
	Update: function()
	{
    this.creditsText.x -= 3;
    if (this.creditsText.x < -this.creditsText.Width()) {
      this.creditsText.x = this.Game().Width();
    }
	},
	goToHelp: function()
	{
		this.Close();
		this.Game().ShowScreen(HelpScreen);
	}
};


extend(MainMenu, TGE.Screen, null);

