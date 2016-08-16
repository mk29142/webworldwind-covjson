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
	return "rgb(" + colourValues[0] + "," + colourValues[1] + "," + colourValues[2] + ")";
}

/**
 * @param {Coverage} cov
 * @param {String} paramKey
 * Dynamically changes the title of the legend to that
 * specified by the coverageJSON file and if it continous it
 * adds in the units of the data i.e Degrees Celcius for Temperature
 */
function changeTitleAndUnits (cov, paramKey) {

	var param = cov.parameters.get(paramKey);
	var title = param.observedProperty.label.en;
	var categories = param.observedProperty.categories;

	changeHTMLText("legend-title", title)

	if(!categories){
		if(param.unit) {
			var units = param.unit.label.en;
		changeHTMLText("legend-units", "(" + units + ")");
	    }
	}
}

function clearCategoricalElements() {
	var ul = document.getElementById("labels");
	if (ul) {
		while (ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}
	}
}

/**
 * Clears everything in the legend for when a parameter is switched off.
 * @param{}
 */
function clearLegend() {
		changeHTMLText("legend-title", "");
		changeHTMLText("legend-units", "");

		clearCategoricalElements();

		var legend = document.getElementById("my-legend");
		legend.style.visibility = "hidden";
}

function clearSelectors() {
	var dateStamps = document.getElementById("dateStamps");
	dateStamps.options.length = 0;
	var timeStamps = document.getElementById("timeStamps");
	timeStamps.options.length = 0;
	var zaxis = document.getElementById("zaxis");
	zaxis.options.length = 0;
}

/**
 * Creates a legend for a given layer and parameter key.
 * Legend can be either continous or categorical i.e for continous
 * or discrete datasets.
 * @param {Coverage} cov
 * @param {class} layer
 * @param {String} paramKey
 */
function createLegend (cov, layer, paramKey) {
	var param = cov.parameters.get(paramKey);
	var allCategories = param.observedProperty.categories;

	if (!allCategories) {
    return new ContinousLegend(cov, layer, paramKey);
  } else {
    return new CategoricalLegend(cov, layer, allCategories, paramKey);
  }
}
