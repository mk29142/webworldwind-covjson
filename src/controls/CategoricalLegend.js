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
	span.setAttribute("style", "background-color: " + colour + ";");
	li.appendChild(span);
	li.appendChild(document.createTextNode(tag));
	ul.appendChild(li);
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
function CategoricalLegend (cov, layer, categories, paramKey) {

	// var paramKey = cov.parameters.keys().next().value

	clearCategoricalElements();

	var legendBar = document.getElementById("legend-bar");
	legendBar.style.display = "none";

	var lsc = document.getElementById('legend-scale-continous');
	lsc.style.display = "none";

	changeTitleAndUnits(cov, paramKey);

	if (colourDefaultPresent(categories)) {
		for (var i = 0; i < categories.length; i++) {
			addCategoricalElement(categories[i].label.en, categories[i].preferredColor);
		}
	} else {
		for(var i = 0; i < categories.length; i++) {
			var colour = createRGBString(layer.palette[i]);
			addCategoricalElement(categories[i].label.en, colour);
		}
	}
}
