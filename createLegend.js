
function createRGBString (colourValues) {
	return "rgb(" + colourValues[0] + "," + colourValues[1] + "," + colourValues[2] + ")"
}

function changeLegendTitle (cov, paramKey) {

	var param = cov.parameters.get(paramKey)
	var title = param.observedProperty.label.en
	var units = param.unit.en

	var span = document.getElementById("legend-title");
	var	txt = document.createTextNode(title + "(" + units + ")");
	span.innerText = txt.textContent;

}

function createContinousLegend (cov, layer) {

	var paramKey = cov.parameters.keys().next().value
	var palette = layer.palette
	var legend = document.getElementById("my-legend")

	changeLegendTitle(cov,paramKey)
	legend.display = "inline"

	var legendBar = document.getElementById("legend-bar")

	var colourString = ""

	for (var i = 0; i < palette.length; i++) {
		if (i !== palette.length - 1) {
			colourString += createRGBString(palette[i]) + ","
		} else {
			colourString += createRGBString(palette[i])
		}
	}

	legendBar.style.background = "linear-gradient(to right," + colourString + ")"

}





