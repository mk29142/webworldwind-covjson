var CJ360 = window.CJ360 || {};

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
CJ360.CategoricalLegend = function (cov, layer, categories, paramKey, legendid) {

	this._legendID = legendid;
	this._legendContainer = document.getElementById(legendid);

	CJ360.clearCategoricalElements();

	var legendBar = this._legendContainer.querySelector(".legend-bar");
	legendBar.style.display = "none";

	var lsc = this._legendContainer.querySelector('.legend-scale-continous');
	lsc.style.display = "none";

	CJ360.changeTitleAndUnits(cov, paramKey, legendid);

	if (CJ360.colourDefaultPresent(categories)) {
		for (var i = 0; i < categories.length; i++) {
			this.addCategoricalElement(categories[i].label.en, categories[i].preferredColor);
		}
	} else {
		for(var i = 0; i < categories.length; i++) {
			var colour = CJ360.createRGBString(layer.palette[i]);
			this.addCategoricalElement(categories[i].label.en, colour);
		}
	}
};

/**
 * @param {String} tag
 * @param {Integer} colour (colour is in hex code)
 * Created a li object and a span for the colour of the
 * category and adds it to the main div in the html.
 */
CJ360.CategoricalLegend.prototype.addCategoricalElement = function (tag, colour) {

	var ul = this._legendContainer.querySelector(".legend-labels");
	var li = document.createElement("li");
	var span = document.createElement("span");
	span.setAttribute("style", "background-color: " + colour + ";");
	li.appendChild(span);
	li.appendChild(document.createTextNode(tag));
	ul.appendChild(li);
};
