var isAndroid = (Ti.Platform.osname === 'android');

exports.createNavigationWindow = function(baseWindow) {

	var me;
	var windows = [];

	if (isAndroid) {
		me = baseWindow;
		windows.push(baseWindow);
	} else {
		var me = Ti.UI.createWindow({
			backgroundColor : 'black'
		});
		me.orientationModes = [Ti.UI.PORTRAIT];
		me.nav = Ti.UI.iPhone.createNavigationGroup({
			window : baseWindow
		});
		me.add(me.nav);
		me.addEventListener('focus', function(e) {
			baseWindow.fireEvent('focus', e);
		});
		me.addEventListener('blur', function(e) {
			baseWindow.fireEvent('blur', e);
		});
		windows.push(baseWindow);
	};

	me.closeTopWindow = function() {
		if (windows.length <= 1) {
			return;
		}
		var lastWindow = windows[windows.length - 1];
		if (isAndroid) {
			lastWindow.close();
		} else {
			me.nav.close(lastWindow);
		}
	};

	me.openNextWindow = function(/*Ti.UI.Window*/windowToOpen) {
		windowToOpen.nav = me;
		if (isAndroid) {
			windowToOpen.open({
				animated : true
			});
		} else {
			me.nav.open(windowToOpen);
		}
		windows.push(windowToOpen);
		windowToOpen.addEventListener('close', function(e) {
			windows.pop();
			windowToOpen.nav = null;
			windowToOpen = null;
		});
		Ti.API.debug('total windows=' + windows.length);
	};

	me.windowCount = function() {
		return windows.length;
	};

	return me;
};
