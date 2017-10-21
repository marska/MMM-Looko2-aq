# MMM-Looko2-aq

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Display the air quality index from looko2 sensor.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: "MMM-Looko2-aq",
			position: "top_right",
			header: "Air Quality Index",
			config: {
                deviceId: "", // from http://looko2.com/heatmap.php
                locationName: "Street, City",    
				showIndex: true,
                showDetails: true,
                lang: "en" // pl
			}
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `deviceId`       | *Required* The device id for that you you want to show the air quality. Select device on [looko2.com](http://looko2.com/heatmap.php) heatmap and get it from search param.
| `locationName`   | *Optional* Show location label.
| `showIndex`      | *Optional* Toggle index printing.
| `showDetails`    | *Optional* Toggle PM10, PM2.5, PM1 values printing.
| `showDetails`    | *Optional* Change the language. Default en.