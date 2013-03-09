// Game Object Global
var _myGame;

// Google Analytics Global
var _gaq = _gaq || [];

// Game Config Global
var GameConfig = {

    PROD_ENV: false, // set to true before deploying to production environment. Leave as false when deploying via Cordova
    GAME_ID: '',
    TITLE: '',
    APP_URL: '', // leave blank, it will get set automatically
    HOST: '',
    PATH: '',
    VERSION: '#.#.#',
    ADSERVER_URL: '',
    CDN_ROOT: '',
    TGS: {
        ENABLED:	false
    },

    GoogleAnalytics: {
        QA_ID:     '',
        PROD_ID:   '',
        NATIVE_ID: '',
        LABEL: ''
    },

    Playnomics: {
        APP_ID: ''
    },

    Facebook: {
        APP_ID: '', // App ID from the App Dashboard
        NAMESPACE: '',
        CANVAS_URL: '',
        CAPTION: '',
        MESSAGE: '',
        APP_IMAGE: '',
        CHALLENGE_CAPTION: '',
        CHALLENGE_MESSAGE: '' // message can not exceed 60 characters
    },

    Twitter: {
        APP_KEY: '',
        ACCOUNT: '',
        SHARE_URL: '',
        SHARE_MESSAGE: '',
        FOLLOW_URL: '',
        CHALLENGE_MESSAGE: ''
    },

    // the social leaderboard also uses query string parameters to decide whether to load the leaderboard, and whether to include Facebook and/or Twitter
    // these query string parameters need to be reflected in the GameConfig.Leaderboard element
    Leaderboard: {
        ENABLED: false,
        Type: 'both', // none | twitter | facebook | both, defaults to both but can be overridden with the lb querystring parameter
        SocialNetwork: 'facebook', // defaults to facebook, but is reset to match the network used to authenticate the user
        SERVER_URL: 'http://prod.tresensa.com:8282',
        IMAGE_ROOT: 'images/lb-images/', // trailing slash '/' is required
        CONTAINER_DIV: 'social_leaderboard' // ID of the div used to position the leaderboard
    }
};


if (GameConfig.TGS.ENABLED)
{
    head.js("http://sdk.tresensa.com/tgs/tgs-min.js");
}

// Game Libraries and Main Code
if (GameConfig.PROD_ENV)
{
    head.js(
        "http://sdk.tresensa.com/lib/viewporter.js",
        "http://sdk.tresensa.com/lib/PxLoader.js",
        "http://sdk.tresensa.com/lib/PxLoaderImage.js",
        "http://sdk.tresensa.com/tge/tge-min.js",
        "http://sdk.tresensa.com/lib/playnomics.js",
        "http://sdk.tresensa.com/lib/facebook.js",
        "js/game/game-min-" + GameConfig.VERSION + ".js"
    );
}
else
{
    head.js(
        "http://sdk.tresensa.com/lib/viewporter.js",
        "http://sdk.tresensa.com/lib/PxLoader.js",
        "http://sdk.tresensa.com/lib/PxLoaderImage.js",
        "js/lib/tge-debug-0.3.4.js",
    //    "http://sdk.tresensa.com/tge/tge-min.js",
    //    "http://sdk.tresensa.com/lib/playnomics.js",
    //   "http://sdk.tresensa.com/lib/facebook.js",
        "js/game/main.js",
		"js/game/Spaceship.js",
        "js/game/ui/LoadingScreen.js",
        "js/game/ui/MainMenu.js",
        "js/game/ui/PauseScreen.js",
        "js/game/ui/GameOver.js"
    );
}

// Social Leaderboard dependencies
if (GameConfig.Leaderboard.ENABLED)
{
    // head.load("http://sdk.tresensa.com/tgs/slb-landscape-0.1.0.css");
    head.load("slb-landscape.css");
    head.js(
        "http://connect.facebook.net/en_US/all.js",
        "http://platform.twitter.com/anywhere.js?id=" + GameConfig.Twitter.APP_KEY + "&v=1",
        "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",
        "http://sdk.tresensa.com/lib/iscroll-lite.js",
        "js/slb/GameLeaderBoardConfig.js",
        (GameConfig.PROD_ENV ? "http://sdk.tresensa.com/tgs/slb-min.js" : "js/slb/slb-min.js")
    );
}

// Game Entry Point
head.ready( function()
    {
        GameConfig.APP_URL = GameConfig.HOST + GameConfig.PATH;

        // set image and audio assets to load from a CDN if in production, otherwise from the same directory that the game is hosted in
        //GameConfig.CDN_ROOT = (GameConfig.PROD_ENV ? GameConfig.CDN_ROOT + GameConfig.PATH + 'assets-' + GameConfig.VERSION : "");

        // initialize the game
        function initializeTGE() {

            // Google Analytics Tracking
            // Load the Google Analytics code in the global namespace
            // Refactor, this initialization of library needs to get moved into the TGE-SDK
            if(!TGE.BrowserDetect.usingPhoneGap)
            {
                //var _gaq = _gaq || [];
                if (GameConfig.PROD_ENV)
                {
                    _gaq.push(['_setAccount', GameConfig.GoogleAnalytics.PROD_ID]);
                }
                else
                {
                    _gaq.push(['_setAccount', GameConfig.GoogleAnalytics.QA_ID]);
                }

                (function() {
                    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
                })();
            }

            // Leaderboard disabled in iOS native build
            // GameConfig.Leaderboard.Type = getLeaderboardMode();

            // override game config settings using supplied query string parameters
            GameConfig.ADSERVER_URL += ';key=' + (TGE.BrowserDetect.usingPhoneGap ? 'A0001' : getDistributionPartner()); // append the distribution partner id, dst
            GameConfig.ADSERVER_URL += ';kvenv=' + encodeURIComponent(TGE.BrowserDetect.platform); // append the browser platform

            var _myGame = new MyGame();
            // the following assumes a landscape orientation game
            if(TGE.BrowserDetect.usingPhoneGap)
            {
                _myGame.Launch( {gameDiv:"game_canvas", orientation:"portrait"} );
            }
            else if(_myGame.IsPlatformAcceptable())
            {
                _myGame.Launch( {gameDiv:"game_canvas", orientation:"portrait", reorientDiv:"wrong_orientation"} );
            }
            else
            {
                // Handle rejected platform as desired...
            }
        }
        if(TGE.BrowserDetect.usingPhoneGap)
        {
            document.addEventListener('deviceready', initializeTGE, false);
        }
        else
        {
            window.addEventListener ? window.addEventListener("load",initializeTGE,false) : window.attachEvent && window.attachEvent("onload",initializeTGE);
        }
    }
);