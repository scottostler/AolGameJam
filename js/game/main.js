MyGame = function()
{
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
        {id:'gameover_background', 		url:'images/screens/gameover/gameover_background.jpg'},
		
        {id:'selection',   				url:'images/gameassets/selection.png'},
        {id:'spaceship',   				url:'images/gameassets/spaceship.png'},
        {id:'asteroid_small', url: 'images/gameassets/asteroid_small.png'}
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
	
	
	
	this.circle;
	this.dodgeThis;
	this.background;
	this.gameResult;
	this.score = 0;
	this.moveMe = false;
	this.dodgeSpeedX = 300;
	this.spaceShip;
},



MyGame.prototype =
{
    subclassSetupLayers: function()
    {
    },

    subclassStartPlaying: function()
    {
		this.score = 0;
		this.background =  CreateScreenUI(this,0.5,0.5,"game_background","background");
		this.scoreText = CreateTextUI(this,0.5,0.1,"Score: ","bold 40px Arial","center","black");
		this.circle = CreateButtonUI(this,0.1,0.5,"selection",this.itemClicked.bind(this),1,"background");
		this.dodgeThis = CreateScreenUI(this,-0.2,0.5,"selection","background");
		this.spaceShip = this.CreateWorldEntity(Spaceship).Setup(0.5,0.9,"spaceship");

		this.spawner = new Spawner(this);
		this.enemies = [];
    },

    subclassSetupLevel: function(levelNumber)
    {
    },

    subclassUpdateGame: function(elapsedTime)
    {
    	var newEnemies = this.spawner.update(elapsedTime);
    	this.enemies.push(newEnemies);

		this.circle.x += elapsedTime*300;
		this.circle.y += elapsedTime*300;
		if(this.circle.x > this.Width())
		{
			this.gameResult = "loss";
			//this.EndGame();
		}
		if(this.moveMe)
		{
			this.circle.x = this.mMouseX;
			this.circle.y = this.mMouseY;
		}
		this.dodgeThis.x += elapsedTime	*this.dodgeSpeedX;
		
		//Update Score
		this.scoreText.text = "Score: " + this.score;
		
		if(true)
		{
			
		}
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
		var newY = Math.random()*536;
		//this.circle.x = 0.1;
		//this.circle.y = newY;
		this.moveMe = true;
		this.score += 10;
	},
	
	collided: function(obj1,obj2)
	{
		if(obj1.x < obj2.x + obj2.width)
		{
		}
	},

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







