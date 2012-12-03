var isAndroid = Ti.Platform.osname == 'android';

Ti.Geolocation.headingFilter = 1;
Ti.Geolocation.showCalibration = false;

if (isAndroid) {
	Ti.Geolocation.Android.accuracy = Ti.Geolocation.ACCURACY_HIGH;
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
} else {
	Ti.Geolocation.distanceFilter = 10;
	Ti.Geolocation.preferredProvider = "gps";
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
	Ti.Geolocation.purpose = Ti.Locale.getString('gps_purpose');
}

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

	var overlay = Ti.UI.createView({
		top : 0,
		bottom : 0,
		left : 0,
		right : 0,
		backgroundColor : 'transparent'
	});

	var label = Ti.UI.createLabel({
		bottom : 10,
		height : 20,
		right : 10,
		text : "test",
		textAlign : 'right',
		color : 'white',
	});

	overlay.add(label);

	if (!isAndroid) {
		overlay.addEventListener('click', closeAR);
	}

	function headingCallback(e) {
		label.text = JSON.stringify(e.heading.magneticHeading);
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
