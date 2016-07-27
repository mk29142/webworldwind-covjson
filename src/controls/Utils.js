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
		if(param.unit) {
			var units = param.unit.label.en
		changeHTMLText("legend-units", "(" + units + ")")
	    }
	}

}

function createLegend (cov, layer, paramKey) {
	var param = cov.parameters.get(paramKey)
	var allCategories = param.observedProperty.categories

	if (!allCategories) {
    return new ContinousLegend(cov, layer)
  } else {
    return new CategoricalLegend(cov, layer, allCategories)
  }
}
