
  (function () {

  // Create a World Window for the canvas.
  var wwd = new WorldWind.WorldWindow("worldwind");

  // Add some image layers to the World Window's globe.
  wwd.addLayer(new WorldWind.BMNGOneImageLayer());
  wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer());

  // Add a compass, a coordinates display and some view controls to the World Window.
  wwd.addLayer(new WorldWind.CompassLayer());
  wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
  wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

  window.wwd = wwd;

  var url = window.location.href;
  var filepath = url.split('#');
  var fileName = "testdata/grid.covjson";

  if(filepath[1]) {
    fileName = filepath[1];
    if(fileName == "1") {
      fileName = "testdata/multiTime.covjson"
    } else if (fileName == "2") {
      fileName = "testdata/grid2.covjson"
    } else if (fileName == "3") {
      fileName = "testdata/demo.covjson";
    }else if (fileName == "4") {
      fileName = "testdata/XYZLandcover.covjson"
    }else {
      fileName = filepath[1];
    }
  }

  CovJSON.read(fileName).then(function (cov) {

    cov.loadDomain().then(function(dom) {
      var ps = new CJ360.ParamSelector(cov);

      var uiManager = new CJ360.UIManager(wwd,cov,dom, cov.parameters.keys().next().value, "my-legend");
      var layer = uiManager.getLayer();

      var popup = new CJ360.Popup(wwd, cov, dom).display();

      ps.on("change", function(val) {
        if(val == "off") {
          // console.log(layer);
          CJ360.clearLegend("my-legend");
          CJ360.clearSelectors();
          wwd.removeLayer(layer);
        }else {
          var legend = document.getElementById("my-legend");
          legend.style.visibility = "visible";
          uiManager = new CJ360.UIManager(wwd, cov, dom, val, "my-legend");
          layer = uiManager.getLayer();
        }
      });
        // wwd.goTo(new WorldWind.Position(-40.2, -5.1, 4000000));
    });
  });
}());
