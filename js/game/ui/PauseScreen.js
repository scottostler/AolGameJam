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

};


PauseScreen.prototype.resumeGame = function()
{

};
