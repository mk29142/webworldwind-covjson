var CJ360 = window.CJ360 || {};

CJ360.DepthSelector = function (values, options) {
	this._depthId = options.zaxisID;
	var self = this;

	this._initTags();

 	var depthStamps = document.querySelector("." + this._depthId);

	this._fillDepthOptions(values);

	depthStamps.addEventListener("change" , function() {
		self.fire("change", {value: this.value});
	});
};
/**
 * Populates the dropdown menu for the depth
 * @param {Array} values
 */
CJ360.DepthSelector.prototype._fillDepthOptions = function (values) {

	var depthStamps = document.querySelector("." + this._depthId);

	depthStamps.options.length = 0;

	for(var i = 0; i < values.length; i++) {
		var option = document.createElement("option");
		option.setAttribute("value", values[i]);
		option.appendChild(document.createTextNode(values[i]));
		depthStamps.appendChild(option);
	}
};

CJ360.DepthSelector.prototype._initTags = function () {

	CJ360.createAndAddtoContainer("depthUI", "depth", "div");
	document.querySelector(".depth").appendChild(document.createTextNode("Depth"));
	CJ360.createAndAddtoContainer("depthUI", "zaxis", "select");

};

CJ360.mixin(CJ360.EventMixin, CJ360.DepthSelector);
