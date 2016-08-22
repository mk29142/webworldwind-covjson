var CJ360 = window.CJ360 || {};

/**
 * @external {Coverage} https://github.com/Reading-eScience-Centre/coverage-jsapi/blob/master/Coverage.md
 */

 /**
  * @param {Coverage} cov
  * @param {CoverageJSONLayer} layer
  * Creates a continous legend with a colour gradient for continous data types
  * like temperature by extracting the colours from the layer and the key information
  * of the cateogry from the Coverage object.
  */
 CJ360.ContinousLegend = function (cov, layer, paramKey, legendid) {

	 this._legendID = legendid;
	 this._legendContainer = document.getElementById(legendid);
	 var self = this;

 	// var paramKey = cov.parameters.keys().next().value
 	var palette = layer.palette;
 	var legend = document.getElementById("my-legend");
 	// console.log(cov.domainType

 	cov.loadRange(paramKey).then(function(range) {
 		var val = CovUtils.minMaxOfRange(range);
 		if(cov.domainType !== "http://covjson.org/def/domainTypes#Point") {
 			self.changeLegendScale(cov, val);
 		} else {
 				self.changeLegendScale(cov, [val[0] - 10, val[0] + 10]);
 		}
 })

 	CJ360.changeTitleAndUnits(cov, paramKey, this._legendID);

 	legend.style.display = "inline";

 	var legendBar = this._legendContainer.querySelector(".legend-bar");
 	legendBar.style.display = "inline";

 	var lsc = this._legendContainer.querySelector('.legend-scale-continous');
 	lsc.style.display = "inline";

 	CJ360.clearCategoricalElements();

 	var colourString = "";

 	for (var i = 0; i < palette.length; i++) {
 		if (i !== palette.length - 1) {
 			colourString += CJ360.createRGBString(palette[i]) + ",";
 		} else {
 			colourString += CJ360.createRGBString(palette[i]);
 		}
 	}

 	legendBar.style.background = "linear-gradient(to top," + colourString + ")";
};


/**
 * @param {Coverage} cov
 * @param {Array} minMax
 * Takes in the maximum and minimum values from the
 * continous data set and adds them to the legend.
 */
CJ360.ContinousLegend.prototype.changeLegendScale = function (cov, minMax) {

	CJ360.changeHTMLText("start", minMax[0], this._legendID);
	CJ360.changeHTMLText("finish", minMax[1], this._legendID);

}
