
function addDropDownDate(elem) {
	var dateStamps = document.getElementById("dateStamps")
	var option = document.createElement("option")
	option.setAttribute("id", elem)
	option.appendChild(document.createTextNode(elem))
	dateStamps.appendChild(option)
}

function addDropDownTime(date, time) {
	var dateTime = document.getElementById("timeStamps")
	var option = document.createElement("option")
	option.setAttribute("value", time)
	option.appendChild(document.createTextNode(time))
	dateTime.appendChild(option)
}

function extractDate(map, value) {
	for( var prop in map ) {
        if( map.hasOwnProperty( prop ) ) {
	        if(map[prop].includes(value)) {
	        	return prop
	        }
        }
    }
}

function loadNewLayer (cov, map, timeValue) {  

	var paramKey = cov.parameters.keys().next().value
	var fullDate = extractDate(map,timeValue) + "T" + timeValue
	console.log(fullDate)
	var wwd = getWWD()

	wwd.removeLayer(layer)

	var newLayer = CovJSONLayer(cov, {
	    paramKey: paramKey,
	    onload: onLayerLoad,
	    time: fullDate
	  })

	// console.log(newLayer)

	wwd.addLayer(newLayer)
	wwd.redraw()
}

function loadTimeBasedValues(cov, map, layer) {

	var timeStamps = document.getElementById("timeStamps") 
	var dateStamps = document.getElementById("dateStamps")

	// console.log(map[timeStamps.options[timeStamps.selectedIndex].value])

	// loadNewLayer(cov, map, timeStamps.options[timeStamps.selectedIndex].value)

	timeStamps.addEventListener("change", function() {

		console.log(this.value)

		loadNewLayer(cov, map, this.value)

	})
}

function addTimeOnClick(cov, map) {
	var dateArr = document.getElementById("dateStamps")
	var timeStamps = document.getElementById("timeStamps") 

	timeStamps.options.length = 0

	var addTime = function(val) {
		
		var values = map[val]

		for(var i = 0; i < values.length; i++) {

			var option = document.createElement("option")
			option.text = values[i]
			timeStamps.add(option)	
		}
	}

	addTime(dateStamps.options[dateStamps.selectedIndex].value)

	dateArr.addEventListener("change" , function() {
		
		timeStamps.options.length = 0

		addTime(this.value)

    })
}


function addDropDown(cov, layer) {

	// var dateStamps = document.getElementById("dateStamps")
	// var emptyOption = document.createElement("option")
	// dateStamps.add(emptyOption)

	var dateToTimesMap = {}
	
	cov.loadDomain().then(function(dom) {

		var values = dom.axes.get("t").values
	

		for(var i = 0; i < values.length; i++){
			var time = ""
			var date = values[i]
			if(date.includes("T")) {
				var endIndex = values[i].indexOf("T")
			    date = values[i].substr(0,endIndex)
			    time = values[i].substr(endIndex+1)

			    addDropDownTime(date, time)
			}
			if(date in dateToTimesMap) {
				dateToTimesMap[date].push(time)
			} else {
				dateToTimesMap[date] = [time]
			}
			var dateTag = document.getElementById(date)

			if(!dateTag) {
				addDropDownDate(date)
			} 
		}
		// console.log(dateToTimesMap)

		dateStamps.options.length = Object.keys(dateToTimesMap).length
		addTimeOnClick(cov, dateToTimesMap)
		console.log("here")
		// loadNewLayer(cov, dateToTimesMap, timeStamps.options[timeStamps.selectedIndex].value)
		loadTimeBasedValues(cov, dateToTimesMap, layer)
	})	
}
