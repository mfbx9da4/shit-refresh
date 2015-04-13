chrome.browserAction.onClicked.addListener(function(tab) {
	var action_url = "javascript:localStorage.clear();location.reload();";
	chrome.tabs.update(tab.id, {
		url: action_url
	});
});

var clearCookies = function () {
	chrome.tabs.query({
		currentWindow: true,
		active: true
	}, function(tabs) {
		chrome.webNavigation.getAllFrames({
			tabId: tabs[0].id
		}, function(details) {

			// Get unique list of URLs
			var urls = details.reduce(function(urls, frame) {
				if (urls.indexOf(frame.url) === -1)
					urls.push(frame.url);
				return urls;
			}, []);


			// Get all cookies
			var index = 0;
			var cookies = [];
			urls.forEach(function(url) {
				// Log cookies
				chrome.cookies.getAll({
					url: url
				}, function(cookies) {
					for (var i = 0; i < cookies.length; i++) {
						var cookie = cookies[i];
						console.log(cookie.domain, cookie.name);
						chrome.cookies.remove({
							url: url,
							name: cookie.name
						});
					}
				});

			});
		});
	});
}


chrome.commands.onCommand.addListener(function(command) {
	console.log(command);

	var tab = {}

	chrome.tabs.getCurrent(function(currentTab) {
		tab = currentTab;
	});

	var clearLocalStorage = function () {
		var action_url = "javascript:localStorage.clear()";
		chrome.tabs.update(tab.id, {
			url: action_url
		});
	}

	if (command === 'local-storage') {
		clearLocalStorage();
	} else if (command === 'cookies') {
		clearCookies();
	} else if (command === 'local-storage-and-cookies') {
		clearCookies();
		clearLocalStorage();
	}

	var action_url = "javascript:location.reload();";
	chrome.tabs.update(tab.id, {
		url: action_url
	});
});