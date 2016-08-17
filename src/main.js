
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

  //
  // function getParameterByName(name, url) {
  //     if (!url) url = window.location.href;
  //     name = name.replace(/[\[\]]/g, "\\$&");
  //     var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  //         results = regex.exec(url);
  //     if (!results) return null;
  //     if (!results[2]) return '';
  //     return decodeURIComponent(results[2].replace(/\+/g, " "));
  // }
  //
  // var file_name = getParameterByName('file_name');
  // console.log(file_name)

  CovJSON.read("testdata/multiTime.covjson").then(function (cov) {

    cov.loadDomain().then(function(dom) {
      var ps = new ParamSelector(cov);

      var uiManager = new UIManager(wwd,cov,dom, cov.parameters.keys().next().value);
      var layer = uiManager.getLayer();

      var popup = new Popup(wwd, cov, dom).display();

      ps.on("change", function(val) {
        if(val == "off") {
          clearLegend();
          clearSelectors();
          wwd.removeLayer(layer);
        }else {
          var legend = document.getElementById("my-legend");
          legend.style.visibility = "visible";
          uiManager = new UIManager(wwd,cov,dom, val);
          layer = uiManager.getLayer();
        }
      });
        // wwd.goTo(new WorldWind.Position(-40.2, -5.1, 4000000));
    });
  });
}());
