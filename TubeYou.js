cfg.Light, cfg.MUI;
/*
 * This example lists and plays YouTube videos with
 * optional full screen mode. The videos are taken
 * from the DroidScript YouTube channel.
*/

//Initialise variables.
var isFullscreen = false

var videoIds = [
    "zZTs3bYRyzs", "AK31U2f1nl0",
    "cKzK4oqiDd8", "ZlojAcd9lGc" ]

var videoTitles = [ "Part 1", "Part 2", "Part 3", "Part 4" ]

function ReadData()
{
	r = app.ReadFile( "data.txt" );
	s = r.split("\n");
	t = s.length;
	c = 0;
	for(d=0;d<t;d++){
		u = s[d].split("/")[3].split("?")[0];
		videoIds[d] = u;
		videoTitles[d] = "Part " + (c+1);
		c++
		//alert("Id: "+u+", url: " + s);
	}
	
}


//Called when application is started.
function OnStart()
{
	ReadData()
	app.SetOrientation( "Portrait" )

	lay = app.CreateLayout( "Linear", "FillXY" )
	lay.SetChildMargins( 0.02, 0.02, 0.02, 0.02 )
//	lay.SetBackColor( "#333333" )

	web = app.AddWebView( lay, 1, 0.4, "UseBrowser" )
	web.SetOnProgress( web_OnProgress )
	web.SetOnConsole( web_OnConsole )
	web.SetOnError( web_OnError )
	web.SetBackColor( "#ffffff" )

	web2 = app.AddWebView( lay, 1, 0.2, "UseBrowser" )
	//web2.SetOnProgress( web2_OnProgress )
	//web2.SetOnConsole( web2_OnConsole )
	//web2.SetOnError( web2_OnError )
	web2.SetBackColor( "#00000000" )
	
	
	
//	"https://i.ytimg.com/vi/-lzETxn1kug/maxresdefault.jpg?v=619e4d16";
/*	title = app.AddText( lay, "Master Playlist", 1, -1, "Bold" )
	title.SetTextColor( "#FFFFFF" )
	title.SetTextSize( 22, "sp" )
	title.SetEllipsize( "End" )
*/
	list = app.AddList( lay, videoTitles, 1, -1, "Bold" )
	list.SetHiTextColor1( "#FF0000" )
	list.SetOnTouch( list_OnTouch )
	list.SelectItemByIndex( 0 )
	list.SetEnabled( false )

	//Add layout to app.
	app.AddLayout( lay )

	//rel = If the parameter's value is set to 0, then the player does not show related videos.
	web.LoadUrl( "https://www.youtube.com/embed/" + videoIds[0] + "?&rel=0"  )
}

function list_OnTouch( title, body, icon, index )
{
/*

border-radius: 10px 10px 10px 10px;
*/
    list.SelectItemByIndex( index )
   web2.LoadHtml( "<h3>"+title+"<img height='64' style='-webkit-border-radius: 10px 10px 10px 10px; border-radius: 10px 10px 10px 10px;float:left;clear:right;' hspace='4' src='https://i.ytimg.com/vi/" + videoIds[index] + "/maxresdefault.jpg' /></h3>");
    //We can change the index of the video played by entering the YouTube player api on the page.
    //https://developers.google.com/youtube/iframe_api_reference
    //alert(videoIds[index]);
    web.Execute( "document.querySelector('#movie_player').loadVideoById('" + videoIds[index] + "')" )
    setTimeout(()=>{web.Execute( "document.body.outerHTML;", yt );}, 4500)
    /*setTimeout(()=>{web.Execute("document.getElementsByClassName(\"ytp-time-duration\").outerHTML;\", (results)=>{alert(results);})}", 4000);*/
}

function yt(results)
{
	app.WriteFile( "yt.html", results );
	app.SetClipboardText( results )
}

function web_OnProgress( progress )
{
    //We cannot run our code until the page is fully loaded.
    //Wait until it is fully loaded.
    if( progress !== 100 ) return

    //Detect full screen click. In this way,
    //we can turn the screen sideways and enlarge it.
    var inject = 'document.querySelector("button.ytp-fullscreen-button.ytp-button").addEventListener("click", () => alert("fullscreen"))'
    web.Execute( inject )

    list.SetEnabled( true )
    web.Show()
    web.SetInject(  '<script src="ds:/Sys/app.js"></script><script>app.WriteFile( "res.html", document.body.outerHTML );</script>')
}

//We printed a message when the button was clicked to understand that the screen went into full screen mode.
//By detecting this, we can learn whether the button has been clicked or not.
function web_OnConsole( msg )
{
    if( msg === "fullscreen" ) goFullscreen()
}

function goFullscreen()
{
    isFullscreen = !isFullscreen

    app.SetOrientation( isFullscreen ? "Landscape" : "Portrait" )
    app.SetScreenMode( isFullscreen ? "Game" : "Normal" )
}

// If the screen is turned sideways,
//make the video full screen and hide the list.
function OnConfig()
{
    if( app.IsPortrait() ) web.SetSize( 1, 0.4 )
    else web.SetSize( 1, 1 )
}

function web_OnError( message, code )
{
	if( code === -2 )
	{
		app.Quit( "No network connection!" )
  }
}