(function () {

  // Create a World Window for the canvas.
  var wwd = new WorldWind.WorldWindow("worldwind")

  // Add some image layers to the World Window's globe.
  wwd.addLayer(new WorldWind.BMNGOneImageLayer())
  wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer())

  // Add a compass, a coordinates display and some view controls to the World Window.
  wwd.addLayer(new WorldWind.CompassLayer())
  wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd))
  wwd.addLayer(new WorldWind.ViewControlsLayer(wwd))

  window.wwd = wwd

  var legend
  var layer
  var timeSelector
  var uiManager

  CovJSON.read('testdata/grid2.covjson').then(function (cov) {

    cov.loadDomain().then(function(dom) {

      uiManager = new UIManager(wwd,cov,dom)

    })
  })

  function createLayer (cov, time) {
    var firstParamKey = cov.parameters.keys().next().value

    var layer = CovJSONLayer(cov, {
      paramKey: firstParamKey,
      time: time
    }).on('load', function () {
      legend = createLegend(cov, layer, firstParamKey)
    })
    return layer
  }

}())
