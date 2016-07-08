
function createRGBString (colourValues) {
	return "rgb(" + colourValues[0] + "," + colourValues[1] + "," + colourValues[2] + ")"
}

function changeHTMLText (id, text) {

	var span = document.getElementById(id);
	var	txt = document.createTextNode(text);
	span.innerText = txt.textContent;	
}

function changeLegendTitle (cov, paramKey) {

	var param = cov.parameters.get(paramKey)
	var title = param.observedProperty.label.en
	var units = param.unit.label.en

	changeHTMLText("legend-title", title)
	changeHTMLText("legend-units", units)

}

function changeLegendScale(cov, minMax) {

	changeHTMLText("start", minMax[0])
	changeHTMLText("finish", minMax[1])
	
}

function createContinousLegend (cov, layer) {

	var paramKey = cov.parameters.keys().next().value
	var palette = layer.palette
	var legend = document.getElementById("my-legend")
	var minMax = CovUtils.minMaxOfRange(layer.range) 

	changeLegendTitle(cov,paramKey)

	changeLegendScale(cov, minMax)

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

	legendBar.style.background = "linear-gradient(to top," + colourString + ")"

}





