exports.createHomeWindow = function() {

	var colors = ['red', 'yellow', 'pink', 'green', 'purple', 'orange', 'blue'];

	var lastColor = Ti.App.Properties.getInt('color', 0);
	lastColor++;
	if (lastColor >= colors.length) {
		lastColor = 0;
	}
	Ti.App.Properties.setInt('color', lastColor);

	var win = Ti.UI.createWindow({
		title : 'parmaVision',
		backgroundColor : colors[lastColor],
	});

	if (Ti.Platform.osname == 'android ') {
		orientationModes = [Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_RIGHT];
	} else {
		orientationModes = [Ti.UI.PORTRAIT];
	}

	var arWin = null;
	var arWindowOpen = false;

	win.addEventListener('click', function() {
		arWin = require('/ui/ar').createARWindow();
		arWin.addEventListener('close', function() {
			arWindowOpen = false;
			arWin = null;
		});
		arWin.open();
	});

	/*
	 Ti.Gesture.addEventListener('orientationchange', function(e) {
	 if( arWindowOpen ){
	 Ti.API.debug( "arWindow is open");
	 } else {
	 Ti.API.debug( "arWindow is closed");
	 }
	 if (e.source.isLandscape()) {
	 if (!arWindowOpen) {
	 arWindowOpen = true;
	 arWin = require('/ui/ar').createARWindow();
	 arWin.addEventListener('close', function() {
	 arWindowOpen = false;
	 arWin = null;
	 });
	 arWin.open();
	 }
	 } else if (e.source.isPortrait()) {
	 Ti.API.debug( 'turning back....');
	 if (arWindowOpen) {
	 arWin.doClose();
	 }
	 }
	 });

	 */

	return win;

}
