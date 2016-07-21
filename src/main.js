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



  CovJSON.read('testdata/multiTime.covjson').then(function (cov) {

    cov.loadDomain().then(function(dom) {

      var values = dom.axes.get("t").values

      layer = createLayer(cov)
        .on('load', function () {
          wwd.addLayer(layer)
        }).load()

      timeSelector = new TimeSelector(values, {dateId: "dateStamps", timeId: "timeStamps"}).on("change", function (time) {)
        wwd.removeLayer(layer)
        layer = createLayer(cov, time.value)
          .on('load', function () {
            wwd.addLayer(layer)
          }).load()
      })
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
/*


function onLayerLoad (cov, layer, categories) {

  if (!categories) {
    createContinousLegend(cov, layer)
  } else {
    createCategoricalLegend(cov, layer, categories)
  }
  cov.loadDomain().then(function(dom) {
    var values = dom.axes.get("t")
    if(values) {
      addDropDown(cov, layer)
    }
  })
}

function getWWD() {
  return wwd
}


// Add a CovJSON layer
CovJSON.read('multiTime.covjson').then(function (cov) {
  var firstParamKey = cov.parameters.keys().next().value

  var covjsonLayer = CovJSONLayer(cov, {
    paramKey: firstParamKey,
    onload: onLayerLoad,
    time: undefined
  })
  wwd.addLayer(covjsonLayer)

  window.wwd = wwd

  window.layer = covjsonLayer

  // wwd.goTo(new WorldWind.Position(50, 10, 4000000))
})
*/

// add a computed coverage layer
// function linspace (start, end, n) {
//   var d = (end - start) / (n - 1 )
//   return {
//     length: n,
//     get: function (i) {
//       return start + i * d
//     }
//   }
// }

// var nx = 3000
// var ny = 3000
// var griddata = xndarray({
//   length: nx*ny,
//   get: function (i) {
//     return i
//   }
// }, {
//   shape: [ny,nx],
//   names: ['y','x'],
//   coords: {
//     y: linspace(-70, 70, ny),
//     x: linspace(-100, 0, nx)
//   }
// })

// var covjsonLayer = new CovJSONGridLayer(CovUtils.fromXndarray(griddata), {
//   displayName: 'Generated Grid',
//   paletteExtent: [0,nx*ny]
// })
// wwd.addLayer(covjsonLayer)
