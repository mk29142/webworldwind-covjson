// this function is taken from leaflet-coverage/src/layers/Grid.js#_getDomainBbox
function getGridBbox (axes) {
  function extent (x, xBounds) {
    var xend = x.length - 1
    var xmin, xmax
    if (xBounds) {
      xmin = xBounds.get(0)[0]
      xmax = xBounds.get(xend)[1]
    } else {
      xmin = x[0]
      xmax = x[xend]
    }
    var xDescending = xmin > xmax
    if (xDescending) {
      var tmp = xmin
      xmin = xmax
      xmax = tmp
    }
    // we derive the size of the first/last grid cell if no bounds exist
    if (!xBounds && x.length > 1) {
      if (xDescending) {
        xmin -= (x[xend - 1] - x[xend]) / 2
        xmax += (x[0] - x[1]) / 2
      } else {
        xmin -= (x[1] - x[0]) / 2
        xmax += (x[xend] - x[xend - 1]) / 2 
      }
    }
    return [xmin, xmax]
  }
  
  var xAxis = axes.get('x')
  var yAxis = axes.get('y')
  var xextent = extent(xAxis.values, xAxis.bounds)
  var yextent = extent(yAxis.values, yAxis.bounds)

  return [xextent[0], yextent[0], xextent[1], yextent[1]]
}

var CovJSONGridLayer = function (cov, options) {
  var self = this
  this.cov = cov
  this.paramKey = options.paramKey
  Promise.all([cov.loadDomain(), cov.loadRange(this.paramKey)]).then(function (res) {
    self.domain = res[0]
    self.range = res[1]
    
    self.paletteExtent = options.paletteExtent || CovUtils.minMaxOfRange(self.range)
    self._palette = hexToRgb(palette('tol-dv', 1000))
    
    var bbox = getGridBbox(self.domain.axes)
    self._bbox = bbox
    
    TiledCanvasLayer.call(self, new WorldWind.Sector(bbox[1], bbox[3], bbox[0], bbox[2]), 256, 256, options.displayName)
  })
}

CovJSONGridLayer.prototype = Object.create(TiledCanvasLayer.prototype);

CovJSONGridLayer.prototype.drawCanvasTile = function (canvas, tile) {
  var ctx = canvas.getContext('2d')
  var tileWidth = tile.tileWidth
  var tileHeight = tile.tileHeight
  
  var imgData = ctx.getImageData(0, 0, tileWidth, tileHeight)
  var rgba = xndarray(imgData.data, { shape: [tileHeight, tileWidth, 4] })
  
  // data coordinates
  var lats = this.domain.axes.get('y').values
  var lons = this.domain.axes.get('x').values
  
  // extended data bounding box
  var lonMin = this._bbox[0]
  var lonMax = this._bbox[2]
  var latMin = this._bbox[1]
  var latMax = this._bbox[3]  
  
  // tile coordinates
  var sector = tile.sector
  var tileLatMin = sector.minLatitude
  var tileLonMin = sector.minLongitude
  var tileLatMax = sector.maxLatitude
  var tileLonMax = sector.maxLongitude
  var tileLatStep = (tileLatMax - tileLatMin) / tileHeight
  var tileLonStep = (tileLonMax - tileLonMin) / tileWidth
  
  // used for longitude wrapping
  var lonRange = [lonMin, lonMin + 360]
  
  for (var tileX = 0; tileX < tileWidth; tileX++) {
    for (var tileY = 0; tileY < tileHeight; tileY++) {
      var lat = (tileHeight - 1 - tileY) * tileLatStep + tileLatMin
      var lon = tileX * tileLonStep + tileLonMin
      
      // we first check whether the tile pixel is outside the bounding box
      // in that case we skip it as we do not want to extrapolate
      if (lat < latMin || lat > latMax) {
        continue
      }

      lon = wrapNum(lon, lonRange, true)
      if (lon < lonMin || lon > lonMax) {
        continue
      }
      
      // read the value of the corresponding grid cell
      var iLat = CovUtils.indexOfNearest(lats, lat)
      var iLon = CovUtils.indexOfNearest(lons, lon)
      var val = this.range.get({y: iLat, x: iLon})
      
      // find the right color in the palette
      var colorIdx = scale(val, this._palette, this.paletteExtent)
      var color = this._palette[colorIdx]
      if (!color) {
        // out of scale
        continue
      }
      
      // and draw it
      rgba.set(tileY, tileX, 0, color[0])
      rgba.set(tileY, tileX, 1, color[1])
      rgba.set(tileY, tileX, 2, color[2])
      rgba.set(tileY, tileX, 3, 255)
    }
  }
  
  ctx.putImageData(imgData, 0, 0)
}

// from https://github.com/Leaflet/Leaflet/blob/master/src/core/Util.js
function wrapNum (x, range, includeMax) {
  var max = range[1]
  var min = range[0]
  var d = max - min
  return x === max && includeMax ? x : ((x - min) % d + d) % d + min
}

function hexToRgb (colors) {
  return colors.map(function(color) {
    var c = parseInt(color, 16)
    return [c >> 16, (c >> 8) & 255, c & 255]
  })
}

function scale (val, palette, extent) {
  // scale val to [0,paletteSize-1] using the palette extent
  // (IDL bytscl formula: http://www.exelisvis.com/docs/BYTSCL.html)
  var scaled = Math.trunc((palette.length - 1 + 0.9999) * (val - extent[0]) / (extent[1] - extent[0]))
  return scaled
}

var CovJSONVectorLayer = function (cov, options) {
  // TODO maybe convert coverage to GeoJSON and use GeoJSONParser, return RenderableLayer
}

var COVJSON_NS = 'http://covjson.org/def/domainTypes#'
var CovJSONVectorDomainTypes = [
  'VerticalProfile','PointSeries','Point','MultiPointSeries','MultiPoint',
  'PolygonSeries','Polygon','MultiPolygonSeries','MultiPolygon','Trajectory',
  'Section'
].map(function (name) { return COVJSON_NS + name })

var CovJSONLayer = function (cov, options) {
  if (cov.domainType === COVJSON_NS + 'Grid') {
    return new CovJSONGridLayer(cov, options)
  } else if (CovJSONVectorDomainTypes.indexOf(cov.domainType) !== -1) {
    return CovJSONVectorLayer(cov, options)
  } else {
    throw new Error('Unsupported CovJSON domain type: ' + cov.domainType)
  }
}
