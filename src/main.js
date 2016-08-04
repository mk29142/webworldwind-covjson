






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


  function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  var uiManager
  var file_name = getParameterByName('file_name');
  console.log(file_name)
  CovJSON.read("testdata/" + file_name).then(function (cov) {

    cov.loadDomain().then(function(dom) {
      uiManager = new UIManager(wwd,cov,dom)
      // var layer = uiManager.getLayer()
      // console.log(layer);

      // var proj = CovUtils.getProjection(dom)
      // console.log(proj);

      var cR = new WorldWind.ClickRecognizer(wwd, function() {
        var xClick = cR.clientX
        var yClick = cR.clientY

        console.log(xClick + "  " + yClick);

        var lats = dom.axes.get('y').values
        var lons = dom.axes.get('x').values

        var bbox = getGridBbox(dom.axes)
        console.log(bbox);

        //world wind has bug, doesn't give right lon and lat when zoomed out
        var vec = new WorldWind.Vec2(xClick, yClick)
        var lat = wwd.pick(vec).terrainObject().position.latitude
        var long = wwd.pick(vec).terrainObject().position.longitude

        var iLat = CovUtils.indexOfNearest(lats, lat)
        var iLon = CovUtils.indexOfNearest(lons, long)

        console.log(lat + "  " + long);
          var firstParamKey = cov.parameters.keys().next().value
          cov.loadRange(firstParamKey).then(function(range) {
            console.log(range.get({y: iLat, x: iLon}))
          })
      })


    //
    //   var layer = CovJSONLayer(cov, {
    //     paramKey: firstParamKey,
    //   })

    })
  })
}())

