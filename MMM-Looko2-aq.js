/* global Module */

/* Magic Mirror
 * Module: MMM-Looko2-aq
 *
 * By Mariusz Skarupiński (https://github.com/marska)
 * MIT Licensed.
 */

Module.register("MMM-Looko2-aq", {
	defaults: {
		lang: "",
		showIndex: true,
		showWeather: true,
		showProvider: true,
		showDetails: true,
		updateInterval: 60000,
		retryDelay: 5000
	},

	requiresVersion: "2.1.0",

	start: function() {
		var self = this;
		var dataRequest = null;

		this.loaded = false;

		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	getData: function() {
		var self = this;

		var urlApi = "http://api.looko2.com/?method=GetLOOKO&id="+this.config.deviceId+'&token=1508579768';

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else {
					self.updateDom(self.config.animationSpeed);

					Log.error(self.name, "Could not load data. Status code: "+ this.status);
				}

				self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
			}
		};

		dataRequest.send();
	},

	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		nextLoad = nextLoad;

		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	html: {
		icon: '<i class="fa fa-leaf {0}"></i>',
		quality: '<div class="bright">{0} {1}{2}</div>',
		city: '<div class="xsmall">{0}</div>',
		details: '<div class="xsmall">PM<sub>10</sub> <b>{0}</b> PM<sub>2.5</sub> <b>{1}</b> PM<sub>1</sub> <b>{2}</b></div>',
		service: '<div class="xsmall">via looko2.com</div>',
		weather: '<div><i class="fa fa-tint"></i> <a class="bright">{0}%</a> <i class="fa fa-thermometer-three-quarters"></i> <a class="bright">{1}&deg;</a></div>',
		warning: '<div class="xsmall MMM-Looko2-aq-warning"><i class="fas fa-exclamation-triangle"></i> Last update: {0} {1}.</div>',
	},

	getDom: function() {
		var self = this;

		var wrapper = document.createElement("div");

		if (this.dataRequest) {

			var updateDelayInMinutes = (new Date().getTime()/1000 - this.dataRequest.Epoch)/60;

			if(updateDelayInMinutes > 59){
				var wrapperWarning = document.createElement("div");

				wrapperWarning.innerHTML = this.html.warning.format(this.dataRequest.EpochHumanDate, this.dataRequest.EpochHumanTime);;
				wrapper.appendChild(wrapperWarning);
			}

			var wrapperQuality = document.createElement("div");

			var icon = null;
			if(this.dataRequest.IJP <= 2){
				icon = this.html.icon.format("MMM-Looko2-aq-status-good")
			}else if(this.dataRequest.IJP <= 5){
				icon = this.html.icon.format("MMM-Looko2-aq-status-moderate")
			}else if(this.dataRequest.IJP > 5){
				icon = this.html.icon.format("MMM-Looko2-aq-status-poor")
			}

			wrapperQuality.innerHTML =
				this.html.quality.format(
					icon,
					this.dataRequest.impact,
					(this.config.showIndex?" ("+this.dataRequest.IJP+")":""));
	
			wrapper.appendChild(wrapperQuality);

			if(this.config.showDetails){
				var wrapperDetails = document.createElement("div");
				wrapperDetails.innerHTML = this.html.details.format(this.dataRequest.PM10,this.dataRequest.PM25,this.dataRequest.PM1);
				
				wrapper.appendChild(wrapperDetails);
			}

			if(this.config.showWeather){
				var wrapperWeather = document.createElement("div");
				wrapperWeather.innerHTML += this.html.weather.format(this.dataRequest.Humidity, this.dataRequest.Temperature);
			
				wrapper.appendChild(wrapperWeather);
			}
	
			if(this.config.locationName){
				var wrapperLocation = document.createElement("div");

				wrapperLocation.innerHTML = this.html.city.format(this.config.locationName);

				wrapper.appendChild(wrapperLocation);

			}
	
			if(this.config.showProvider){
				var wrapperProvider = document.createElement("div");

				wrapperProvider.innerHTML = this.html.service;

				wrapper.appendChild(wrapperProvider);
			}
		}
		
		return wrapper;
	},

	getScripts: function() {
		return [
			"String.format.js"
		];
	},

	getStyles: function () {
		return [
			"MMM-Looko2-aq.css",
		];
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		this.dataRequest.impact = (this.config.lang === "pl" ? data.IJPString : data.IJPStringEN);

		if (this.loaded === false) { 
			self.updateDom(self.config.animationSpeed); 
		}

		this.loaded = true;
	},
});