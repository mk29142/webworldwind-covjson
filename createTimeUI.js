
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
	option.setAttribute("value", date)
	option.appendChild(document.createTextNode(time))
	dateTime.appendChild(option)
}

function addTimeOnClick(map) {
	var dateArr = document.getElementById("dateStamps")
	var timeStamps = document.getElementById("timeStamps")

	timeStamps.options.length = 0; 

	dateArr.addEventListener("change" , function() {

		timeStamps.options.length = 0;

		var values = map[this.value]

		for(var i = 0; i < values.length; i++) {

			var option = document.createElement("option");
			option.text = values[i];
			timeStamps.add(option);	
		}
    })
}

function addDropDown(cov) {

	cov.loadDomain().then(function(dom) {

		var values = dom.axes.get("t").values
	
		var dateToTimesMap = {}


		for(var i = 0; i < values.length; i++){
			var time = " "
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
		addTimeOnClick(dateToTimesMap)
	})	
}