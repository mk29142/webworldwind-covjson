
function DepthSelector(values, options) {
	this._depthId = options.zaxisID
	var self = this

 	var depthStamps = document.getElementById(this._depthId)

	this._fillDepthOptions(values)

	// console.log(depthStamps.options[depthStamps.selectedIndex].value);
	depthStamps.addEventListener("change" , function() {
    // console.log(this.value);
		self.fire("change", {value: this.value})
    })
}

DepthSelector.prototype._fillDepthOptions = function (values) {

	var depthStamps = document.getElementById(this._depthId)

	depthStamps.options.length = 0

	for(var i = 0; i < values.length; i++) {
		var option = document.createElement("option")
		option.setAttribute("value", values[i])
		option.appendChild(document.createTextNode(values[i]))
		depthStamps.appendChild(option)
	}
}

mixin(EventMixin, DepthSelector)
