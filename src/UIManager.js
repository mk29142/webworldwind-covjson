function UIManager(wwd, cov, dom, param) {
  this._wwd = wwd;
  this._cov = cov;
  this._dom = dom;
  this._fullTime = "";
  this._param = param;
  var self = this;

  var timeAxis = dom.axes.get("t");
  var zaxis = dom.axes.get("z");

  if(!timeAxis && !zaxis) {
    //creates the intial layer before any UI options are selected
    layer = this.createLayer({time: "", depth: ""});
    layer.on('load', function (vectorLayer) {
      vectorLayer ? self._wwd.addLayer(vectorLayer) : self._wwd.addLayer(layer);
    }).load();
    this._layer = layer;
  } else if(timeAxis && !zaxis) {
    // this._wwd.removeLayer(this._layer);
    this._layer = this.runTimeSelector(timeAxis);
  } else if(!timeAxis && zaxis ) {
    // this._wwd.removeLayer(this._layer);
    this._layer = this.runDepthSelector(zaxis);
  } else {
    this._layer = this.runSelectors(timeAxis, zaxis)
  }


}
/**
 * Runs the time UI, firstly creates the layer based
 * on the initialised values in the boxes and then uses the event handler to
 * change the layer based on specfic time frame
 * @param {Object} timeAxis
 */
UIManager.prototype.runTimeSelector = function (timeAxis) {
  var self = this;

  var values = timeAxis.values;

  timeSelector = new TimeSelector(values, {dateId: "dateStamps", timeId: "timeStamps"});

  var dateStamps = document.getElementById("dateStamps");
  var timeStamps = document.getElementById("timeStamps");

  var date = dateStamps.options[dateStamps.selectedIndex].value;
  var time = timeStamps.options[timeStamps.selectedIndex].value;

  // this._wwd.removeLayer(this._layer);
  var layer = this.createLayer({time: date + "T" + time})
  .on('load', function () {
    self._wwd.addLayer(layer)
  }).load();
  this._fullTime = date + "T" + time;


  timeSelector.on("change", function (time) {
    self._wwd.removeLayer(layer);
    layer = self.createLayer({time: time.value})
    .on('load', function () {
      self._wwd.addLayer(layer);
    }).load();
    this._fullTime = time;
  });
  return layer;
}

/**
 * Runs the depth UI, firstly creates the layer based
 * on the initialised values in the boxes and then uses the event handler to
 * change the layer based on specfic depth
 * @param {Object} zaxis
 */
UIManager.prototype.runDepthSelector = function(zaxis) {
  var self = this;

  if(!zaxis) {
    layer = this.createLayer()
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load();
      return layer;
  }else {

    var values = zaxis.values;

    depthSelector = new DepthSelector(values, {zaxisID: "zaxis"});

    var depthStamps = document.getElementById("zaxis");

    var currDepth = depthStamps.options[depthStamps.selectedIndex].value;

    // this._wwd.removeLayer(this._layer);
    var layer = this.createLayer({depth: currDepth})
    .on('load', function () {
      self._wwd.addLayer(layer)
    }).load();
    this._depth = currDepth;

    depthSelector.on("change", function (depth) {
      self._wwd.removeLayer(layer);
      layer = self.createLayer({depth: depth.value})
      .on('load', function () {
        self._wwd.addLayer(layer);
      }).load();
      this._depth = depth;
    });
    return layer;
  }
}

UIManager.prototype.runSelectors = function(timeAxis, zaxis) {

  var self = this;

  var values = timeAxis.values;

  timeSelector = new TimeSelector(values, {dateId: "dateStamps", timeId: "timeStamps"});

  var dateStamps = document.getElementById("dateStamps");
  var timeStamps = document.getElementById("timeStamps");

  var date = dateStamps.options[dateStamps.selectedIndex].value;
  var time = timeStamps.options[timeStamps.selectedIndex].value;

  var values = zaxis.values;

  depthSelector = new DepthSelector(values, {zaxisID: "zaxis"});

  var depthStamps = document.getElementById("zaxis");

  var currDepth = depthStamps.options[depthStamps.selectedIndex].value;

  var layer = this.createLayer({time: date + "T" + time, depth: currDepth})
  .on('load', function () {
    self._wwd.addLayer(layer)
  }).load();
  this._depth = currDepth;
  this._fullTime = date + "T" + time;

  timeSelector.on("change", function(time) {

    self._wwd.addLayer(layer)

    depthSelector.on("change", function(depth) {

      layer = self.createLayer({time: time.value, depth: depth.value})
      .on('load', function () {
        self._wwd.addLayer(layer);
      }).load();
      this._depth = depth;
    });
    this._fullTime = time;
  });

  return layer;
};

/**
 * Creates a new layer with specific attributes
 * and creates a legend for it
 * @param {Object} options
 */
UIManager.prototype.createLayer = function(options) {
  var cov = this._cov;
  var self = this;

  var layer = CovJSONLayer(cov, {
    paramKey: this._param,
    time: options.time,
    depth: options.depth
  }).on('load', function () {
    this._legend = createLegend(cov, layer, self._param);
  });
  return layer;
}

UIManager.prototype.getLayer = function() {
  return this._layer;
}
