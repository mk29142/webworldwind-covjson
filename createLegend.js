/**
 * @external {Coverage} https://github.com/Reading-eScience-Centre/coverage-jsapi/blob/master/Coverage.md
 */

/**
 * @param {Array} colourValues 
 *  Takes an array of 3 numbers provided by the palette
 *  and converts them into an RGB string that is compatiable
 *  with a css gradient.
 */
function createRGBString (colourValues) {
	return "rgb(" + colourValues[0] + "," + colourValues[1] + "," + colourValues[2] + ")"
}

/**
 * @param {String} id
 * @param {String} text
 *  Dynamically changes the text in an HTML
 *  div given by the id.
 */
function changeHTMLText (id, text) {

	var span = document.getElementById(id);
	var	txt = document.createTextNode(text);
	span.innerText = txt.textContent;	
}

/**
 * @param {Coverage} cov 
 * @param {String} paramKey
 * Dynamically changes the title of the legend to that 
 * specified by the coverageJSON file and if it continous it
 * adds in the units of the data i.e Degrees Celcius for Temperature
 */
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

/**
 * @param {Coverage} cov
 * @param {Array} minMax
 * Takes in the maximum and minimum values from the   
 * continous data set and adds them to the legend.
 */
function changeLegendScale(cov, minMax) {

	changeHTMLText("start", minMax[0])
	changeHTMLText("finish", minMax[1])
	
}

/**
 * @param {String} tag
 * @param {Integer} colour (colour is in hex code)
 * Created a li object and a span for the colour of the    
 * category and adds it to the main div in the html.
 */
function addCategoricalElement(tag, colour) {
	var ul = document.getElementById("labels");
	var li = document.createElement("li");
	var span = document.createElement("span");
	span.setAttribute("style", "background-color: " + colour + ";")
	li.appendChild(span)
	li.appendChild(document.createTextNode(tag));
	ul.appendChild(li); 
}

/**
 * @param {Coverage} cov
 * @param {CoverageJSONLayer} layer
 * Creates a continous legend with a colour gradient for continous data types
 * like temperature by extracting the colours from the layer and the key information 
 * of the cateogry from the Coverage object.
 */
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

/**
 * @param {Coverage} cov
 * @param {CoverageJSONLayer} layer
 * @param {Array} categories
 * Creates a block for each different category with a different
 * colour. If a preferred colour is present then all the data is extracted 
 * from the categories variable which is an array which holds details about each category.
 * Otherwise the category is associated with a colour from the palette which had random
 * colours assigned to it during initialisation. 
 */
function createCategoricalLegend (cov, layer, categories) { 

	var paramKey = cov.parameters.keys().next().value

	changeTitleAndUnits(cov, paramKey)	

	if (colourDefaultPresent(categories)) {  
		for (var i = 0; i < categories.length; i++) {
			addCategoricalElement(categories[i].label.en, categories[i].preferredColor)
		}
	} else {
		for(var i = 0; i < categories.length; i++) {
			var colour = createRGBString(layer.palette[i]) 
			addCategoricalElement(categories[i].label.en, colour)
		}		
	}

}






