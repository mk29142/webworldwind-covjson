
function createRGBString (colourValues) {
	return "rgb(" + colourValues[0] + "," + colourValues[1] + "," + colourValues[2] + ")"
}

function changeHTMLText (id, text) {

	var span = document.getElementById(id);
	var	txt = document.createTextNode(text);
	span.innerText = txt.textContent;	
}

function changeTitleAndUnits (cov, paramKey) {

	var param = cov.parameters.get(paramKey)
	var title = param.observedProperty.label.en
	var categories = param.observedProperty.categories

	changeHTMLText("legend-title", title)

	if(!categories){
		var units = param.unit.label.en
		changeHTMLText("legend-units", "(" + units + ")")
	}

}

function changeLegendScale(cov, minMax) {

	changeHTMLText("start", minMax[0])
	changeHTMLText("finish", minMax[1])
	
}

function addCategoricalElement(tag, colour) {
	var ul = document.getElementById("labels");
	var li = document.createElement("li");
	var span = document.createElement("span");
	span.setAttribute("style", "background-color: " + colour + ";")
	li.appendChild(span)
	li.appendChild(document.createTextNode(tag));
	ul.appendChild(li); 
}

function createContinousLegend (cov, layer) {

	var paramKey = cov.parameters.keys().next().value
	var palette = layer.palette
	var legend = document.getElementById("my-legend")
	var minMax = CovUtils.minMaxOfRange(layer.range) 

	changeTitleAndUnits(cov,paramKey)

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

function createCategoricalLegend (cov, layer, categories) { 

	var paramKey = cov.parameters.keys().next().value

	changeTitleAndUnits(cov, paramKey)	

	if (colourDefaultPresent(categories)) {  
		// extract everything from cov (for loop)
		for (var i = 0; i < categories.length; i++) {
			addCategoricalElement(categories[i].label.en, categories[i].preferredColor)
		}
	} else {
		// associate each colour in palette array with name which can be extracted from categories (for loop)
		console.log("here")		
	}

	// for(var i = 0; i < categories.length; i++) {

	// 	console.log(categories[i].label.en)
	// 	console.log(categories[i].preferredColor)
	// }
	// 	console.log(layer.palette)
}






