function UIManager(wwd, cov, dom) {
  this._wwd = wwd
  this._cov = cov
  this._dom = dom

  var layer

  var timeAxis = dom.axes.get("t")
  this.runTimeSelector(timeAxis)

}

UIManager.prototype.runTimeSelector = function (timeAxis) {
  var self = this

  if(!timeAxis) {
    layer = this.createLayer(this._cov)
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

    layer = this.createLayer(date + "T" + time)
    .on('load', function () {
      self._wwd.addLayer(layer)
    }).load()

    timeSelector.on("change", function (time) {
      self._wwd.removeLayer(layer)
      layer = self.createLayer(time.value)
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
    })
  }
}

UIManager.prototype.createLayer = function(time) {
  var cov = this._cov
  var firstParamKey = cov.parameters.keys().next().value

  var layer = CovJSONLayer(cov, {
    paramKey: firstParamKey,
    time: time
  }).on('load', function () {
    this._legend = createLegend(cov, layer, firstParamKey)
  })
  return layer
}
