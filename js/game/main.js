// Utility functions
	
function collided(obj1X,obj1Y,obj2X,obj2Y,totalDistance)
{
	var xDistance = obj1X - obj2X;
	var yDistance = obj1Y - obj2Y;
	var distance = Math.sqrt(yDistance*yDistance+xDistance*xDistance);
	return ( distance < totalDistance);
}

function detectFirstCollision(a, bs, callback) {
    for (var i = 0; i < bs.length; i++) {
        var b = bs[i];
        var didCollide = collided(
        a.x + a.offsetX,
        a.y + a.offsetY,
        b.x + b.offsetX,
        b.y + b.offsetY,
        a.radius + b.radius);

        if (didCollide) {
            callback(a, b);
            return i;
        }
    }

    return -1;
}

function loadFont(fontFamily, src) {
    try {
        var font = new Font();
        font.fontFamily = fontFamily;
        font.src = src;
    } catch (e) { 
        console.error('Error loading ' + fontFamily, e);
    }
}

MyGame = function()
{
    window.game = this;

    // Make sure to call the constructor for the TGE.Game superclass
    MyGame.superclass.constructor.call(this);

    var loadingAssets = [
        {id:'splash',  		 			url:'images/screens/loading/background.jpg'},
        {id:'FuelingShip',  		 	url:'images/screens/loading/FuelingShip.png'},
        {id:'AsteroidHater',  		 	url:'images/screens/loading/AsteroidHater.png'},

    ];

    // Define the image assets we need for the game
    var platformClick = TGE.BrowserDetect.isMobileDevice ? "tap" : "click";
    var gameAssets = [
        {id:'button', 		url:'images/screens/button.png'},
		{id:'power', url:'images/power.png'},
        {id:'power_meter', url:'images/power_meter_full.png'},

        {id:'game_background',      	url:'images/screens/mainmenu/game_background.jpg'},
        {id:'MainBackground',  	    	url:'images/screens/mainmenu/MainBackground.png'},
        {id:'mm_SpaceShip',      		url:'images/screens/mainmenu/mm_SpaceShip.png'},
        {id:'PlayButton',     		 	url:'images/screens/mainmenu/PlayButton.png'},
        {id:'HelpButton',     		 	url:'images/screens/mainmenu/HelpButton.png'},
        {id:'HighScoreButton',     	 	url:'images/screens/mainmenu/HighScoreButton.png'},
        {id:'GameName',     	 		url:'images/screens/mainmenu/GameName.png'},
		
        {id:'BackButton',     	 		url:'images/screens/highscore/BackButton.png'},
        {id:'HighScores',     	 		url:'images/screens/highscore/HighScores.png'},
        {id:'Numbers',     	 			url:'images/screens/highscore/Numbers.png'},
		
        {id:'GameOver', 				url:'images/screens/gameover/GameOver.png'},
        {id:'MainMenuButton', 			url:'images/screens/gameover/MainMenuButton.png'},
        {id:'Score', 					url:'images/screens/gameover/Score.png'},
        {id:'ReplayButton', 			url:'images/screens/gameover/ReplayButton.png'},
        {id:'TweetButton', 			    url:'images/screens/gameover/TweetButton.png'},
		
        {id:'PauseButton',   			url:'images/gameassets/PauseButton.png'},
        {id:'MainMenuButton',   		url:'images/gameassets/MainMenuButton.png'},
        {id:'ContinueButton',   		url:'images/gameassets/ContinueButton.png'},
        {id:'selection',   				url:'images/gameassets/selection.png'},
        {id:'spaceship',   				url:'images/gameassets/spaceship.png'},
        {id:'static_back',   			url:'images/gameassets/static_back.png'},
        {id:'scroll',   				url:'images/gameassets/scroll.png'},
        {id:'ast_death',   				url:'images/gameassets/ast_death.png'},
        {id:'big_ast_death',   			url:'images/gameassets/big_ast_death.png'},
        {id:'giant_ast_death',   		url:'images/gameassets/giant_ast_death.png'},
        {id:'asteroid_small', 			url:'images/gameassets/asteroid_small.png'},
        {id:'asteroid_big', 			url:'images/gameassets/asteroid_big.png'},
        {id:'shot', 					url:'images/gameassets/shot.png'},
        {id:'shot_fizz', 				url:'images/gameassets/shot_fizz.png'},
        {id:'three_beam', 				url:'images/gameassets/three_beam.png'},
        {id:'energy_ball',   			url:'images/gameassets/energy_ball.png'},
        {id:'asteroid_giant', 			url:'images/gameassets/asteroid_giant.png'},
        {id:'MenuButton', 				url:'images/gameassets/MenuButton.png'},
        {id:'ship_death', 				url:'images/gameassets/ship_death.png'},


        {id:'MX_GAME',					url:'audio/MX_GAME.ogg', 			assetType:"audio"}
		
    ];

    var gameSounds = [
        {id:'Laser1',					url:'audio/Laser1.ogg', 				assetType:"audio"},
		{id:'Laser2',					url:'audio/Laser2.ogg', 				assetType:"audio"},
		{id:'Laser3',					url:'audio/Laser3.ogg', 				assetType:"audio"},
        {id:'Explosion1_01',			url:'audio/Explosion1_01.ogg', 			assetType:"audio"},
		{id:'Explosion2_01',			url:'audio/Explosion2_01.ogg', 			assetType:"audio"},
		{id:'Explosion2_02',			url:'audio/Explosion2_02.ogg', 			assetType:"audio"},
		{id:'Explosion3_01',			url:'audio/Explosion3_01.ogg', 			assetType:"audio"},
		{id:'INTRO_SFX',				url:'audio/INTRO_SFX.ogg', 				assetType:"audio"},
		{id:'UI_Click',					url:'audio/UI_Click.ogg', 				assetType:"audio"},
		{id:'ShipDeath',				url:'audio/ShipDeath.ogg', 				assetType:"audio"},
		
		{id:'TitleScreenAmbience',		url:'audio/TitleScreenAmbience.ogg', 	assetType:"audio"},
    ];

    loadFont("Digital-7", "font/digital-7.ttf");

    if(!this.oniOS())
    {
        gameAssets = gameAssets.concat(gameSounds);
    }

    this.assetManager.assignImageAssetList("loading", loadingAssets);
    this.assetManager.assignImageAssetList("required", gameAssets);
    this.assetManager.rootLocation = GameConfig.CDN_ROOT;
	this.background;
	this.score = 0;
	this.spaceShip;
	this.speedMultiplier = 1;
	this.lose = false;
	this.maxHuge = 0;	
	this.allAsteroids = [];

    window.onblur = this.onBlur.bind(this);
    window.pagehide = this.pageHide.bind(this);
}

MyGame.prototype =
{
    getAsteroids: function() {
        return this.mGameManager.mObjectsArray.filter(function(o) {
            return o instanceof Asteroid && !o.mMarkedForRemoval;
        });
    },

    getBullets: function() {
        return this.mGameManager.mObjectsArray.filter(function(o) {
            return o instanceof Bullet && !o.mMarkedForRemoval;
        });
    },

    createBox: function(backgroundColor, xVal, yVal, width, height, layerVal) {
        var temp = new TGE.DisplayObjectContainer();
        temp.registrationX = temp.registrationY = 0;
        temp.backgroundColor = backgroundColor;
        temp.width = width;
        temp.height = height;
        temp.x = xVal;
        temp.y = yVal;
        temp.alpha = 1.0;
        this.getLayer(layerVal).addChild(temp);
        return temp;
    },

    subclassSetupLayers: function()
    {
        this.CreateLayer("background");
        this.CreateLayer("solar");
        this.CreateLayer("asteroid");
        this.CreateLayer("spaceship");
        this.CreateLayer("gascloud");
        this.CreateLayer("specials");
        this.CreateLayer("UI");
    },

    subclassStartPlaying: function()
    {
		for(var i = this.allAsteroids.length-1; i > -1; i++)
		{
			this.allAsteroids[i].markForRemoval();
			this.allAsteroids.splice(i,1);
		}
		
		this.score = 0;
		this.lose = false;
        this.win = false;
        this.score = 0;
		this.bgManager = new BackgroundManager(this);
		this.bgManager.Setup();
		if(this.scoreText == null)
			this.scoreText = CreateTextUI(this,0.05,0.05,"Score: ","bold 40px Digital-7","left","White");
		this.spaceShip = this.CreateWorldEntity(Spaceship).Setup(0.5,0.9,"spaceship","spaceship");

        this.CreateWorldEntity(TGE.ScreenEntity).Setup(150, this.Height() - 50, "power", "UI");

        var meterScale = 0.5;
        var meter = this.CreateWorldEntity(TGE.ScreenEntity).Setup( 450, this.Height() - 53, "power_meter", "UI");
        meter.scaleX = meter.scaleY = meterScale;

		var MenuButton = CreateButtonUI(this,0.8,0.05,"MenuButton",this.onBlur.bind(this),1,"background");
		this.spawner = new Spawner(this);
        this.powerMeterBaseWidth = 340;
        this.powerMeterMask = this.createBox('#222', 280, this.Height() - 64, this.powerMeterBaseWidth, 18, "UI");
		this.powerMeterMask.alpha = 0.8;
		this.audioManager.Play({id:"MX_GAME", loop:false});
		this.maxHuge = 0;
    },

    subclassSetupLevel: function(levelNumber)
    {
    },

    subclassUpdateGame: function(elapsedTime)
    {
		if(this.lose)
		{
			this.EndGame();
		} else if (this.win) {
            this.EndGame();
        }
    	this.spawner.update(elapsedTime);
		this.bgManager.moveObjects(elapsedTime);
		
		//Update Score
		this.scoreText.text = "Score: " + this.score;

		this.checkMouseState(elapsedTime);
    },

	checkMouseState: function(elapsedTime) {
		var isMouseReleased = this.wasMasDown && !this.isMouseDown();
		if(isMouseReleased) {
			this.spaceShip.attemptFireBullet();
			this.spaceShip.resetPowerCharge();
		} else if (this.isMouseDown()) {
			this.spaceShip.updatePowerCharge(elapsedTime);
		}

		this.wasMasDown = this.isMouseDown();
        this.drawPowerMeter(this.spaceShip.powerChargeFraction());
    },

    drawPowerMeter: function(f) {
        this.powerMeterMask.width = this.powerMeterBaseWidth * (1-f);
        this.powerMeterMask.x = 280 + this.powerMeterBaseWidth - this.powerMeterMask.width;
    },

    subclassMouseDown: function()
    {
    },

    subclassEndGame: function()
    {
        if (this.win) {
            playVideo('video/Spaceship_Landing.mov', 5000, function() {});
        }

        GAMESAPI.postScore(this.score, function() {
            console.log("Posted score of ", this.score)
        }.bind(this), function(r) {
            console.error("Error posting score", r)
        });
    },

    onBlur: function()
    {
        if(this.mPlaying && !this.levelOver)
        {
            this.PauseGame(true);
            this.audioManager.Mute();
        }
    },

    pageHide: function()
    {
        if(this.mPlaying)
        {
            this.PauseGame(true);
            this.audioManager.Mute();
        }
    },
	
	
	itemClicked: function()
	{
		this.gameResult = "win";
		this.moveMe = true;
		this.score += 10;
	}

}
extend(MyGame,TGE.Game);


function CreateTextUI(screen,xPos,yPos,text,properties,xAlign,color)
{
	return screen.CreateUIEntity(TGE.Text).Setup(screen.mScreenManager.XFromPercentage(xPos), 
												screen.mScreenManager.YFromPercentage(yPos), 
												text, properties, xAlign, "middle", color, "UI");
}

function CreateScreenUI(screen,xPos,yPos,name,layer)
{
	return screen.CreateUIEntity(TGE.ScreenEntity).Setup(screen.mScreenManager.XFromPercentage(xPos),
														 screen.mScreenManager.YFromPercentage(yPos),
														name, layer);
}

function CreateButtonUI(screen,xPos,yPos,name,callback,frames,layer)
{
    return screen.CreateUIEntity(TGE.Button).Setup( screen.mScreenManager.XFromPercentage(xPos), 
													screen.mScreenManager.YFromPercentage(yPos),
													name, callback, frames, layer);
}





