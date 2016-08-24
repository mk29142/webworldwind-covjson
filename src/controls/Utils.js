var CJ360 = window.CJ360 || {};

/**
 * @external {Coverage} https://github.com/Reading-eScience-Centre/coverage-jsapi/blob/master/Coverage.md
 */

/**
 * @param {Array} colourValues
 *  Takes an array of 3 numbers provided by the palette
 *  and converts them into an RGB string that is compatiable
 *  with a css gradient.
 */
CJ360.createRGBString = function (colourValues) {
	return "rgb(" + colourValues[0] + "," + colourValues[1] + "," + colourValues[2] + ")";
};

/**
 * @param {String} id
 * @param {String} text
 *  Dynamically changes the text in an HTML
 *  div given by the id.
 */
CJ360.changeHTMLText = function (id, text, legendid) {
	var container = document.querySelector("." + legendid);
	var span = container.querySelector("." + id);
	var	txt = document.createTextNode(text);
	span.innerText = txt.textContent;
};

/**
 * @param {Coverage} cov
 * @param {String} paramKey
 * Dynamically changes the title of the legend to that
 * specified by the coverageJSON file and if it continous it
 * adds in the units of the data i.e Degrees Celcius for Temperature
 */
CJ360.changeTitleAndUnits = function (cov, paramKey, legendid) {

	var param = cov.parameters.get(paramKey);
	var title = param.observedProperty.label.en;
	var categories = param.observedProperty.categories;

	CJ360.changeHTMLText("legend-title", title, legendid);

	if(!categories){
		if(param.unit) {
			var units = param.unit.label.en;
		CJ360.changeHTMLText("legend-units", "(" + units + ")", legendid);
	    }
	}
};

CJ360.clearCategoricalElements = function () {
	var ul = document.querySelector(".legend-labels");
	if (ul) {
		while (ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}
	}
};

/**
 * Clears everything in the legend for when a parameter is switched off.
 * @param{}
 */
CJ360.clearLegend = function (legendid) {
		CJ360.changeHTMLText("legend-title", "", legendid);
		CJ360.changeHTMLText("legend-units", "", legendid);

		CJ360.clearCategoricalElements();

		var legend = document.getElementById("my-legend");
		legend.style.visibility = "hidden";
};

CJ360.clearSelectors = function () {
	var dateStamps = document.querySelector(".dateStamps");
	if(dateStamps) {
		dateStamps.options.length = 0;
	}
	var timeStamps = document.querySelector(".timeStamps");
	if(timeStamps) {
		timeStamps.options.length = 0;
	}
	var zaxis = document.querySelector(".zaxis");
	if(zaxis) {
		zaxis.options.length = 0;
	}
};

/**
 * Creates a legend for a given layer and parameter key.
 * Legend can be either continous or categorical i.e for continous
 * or discrete datasets.
 * @param {Coverage} cov
 * @param {class} layer
 * @param {String} paramKey
 */
CJ360.createLegend = function (cov, layer, paramKey, legendid) {
	var param = cov.parameters.get(paramKey);
	var allCategories = param.observedProperty.categories;

	CJ360.initLegendTags(legendid);

	if (!allCategories) {
    return new CJ360.ContinousLegend(cov, layer, paramKey, legendid);
  } else {
    return new CJ360.CategoricalLegend(cov, layer, allCategories, paramKey, legendid);
  }
};

CJ360.initLegendTags = function (legendid) {

		var container = document.getElementById(legendid);

		CJ360.createAndAddtoContainer(legendid, "legend-title", "div");
		CJ360.createAndAddtoContainer(legendid, "legend-units", "div");
		container.appendChild(document.createElement("br"));
		CJ360.createAndAddtoContainer(legendid, "legend-bar", "div");
		CJ360.createAndAddtoContainer(legendid, "legend-scale-continous", "div");
		CJ360.createAndAddtoContainer("legend-scale-continous", "start", "div");
		CJ360.createAndAddtoContainer("legend-scale-continous", "finish", "div");
		CJ360.createAndAddtoContainer(legendid, "legend-scale-categorical", "div");
		CJ360.createAndAddtoContainer("legend-scale-categorical", "legend-labels", "ul");

};

CJ360.createAndAddtoContainer = function (containerID, elemName, type) {

	if(!document.querySelector("." + elemName)) {
		var elem = document.createElement(type);
		elem.className = elemName;
		var container = document.querySelector("." + containerID);
		container.appendChild(elem);
	}

};
