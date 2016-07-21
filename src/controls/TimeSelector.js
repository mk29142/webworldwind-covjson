
function TimeSelector(values, options) {
	this._dateId = options.dateId
	this._timeId = options.timeId
	this._dateToTimeMap = {}
	var self = this

 	var dateStamps = document.getElementById(this._dateId)
 	var timeStamps = document.getElementById(this._timeId)

	//Initialises the date drop down UI
	// create date-> time map
	for(var i = 0; i < values.length; i++){
		var time = undefined
		var date = values[i]
		if(date.includes("T")) {
			var endIndex = values[i].indexOf("T")
		    date = values[i].substr(0,endIndex)
		    time = values[i].substr(endIndex+1)
		}
		// console.log(this._dateToTimeMap)
		if(date in this._dateToTimeMap) {
			this._dateToTimeMap[date].push(time)
		} else {
			this._dateToTimeMap[date] = [time]
		}
	}

	// construct date and time select elements
	//...
	this._fillDateOptions(Object.keys(this._dateToTimeMap))
	this._fillTimeOptions(this._dateToTimeMap)

	var date //= dateStamps.options[dateStamps.selectedIndex].value

	var time //= timeStamps.options[timeStamps.selectedIndex].value


	// this.fire("change", {value: date + "T" + time})

	dateStamps.addEventListener("change" , function() {

		self._fillTimeOptions(self._dateToTimeMap)

	  date = this.value
	  time = timeStamps.options[timeStamps.selectedIndex].value

		self.fire("change", {value: date + "T" + time})

		timeStamps.addEventListener("change", function() {
			self.fire("change", {value: date + "T" + time})
		})

		// attach change listeners to select elements
		// ...
		// this.fire('change', {value: value})

    })
}

TimeSelector.prototype._fillDateOptions = function(dateArr) {

	var dateStamps = document.getElementById(this._dateId)

	for(var i = 0; i < dateArr.length; i++) {
		var option = document.createElement("option")
		option.setAttribute("id", dateArr[i])
		option.appendChild(document.createTextNode(dateArr[i]))
		dateStamps.appendChild(option)
	}
}
TimeSelector.prototype._fillTimeOptions = function (map) {

	var dateStamps = document.getElementById(this._dateId)
	var currDateVal = dateStamps.options[dateStamps.selectedIndex].value
	var timeStamps = document.getElementById(this._timeId)

	timeStamps.options.length = 0

	var times = map[currDateVal]

	for(var i = 0; i < times.length; i++) {
		var option = document.createElement("option")
		option.setAttribute("value", times[i])
		option.appendChild(document.createTextNode(times[i]))
		timeStamps.appendChild(option)
	}
}

mixin(EventMixin, TimeSelector)
