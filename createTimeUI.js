
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

function getKey(map, value) {

	for( var prop in map ) {
		console.log(prop)
        if( map.hasOwnProperty( prop ) ) {
        	console.log(map[prop])
        }
        // 	if( map[prop] === value ){
        // // 		console.log(prop)
        		console.log(map[prop].includes(value))
        // 	}
       	// }
    }
}

function loadTimeBasedValues(cov, map) {

	var timeStamps = document.getElementById("timeStamps") 
	var dateStamps = document.getElementById("dateStamps")
	var paramKey = cov.parameters.keys().next().value

	// var date = function(map,value) {
	// 	for( var prop in map ) {
	//         if( map.hasOwnProperty( prop ) ) {
	// 	        if(map[prop].includes(value)) {
	// 	        	return prop
	// 	        }
	//         }
	//     }
	// }

	timeStamps.addEventListener("change", function() {

		var value = this.value
		console.log(date(map,value))
		cov.subsetByValue({t: date(map,value) + "T" + value }).then(function(subsetCov) {
			subsetCov.loadRange(paramKey).then(function(range) {

				cov.loadDomain().then(function(domain) {
					var xaxis = domain.axes.get("x").values
					var yaxis = domain.axes.get("y").values
				
					var values = []

					for(var xs in xaxis) {
						for (var ys in yaxis) {
							
							values.push(range.get({x: xs, y: ys}))
						}
					}
				})
			})
		})
	})
}

function addTimeOnClick(cov, map) {
	var dateArr = document.getElementById("dateStamps")
	var timeStamps = document.getElementById("timeStamps") 

	timeStamps.options.length = 0;

	dateArr.addEventListener("change" , function() {
		
		timeStamps.options.length = 0;

		var emptyOption = document.createElement("option")
		timeStamps.add(emptyOption)

		var values = map[this.value]

		for(var i = 0; i < values.length; i++) {

			var option = document.createElement("option");
			option.text = values[i];
			timeStamps.add(option);	
		}
    })
}


function addDropDown(cov) {


	var dateStamps = document.getElementById("dateStamps")
	var emptyOption = document.createElement("option")
	dateStamps.add(emptyOption)

	cov.loadDomain().then(function(dom) {

		var values = dom.axes.get("t").values
	
		var dateToTimesMap = {}

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
		addTimeOnClick(cov, dateToTimesMap)
		loadTimeBasedValues(cov, dateToTimesMap)
	})	
}
