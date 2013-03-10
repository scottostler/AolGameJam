// Inherit from Screen
PauseScreen.prototype = new TGE.Screen();
PauseScreen.prototype.constructor = PauseScreen;
function PauseScreen(screenManager)
{
    TGE.Screen.call(this,screenManager);
    return this;
}


PauseScreen.prototype.Setup = function()
{
	var playButton =	CreateButtonUI(this,0.5,0.5,"PlayButton",this.resumeGame.bind(this),1,"UI");

    this.wasMuted = this.Game().audioManager.mMuted;
    this.Game().audioManager.Mute();
};


PauseScreen.prototype.resumeGame = function()
{
    this.Game().PauseGame(false);
    if(!this.wasMuted)
    {
        this.Game().audioManager.Unmute();
    }

};
