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

  var uiManager

  CovJSON.read("testdata/grid.covjson").then(function (cov) {

    // var firstParamKey = cov.parameters.keys().next().value

    cov.loadDomain().then(function(dom) {
      uiManager = new UIManager(wwd,cov,dom)
      var cR = new WorldWind.ClickRecognizer(wwd, function() {
        console.log("here");

      })


    //
    //   var layer = CovJSONLayer(cov, {
    //     paramKey: firstParamKey,
    //   })

    })
  })
}())
