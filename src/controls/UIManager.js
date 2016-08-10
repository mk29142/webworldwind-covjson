function UIManager(wwd, cov, dom) {
  this._wwd = wwd
  this._cov = cov
  this._dom = dom
  this._fullTime = ""
  this._paramKey = cov.parameters.keys().next().value

  var self = this

  this.initParams()

  layer = this.createLayer({time: "", depth: ""})
    .on('load', function() {
      self._wwd.addLayer(layer).load()
    })

  this._layer = layer

  this.chooseSelector(dom)

}

UIManager.prototype.initParams = function() {
  var params = Array.from(this._cov.parameters.keys())

  var ps = document.getElementById("paramUI")
  var ul = document.getElementById("paramList")

  for(var i = 0; i < params.length; i++) {

    var li = document.createElement("li")
    var elem = document.createElement("input")
    elem.type = "checkbox"
    elem.id = params[i]
    elem.value = params[i]
    elem.checked = false;
    // elem.class = "paramCheckBox"

    var label = document.createElement("label")
    label.appendChild(document.createTextNode(params[i]))
    li.appendChild(elem)
    li.appendChild(label)
    ul.appendChild(li)
  }
  ps.appendChild(ul)

  document.getElementById(params[0]).checked = true;
  this._paramKey = params[0]
}

// UIManager.prototype.paramSelector = function() {
//   var ps = new ParamSelector(Array.from(this._cov.parameters.keys()))
//
// }

UIManager.prototype.chooseSelector = function(dom) {

  var timeAxis = dom.axes.get("t")
  var zaxis = dom.axes.get("z")

  if(timeAxis) {
    this._layer = this.runTimeSelector(timeAxis)
  }else {
    var timeUI = document.getElementById("timeUI")
    timeUI.parentNode.removeChild(timeUI)
  }
  if(zaxis) {
    this._layer = this.runDepthSelector(zaxis)
    // console.log(this._depth);
  }else {
    var depthUI = document.getElementById("depthUI")
    depthUI.parentNode.removeChild(depthUI)
  }
}

UIManager.prototype.runTimeSelector = function (timeAxis) {
  var self = this

  if(!timeAxis) {
    layer = this.createLayer()
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
      return layer
  }else {

    var values = timeAxis.values

    timeSelector = new TimeSelector(values, {dateId: "dateStamps", timeId: "timeStamps"})

    var dateStamps = document.getElementById("dateStamps")
    var timeStamps = document.getElementById("timeStamps")

    var date = dateStamps.options[dateStamps.selectedIndex].value
    var time = timeStamps.options[timeStamps.selectedIndex].value

    layer = this.createLayer({time: date + "T" + time})
    .on('load', function () {
      self._wwd.addLayer(layer)
    }).load()
    this._fullTime = date + "T" + time

    timeSelector.on("change", function (time) {
      self._wwd.removeLayer(layer)
      layer = self.createLayer({time: time.value})
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
      this._fullTime = time
    })
    return layer
  }
}

UIManager.prototype.runDepthSelector = function(zaxis) {
  var self = this

  if(!zaxis) {
    layer = this.createLayer()
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
      return layer
  }else {

    var values = zaxis.values

    depthSelector = new DepthSelector(values, {zaxisID: "zaxis"})

    var depthStamps = document.getElementById("zaxis")

    var currDepth = depthStamps.options[depthStamps.selectedIndex].value

    layer = this.createLayer({depth: currDepth})
    .on('load', function () {
      self._wwd.addLayer(layer)
    }).load()
    this._depth = currDepth

    depthSelector.on("change", function (depth) {
      self._wwd.removeLayer(layer)
      layer = self.createLayer({depth: depth.value})
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
      this._depth = depth
    })
    return layer
  }
}

UIManager.prototype.createLayer = function(options) {
  var cov = this._cov
  // var firstParamKey = cov.parameters.keys().next().value
  var self = this
  var ps = new ParamSelector()
  ps.on("change", function(val) {
    this._paramKey = val
    // console.log(this._paramKey);
  })
  var layer = CovJSONLayer(cov, {
    paramKey: this._paramKey,
    time: options.time,
    depth: options.depth
  }).on('load', function () {
    self._legend = createLegend(cov, layer, self._paramKey)
  })
  return layer
}

UIManager.prototype.getLayer = function() {
  return this._layer
}

UIManager.prototype.getParamFromCheckBox = function() {

  var params = Array.from(this._cov.parameters.keys())

  //maps over whether the specific checkbox has been ticked or not
  //true if ticked else false
  //if true we want to take the associated param
  var temp = params.map(param => document.getElementById(param).checked)
  return params[temp.indexOf(true)]

}
