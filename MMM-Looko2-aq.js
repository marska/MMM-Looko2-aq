/* Magic Mirror
 * Module: MMM-Looko2-aq
 *
 * By Mariusz Skarupiński https://github.com/marska
 * Base on MMM-AirQuality module https://github.com/CFenner/MMM-AirQuality
 * 
 * MIT Licensed.
 */
Module.register("MMM-Looko2-aq", {

	defaults: {
		lang: "",
		showIndex: true,
		showWeather: true,
		updateInterval: 15,
		animationSpeed: 1000
	},
	start: function(){
		Log.info("Starting module: " + this.name);

		this.load();

		setInterval(
			this.load.bind(this),
			this.config.updateInterval * 60 * 1000);
	},
	load: function(){
		$.getJSON(
			'http://api.looko2.com/?method=GetLOOKO&id='+this.config.deviceId+'&token=1508579768',
			this.render.bind(this));
	},
	render: function(data){
		this.data.impact = (this.config.lang === "pl" ? data.IJPString : data.IJPStringEN);
		this.data.PM1 = data.PM1;
		this.data.PM25 = data.PM25;
		this.data.PM10 = data.PM10;
		this.data.IJP = data.IJP;
		this.data.Temperature = data.Temperature;
		this.Humidity = data.Humidity;

		this.loaded = true;
		this.updateDom(this.animationSpeed);
	},
	html: {
		icon: '<i class="fa fa-leaf {0}"></i>',
		quality: '<div class="bright">{0} {1}{2}</div>',
		city: '<div class="xsmall">{0}</div>',
		details: '<div class="xsmall">PM<sub>10</sub> <b>{0}</b> PM<sub>2.5</sub> <b>{1}</b> PM<sub>1</sub> <b>{2}</b></div>',
		service: '<div class="xsmall">via looko2.com</div>',
		weather: '<div class="bright">{0}% {1}&deg;</div>'
	},
	getScripts: function() {
		return [
			'//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.js',
			'String.format.js'
		];
	},
	getStyles: function() {
		return ["MMM-Looko2-aq.css", "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"];
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		if (this.config.deviceId === "") {
			wrapper.innerHTML = "Please set the <i>deviceId</i> in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.loaded) {
			wrapper.innerHTML = "Loading air quality index ...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		// set icon color
		if(this.data.IJP <= 2){
			this.html.icon = this.html.icon.format("MMM-Looko2-aq-status-good")
		}else if(this.data.IJP <= 5){
			this.html.icon = this.html.icon.format("MMM-Looko2-aq-status-moderate")
		}else if(this.data.IJP > 5){
			this.html.icon = this.html.icon.format("MMM-Looko2-aq-status-poor")
		}

		wrapper.innerHTML =
			this.html.quality.format(
				this.html.icon,
				this.data.impact,
				(this.config.showIndex?" ("+this.data.IJP+")":""));

		if(this.config.showDetails){
			wrapper.innerHTML += this.html.details.format(this.data.PM10,this.data.PM25,this.data.PM1);
		}

		if(this.config.showWeather){
			wrapper.innerHTML += this.html.weather.format(this.data.Humidity, this.Temperature);
		}

		if(this.config.locationName){
			wrapper.innerHTML += this.html.city.format(this.config.locationName);
		}

		if(this.config.showProvider){
			wrapper.innerHTML += this.html.service;
		}

		return wrapper;
	}
});
