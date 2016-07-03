// Create a World Window for the canvas.
var wwd = new WorldWind.WorldWindow("worldwind")

// Add some image layers to the World Window's globe.
wwd.addLayer(new WorldWind.BMNGOneImageLayer())
wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer())

// Add a compass, a coordinates display and some view controls to the World Window.
wwd.addLayer(new WorldWind.CompassLayer())
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd))
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd))

// Add a CovJSON layer
CovJSON.read('grid.covjson').then(function (cov) {
  var firstParamKey = cov.parameters.keys().next().value
  var covjsonLayer = CovJSONLayer(cov, {
    displayName: 'CovJSON Grid',
    paramKey: firstParamKey
  })
  wwd.addLayer(covjsonLayer)
  
  wwd.goTo(new WorldWind.Position(50, 10, 4000000))
})

// add a computed coverage layer
function linspace (start, end, n) {
  var d = (end - start) / (n - 1 )
  return {
    length: n,
    get: function (i) {
      return start + i * d
    }
  }
}

var nx = 3000
var ny = 3000
var griddata = xndarray({
  length: nx*ny,
  get: function (i) {
    return i
  }
}, {
  shape: [ny,nx],
  names: ['y','x'],
  coords: {
    y: linspace(-70, 70, ny),
    x: linspace(-100, 0, nx)
  }
})

var covjsonLayer = new CovJSONGridLayer(CovUtils.fromXndarray(griddata), {
  displayName: 'Generated Grid',
  paletteExtent: [0,nx*ny]
})
wwd.addLayer(covjsonLayer)

