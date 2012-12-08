var isAndroid = Ti.Platform.osname == 'android';

if (isAndroid) {
	// Landscape Mode
	var screenWidth = Ti.Platform.displayCaps.platformHeight;
	var screenHeight = Ti.Platform.displayCaps.platformWidth;
} else {
	var screenWidth = Ti.Platform.displayCaps.platformWidth;
	var screenHeight = Ti.Platform.displayCaps.platformHeight;
}

// Setup the location  properties for callbacks
Ti.Geolocation.headingFilter = 1;
Ti.Geolocation.showCalibration = false;

if (isAndroid) {
	Ti.Geolocation.Android.accuracy = Ti.Geolocation.ACCURACY_HIGH;
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
} else {
	Ti.Geolocation.distanceFilter = 10;
	Ti.Geolocation.preferredProvider = "gps";
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
	Ti.Geolocation.purpose = "Augmented Reality";
}

// function to create the window
exports.createARWindow = function(params) {

	function showAR() {
		Ti.Geolocation.addEventListener('heading', headingCallback);
		Ti.Media.showCamera({
			success : function(event) {
			},
			cancel : function() {
				// only gets called if Android
				closeAR();
			},
			error : function(error) {
				alert('unable to open AR Window');
				closeAR();
			},
			mediaTypes : [Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO],
			showControls : false,
			autohide : false,
			autofocus : "off",
			animated : false,
			overlay : overlay
		});
	}

	function closeAR() {
		Ti.Geolocation.removeEventListener('heading', headingCallback);
		if (!isAndroid) {
			Ti.Media.hideCamera();
		}
		setTimeout(function() {
			win.close();
		}, 500);
	}

	var views = [];
	var colors = ['red', 'yellow', 'pink', 'green', 'purple', 'orange', 'blue', 'white', 'silver'];

	var overlay = Ti.UI.createView({
		top : 0,
		height : screenHeight,
		left : 0 - (screenWidth / 2),
		width : screenWidth * 2 / 3,
		backgroundColor : 'transparent'
	});

	for (var i = 0; i < colors.length; i++) {
		views[i] = Ti.UI.createView({
			top : 0,
			height : screenHeight,
			right : 0,
			width : screenWidth,
			backgroundColor : colors[i],
			opacity : 0.5
		});
		overlay.add(views[i]);
	};

	var label = Ti.UI.createLabel({
		bottom : '20dp',
		height : '20dp',
		text : "test",
		textAlign : 'center',
		color : 'white',
	});

	overlay.add(label);

	if (!isAndroid) {
		overlay.addEventListener('click', closeAR);
	}

	var lastActiveView = -1;
	var viewChange = false;

	function headingCallback(e) {
		var currBearing = e.heading.trueHeading;
		var internalBearing = currBearing / (360 / views.length);
		var activeView = Math.floor(internalBearing);
		var pixelOffset = Math.floor((internalBearing % 1) * screenWidth);

		if (activeView != lastActiveView) {
			viewChange = true;
			lastActiveView = activeView;
		} else {
			viewChange = true;
		}

		for (var i = 0; i < views.length; i++) {
			var diff = activeView - i;
			if (diff >= -1 && diff <= 1) {
				if (viewChange) {
					views[i].visible = true;
				}
				views[i].right = pixelOffset + (diff * screenWidth);
			} else {
				if (viewChange) {
					views[i].visible = false;
				}
			}
		}

		if (activeView == 0) {
			if (viewChange) {
				views[views.length - 1].visible = true;
			}
			views[views.length - 1].right = views[0].right + screenWidth;
		} else if (activeView == (views.length - 1 )) {
			if (viewChange) {
				views[0].visible = true;
			}
			views[0].right = views[views.length - 1].right - screenWidth;
		}

		label.text = JSON.stringify(Math.floor(currBearing) + ":" + (Math.round(internalBearing * 100 ) / 100) + ":" + pixelOffset);

	}

	var win = Ti.UI.createWindow({
		modal : true,
		navBarHidden : true,
		fullscreen : true,
		orientationModes : [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
	});

	win.doClose = function() {
		closeAR();
	};

	win.addEventListener('open', function() {
		Ti.API.debug('AR Window Open...');
		setTimeout(showAR, 500);
	});

	return win;

};
