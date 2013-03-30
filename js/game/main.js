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

function webAudioAPISupported() {
    if (typeof AudioContext !== "undefined") {
        return true;
    } else if (typeof webkitAudioContext !== "undefined") {
        return true;
    } else {
        return false;
    }
}

function soundJSQueuedLoad(sounds, complete) {
    var count = 0;
    var targetCount = 0;
    var sounds = sounds.filter(function(s) {
        if (s.backup_url) {
            return true;
        } else {
            console.warn("Skipping sound " + sound.id, sound);
        }
    });

    var loadNextSound = function() {
        var nextSound  = sounds.pop();
        createjs.Sound.registerSound(nextSound.backup_url, nextSound.id);
    }

    createjs.Sound.addEventListener('loadComplete', function(info) {
        if (sounds.length == 0) {
            complete();
        } else {
            loadNextSound();
        }
    });
    loadNextSound();
}

MyGame = function(launchOpts)
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

    ];

    var gameSounds = [
        {id:'MX_GAME', url:'audio/MX_GAME.ogg', backup_url:'audio/MX_GAME.mp3', assetType:"audio"},
        {id:'Laser1', url:'audio/Laser1.ogg', backup_url:'audio/Laser1.mp3', assetType:"audio"},
        {id:'Laser2', url:'audio/Laser2.ogg', backup_url:'audio/Laser2.mp3', assetType:"audio"},
        {id:'Laser3', url:'audio/Laser3.ogg', backup_url:'audio/Laser3.mp3', assetType:"audio"},
        {id:'Explosion1_01', url:'audio/Explosion1_01.ogg', backup_url:'audio/Explosion1_01.mp3', assetType:"audio"},
        {id:'Explosion2_01', url:'audio/Explosion2_01.ogg', backup_url:'audio/Explosion2_01.mp3', assetType:"audio"},
        {id:'Explosion2_02', url:'audio/Explosion2_02.ogg', backup_url:'audio/Explosion2_02.mp3', assetType:"audio"},
        {id:'Explosion3_01', url:'audio/Explosion3_01.ogg', backup_url:'audio/Explosion3_01.mp3', assetType:"audio"},
        {id:'UI_Click',	url:'audio/UI_Click.ogg', backup_url:'audio/UI_Click.mp3', assetType:"audio"},
        {id:'ShipDeath', url:'audio/ShipDeath.ogg',  backup_url:'audio/ShipDeath.mp3',   assetType:"audio"},
        {id:'TitleScreenAmbience',	url:'audio/TitleScreenAmbience.ogg',  backup_url:'audio/TitleScreenAmbience.mp3', 	assetType:"audio"},
        {id:'MeterCharging',  url:'audio/MeterCharging.ogg',  backup_url:'audio/MeterCharging.mp3',   assetType:"audio"},
        {id:'MeterFull',  url:'audio/MeterFull.ogg',  backup_url: 'audio/MeterFull.mp3', assetType:"audio"}
    ];

    loadFont("Digital-7", "font/digital-7.ttf");

    if(this.oniOS() && webAudioAPISupported()) {
        soundJSQueuedLoad(gameSounds, this.Launch.bind(this, launchOpts));
        this.autoLaunch = false;
    } else if (!this.oniOS()) {
        gameAssets = gameAssets.concat(gameSounds);
        this.autoLaunch = true;
    } else {
        this.autoLaunch = true;
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

    playSound: function(sound) {
        if (this.oniOS()) { // On iOS, audio playback is only enabled after a touch event.
            if (this.audioEnabledFromTouchEvent) {
                return createjs.Sound.play(sound.id, createjs.Sound.INTERRUPT_ANY, 0, 0, sound.loop, 1);
            } else {
                return null;
            }
        } else {
            try {
                this.audioManager.Play(sound);
            } catch(e) {
                console.error('error on playSound', e);
            }
            return null;
        }
    },

    stopSound: function(sound) {
        if (this.oniOS()) {
            
        } else {
            var a = this.audioManager.mplayerManagerList[sound];
            if (a) {
                try {
                    a.restartAudio();
                    a.stopAudio();
                } catch(e) {
                    console.error('error on stopSound', e);
                }
            }
        }
    },

    stopSounds: function() {
        if (this.oniOS() && this.audioEnabledFromTouchEvent) {
            createjs.Sound.stop();
        } else {
            try {
                this.audioManager.StopAll();
            } catch(e) {
                console.error('error on stopSounds', e);
            }
        }
    },

    muteSounds: function() {
        if (this.oniOS() && this.audioEnabledFromTouchEvent) {
            createjs.Sound.setMute(true);
        } else {
            try {
                this.audioManager.Mute();
            } catch(e) {
                console.error('error on muteSounds', e);
            }
        }
    },

    unmuteSounds: function() {
        if (this.oniOS()) {
            createjs.Sound.setMute(false);
        } else {
          try {
                this.audioManager.Unmute();
            } catch(e) {
                console.error('error on unmuteSounds', e);
            }
        }
    },

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
        this.allAsteroids.forEach(function(a) {
            a.markForRemoval();
        });

        this.allAsteroids = [];

		this.score = 0;
		this.lose = false;
        this.win = false;
        this.score = 0;
		this.bgManager = new BackgroundManager(this);
		this.bgManager.Setup();
		this.scoreText = CreateTextUI(this,0.05,0.05,"Score: ","bold 40px Digital-7","left","White");
		this.spaceShip = this.CreateWorldEntity(Spaceship).Setup(0.5,0.9,"spaceship","spaceship");

        var meterScale = 0.5;
        var power_graphic_y = this.oniOS() ? 100 : this.Height() - 50;
        var power_bar_y = this.oniOS() ? 100 : this.Height() - 53;
        var power_mask_y = this.oniOS() ? 89 : this.Height() - 64;

        this.CreateWorldEntity(TGE.ScreenEntity).Setup(138, power_graphic_y, "power", "UI");

        var meter = this.CreateWorldEntity(TGE.ScreenEntity).Setup(450, power_bar_y, "power_meter", "UI");
        meter.scaleX = meter.scaleY = meterScale;

		var MenuButton = CreateButtonUI(this,0.87,0.05,"MenuButton",this.onBlur.bind(this),1,"background");
		this.spawner = new Spawner(this);
        this.powerMeterBaseWidth = 340;
        this.powerMeterMask = this.createBox('#222', 280, power_mask_y, this.powerMeterBaseWidth, 18, "UI");
		this.powerMeterMask.alpha = 0.8;
		this.playSound({id:"MX_GAME", loop:true});
		this.maxHuge = 0;

    },

    subclassSetupLevel: function(levelNumber)
    {
    },

    clearIntroText: function() {
        if (this.introText1) {
            this.introText1.alpha = 0;
            this.introText1.markForRemoval();
        }
        if (this.introText2) {
            this.introText2.alpha = 0;
            this.introText2.markForRemoval();
        }

        this.introText1 = null;
        this.introText2 = null;
    },

    subclassUpdateGame: function(elapsedTime)
    {
		if(this.lose || this.win) {
            this.EndGame();
            return;            
        }
    	this.spawner.update(elapsedTime);
		this.bgManager.moveObjects(elapsedTime);
		this.scoreText.text = "Score: " + this.score;
		this.checkMouseState(elapsedTime);

        if (this.spawner.totalGameTime > 1 && this.spawner.totalGameTime < 4 && this.introText1 == null) {
            this.introText1 = CreateTextUI(this,0.5,0.37,"Move and fire with your mouse","bold 36px Digital-7","center","white", 'ui');
            this.introText2 = CreateTextUI(this,0.5,0.45,"Hold down fire for a powerful shot","bold 36px Digital-7","center","white", 'ui');
        } else if (this.spawner.totalGameTime > 4) {
            this.clearIntroText();
        }
    },

	checkMouseState: function(elapsedTime) {
		var isMouseReleased = this.wasMasDown && !this.isMouseDown();
		if(isMouseReleased) {
			this.spaceShip.attemptFireBullet();
			this.spaceShip.resetPowerCharge();

            this.isCharging = false;
            this.isFull = false;
            this.stopSound('MeterCharging');
            this.stopSound('MeterFull');

            if (this.meterFullSound) {
                this.meterFullSound.stop();
                this.meterFullSound = null;
            }

            if (this.meterChargingSound) {
                this.meterChargingSound.stop();
                this.meterChargingSound = null;
            }
		} else if (this.isMouseDown()) {
			this.spaceShip.updatePowerCharge(elapsedTime);
		}

        if (this.isMouseDown() && !this.isFull && this.spaceShip.powerCharge >= 2) {
            this.meterFullSound = this.playSound({ id: 'MeterFull', loop: true});
            this.isFull = true;
        } else if (this.isMouseDown() && !this.isCharging && this.spaceShip.powerCharge >= 0.2) {
            this.meterChargingSound = this.playSound({ id: 'MeterCharging' });
            this.isCharging = true;
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
        this.clearIntroText();
        this.scoreText.markForRemoval();


        if (this.win) {
            if (supports_h264_baseline_video())
                playVideo('video/Spaceship_Landing.mov');

            else if (supports_ogg_theora_video())
                playVideo('video/Spaceship_Landing.ogv');
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
            this.clearIntroText();

            this.PauseGame(true);
            this.muteSounds();
        }
    },

    pageHide: function()
    {
        if(this.mPlaying)
        {
            this.PauseGame(true);
            this.muteSounds();
        }
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





