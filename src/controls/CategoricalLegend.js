var CJ360 = window.CJ360 || {};

/**
 * @param {String} tag
 * @param {Integer} colour (colour is in hex code)
 * Created a li object and a span for the colour of the
 * category and adds it to the main div in the html.
 */
CJ360.addCategoricalElement = function (tag, colour) {
	var ul = document.getElementById("labels");
	var li = document.createElement("li");
	var span = document.createElement("span");
	span.setAttribute("style", "background-color: " + colour + ";");
	li.appendChild(span);
	li.appendChild(document.createTextNode(tag));
	ul.appendChild(li);
};

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
CJ360.CategoricalLegend = function (cov, layer, categories, paramKey) {

	// var paramKey = cov.parameters.keys().next().value

	CJ360.clearCategoricalElements();

	var legendBar = document.getElementById("legend-bar");
	legendBar.style.display = "none";

	var lsc = document.getElementById('legend-scale-continous');
	lsc.style.display = "none";

	CJ360.changeTitleAndUnits(cov, paramKey);

	if (CJ360.colourDefaultPresent(categories)) {
		for (var i = 0; i < categories.length; i++) {
			CJ360.addCategoricalElement(categories[i].label.en, categories[i].preferredColor);
		}
	} else {
		for(var i = 0; i < categories.length; i++) {
			var colour = CJ360.createRGBString(layer.palette[i]);
			CJ360.addCategoricalElement(categories[i].label.en, colour);
		}
	}
};
