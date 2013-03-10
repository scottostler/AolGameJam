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
    ];

    // Define the image assets we need for the game
    var platformClick = TGE.BrowserDetect.isMobileDevice ? "tap" : "click";
    var gameAssets = [
        {id:'button', 		url:'images/screens/button.png'},
		
        {id:'game_background',      	url:'images/screens/mainmenu/game_background.jpg'},
		
        {id:'gameover_background', 		url:'images/screens/gameover/gameover_background.jpg'},
		
        {id:'selection',   				url:'images/gameassets/selection.png'},
        {id:'spaceship',   				url:'images/gameassets/spaceship.png'},
        {id:'static_back',   			url:'images/gameassets/static_back.png'},
        {id:'scroll',   				url:'images/gameassets/scroll.png'},
        {id:'asteroid_small', 			url: 'images/gameassets/asteroid_small.png'}
    ];

    var gameSounds = [
    ];

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
},



MyGame.prototype =
{
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
		
		this.spawner = new Spawner(this);
		this.enemies = [];
		this.bullets = [];
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
			var bullet = this.spaceShip.attemptFireBullet();
			if (bullet) {
				this.bullets.push(bullet);
			}
			this.spaceShip.resetEpoch();
		} else if (this.isMouseDown()) {
			this.spaceShip.updateEpoch(elapsedTime);
		}

		this.wasMasDown = this.isMouseDown();
    },

    subclassMouseDown: function()
    {
    },

    subclassEndGame: function()
    {
    },
	
	collided: function(obj1X,obj1Y,obj2X,obj2Y,totalDistance)
	{
		
		var xDistance = obj1X - obj2X;
		var yDistance = obj1Y - obj2Y;
		var distance = Math.sqrt(yDistance*yDistance+xDistance*xDistance);
		return ( distance < totalDistance);
	},

	itemClicked: function()
	{
		this.gameResult = "win";
		var newY = Math.random()*536;
		//this.circle.x = 0.1;
		//this.circle.y = newY;
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







