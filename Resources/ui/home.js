var isAndroid = Ti.Platform.osname == 'android';

exports.createHomeWindow = function() {

	var win = Ti.UI.createWindow({
		title : 'parmaVision',
		fullScreen : false
	});
	win.orientationModes = [Ti.UI.PORTRAIT];

	if (isAndroid) {
		var titleBar = Ti.UI.createView({
			top : 0,
			height : '44dp',
			backgroundColor : 'black',
			width : Ti.UI.FILL
		});

		var titleText = Ti.UI.createLabel({
			color : 'white',
			text : win.title,
			textAlign : 'center',
			font : {
				fontWeight : 'bold',
				fontSize : '18dp'
			}
		});
		titleBar.add(titleText);
		win.add(titleBar);
		win.topStart = titleBar.height;
	} else {
		win.topStart = 0;
	}

	var arWin = null;
	var arWindowOpen = false;

	var parmas = require('/data/pois').parmas;
	var annotations = [];

	for (var i = 0; i < parmas.length; i++) {
		var annotation = Ti.Map.createAnnotation({
			latitude : parmas[i].latitude,
			longitude : parmas[i].longitude,
			pincolor : Ti.Map.ANNOTATION_RED,
			title : parmas[i].title,
			subtitle : parmas[i].address
		});
		annotations.push(annotation);
		// add the view to the parma
		var view = Ti.UI.createView({
			height : '150dp',
			width : '150dp',
			backgroundColor : 'black',
			opacity : 0.6,
			borderRadius : 5
		});
		var label = Ti.UI.createLabel({
			textAlign : 'center',
			text : parmas[i].title,
			color : 'white',
			font : {
				fontSize : '18dp',
				fontWeight : 'bold'
			},
			height : '42dp',
			top : '5dp'
		});
		view.add(label);
		if (parmas[i].image) {
			var image = Ti.UI.createImageView({
				width : '130dp',
				height : '65dp',
				top : '57dp',
				image : parmas[i].image
			});
			view.add(image);
		}
		var rating = Ti.UI.createLabel({
			textAlign : 'center',
			text : "rating: " + parmas[i].rating,
			color : 'white',
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			},
			height : '20dp',
			bottom : '5dp'
		});
		view.add(rating);
		view.addEventListener('click', function(e) {
			// Need to do this for Android for the moment
			// because the click will fire this without a poi
			if( ! e.poi ){
				return;
			}
			alert(e.poi.title + ' got a click!');
		});
		parmas[i].view = view;

	}

	var map = Ti.Map.createView({
		top : win.topStart,
		mapType : Titanium.Map.STANDARD_TYPE,
		region : {
			latitude : -37.814056,
			longitude : 144.963441,
			latitudeDelta : 0.05,
			longitudeDelta : 0.05
		},
		animate : true,
		regionFit : true,
		userLocation : true,
		annotations : annotations
	});

	win.add(map);

	var overlay = Ti.UI.createLabel({
		top : 0,
		height : '44dp',
		backgroundColor : 'black',
		color : 'white',
		width : Ti.UI.FILL,
		text : "parmaVision",
		opacity : 0.3,
		textAlign : 'center',
		font : {
			fontWeight : 'bold',
			fontSize : '18dp'
		}
	});

	var button = Ti.UI.createButton({
		title : 'AR',
		width : '60dp',
		height : '40dp',
		right : '5dp',
		top : '2dp'
	});

	button.addEventListener('click', function() {
		arWin = require('/ui/ar').createARWindow({
			pois : parmas,
			overlay : overlay,
			maxDistance : 10000 //in m
		});
		arWin.addEventListener('close', function() {
			arWindowOpen = false;
			arWin = null;
		});
		arWin.open();
	});

	if (isAndroid) {
		titleBar.add(button);
	} else {
		win.rightNavButton = button;
	}

	return win;

}
