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

MyGame = function()
{
    window.game = this;

    // Make sure to call the constructor for the TGE.Game superclass
    MyGame.superclass.constructor.call(this);

    var loadingAssets = [
        {id:'splash',  		 			url:'images/screens/loading/background.jpg'},
        {id:'FuelingShip',  		 	url:'images/screens/loading/FuelingShip.png'},

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
		
        {id:'gameover_background', 		url:'images/screens/gameover/gameover_background.jpg'},
		
        {id:'selection',   				url:'images/gameassets/selection.png'},
        {id:'spaceship',   				url:'images/gameassets/spaceship.png'},
        {id:'static_back',   			url:'images/gameassets/static_back.png'},
        {id:'scroll',   				url:'images/gameassets/scroll.png'},
        {id:'ast_death',   				url:'images/gameassets/ast_death.png'},
        {id:'asteroid_small', 			url:'images/gameassets/asteroid_small.png'},
        {id:'asteroid_big', 			url:'images/gameassets/asteroid_big.png'},
        {id:'asteroid_giant', 			url:'images/gameassets/asteroid_giant.png'}
    ];

    var gameSounds = [
    ];

    if(!this.oniOS())
    {
        gameAssets = gameAssets.concat(gameSounds);
    }

	for(var iter = 0; iter < 180; iter++)
	{
		var newId = "movie_"+iter;
		var newUrl = "images/LaunchIntro/Spaceship _Layers_00";
		if(iter < 100)
		{
			newUrl += "0";
		}
		if(iter < 10)
		{
			newUrl += "0";
		}
		newUrl += iter;
		newUrl += ".jpg";
		var array = [];
		array[0] = {id:newId,url:newUrl};
		gameAssets = gameAssets.concat(array);
	}
    this.assetManager.assignImageAssetList("loading", loadingAssets);
    this.assetManager.assignImageAssetList("required", gameAssets);
    this.assetManager.rootLocation = GameConfig.CDN_ROOT;
	this.background;
	this.score = 0;
	this.spaceShip;
	this.speedMultiplier = 1;
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
		this.score = 0;
		this.bgManager = new BackgroundManager(this);
		this.bgManager.Setup();
		this.scoreText = CreateTextUI(this,0.5,0.05,"Score: ","bold 40px Arial","center","White");
		this.spaceShip = this.CreateWorldEntity(Spaceship).Setup(0.5,0.9,"spaceship","spaceship");
		
        this.CreateWorldEntity(TGE.ScreenEntity).Setup(
            150, this.Height() - 50, "power", "UI");

        var meterScale = 0.5;
        var meter = this.CreateWorldEntity(TGE.ScreenEntity).Setup(
            450, this.Height() - 53, "power_meter", "UI");
        meter.scaleX = meter.scaleY = meterScale;

		this.spawner = new Spawner(this);

        this.powerMeterBaseWidth = 340;
        this.powerMeterMask = this.createBox('#222', 280, this.Height() - 64, this.powerMeterBaseWidth, 18, "UI");
    },

    subclassSetupLevel: function(levelNumber)
    {
    },

    subclassUpdateGame: function(elapsedTime)
    {
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
												text , properties, xAlign, "middle", color, "UI");
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







