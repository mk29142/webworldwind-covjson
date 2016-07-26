function UIManager(wwd, cov, dom) {
  this._wwd = wwd
  this._cov = cov
  this._dom = dom

  var layer

  var timeAxis = dom.axes.get("t")
  var zaxis = dom.axes.get("z")
  if(timeAxis) {
    this.runTimeSelector(timeAxis)
  }
  if(zaxis) {
    this.runDepthSelector(zaxis)
  }
}

UIManager.prototype.runTimeSelector = function (timeAxis) {
  var self = this

  if(!timeAxis) {
    layer = this.createLayer()
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
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

    timeSelector.on("change", function (time) {
      self._wwd.removeLayer(layer)
      layer = self.createLayer({time: time.value})
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
    })
  }
}

UIManager.prototype.runDepthSelector = function(zaxis) {
  var self = this

  if(!zaxis) {
    layer = this.createLayer()
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
  }else {

    var values = zaxis.values

    depthSelector = new DepthSelector(values, {zaxisID: "zaxis"})

    var depthStamps = document.getElementById("zaxis")

    var currDepth = depthStamps.options[depthStamps.selectedIndex].value

    layer = this.createLayer({depth: currDepth})
    .on('load', function () {
      self._wwd.addLayer(layer)
    }).load()

    depthSelector.on("change", function (depth) {
      self._wwd.removeLayer(layer)
      layer = self.createLayer({depth: depth.value})
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
    })
  }
}

UIManager.prototype.createLayer = function(options) {
  var cov = this._cov
  var firstParamKey = cov.parameters.keys().next().value

  var layer = CovJSONLayer(cov, {
    paramKey: firstParamKey,
    time: options.time,
    depth: options.depth
  }).on('load', function () {
    this._legend = createLegend(cov, layer, firstParamKey)
  })
  return layer
}
