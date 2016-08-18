function Popup(wwd, cov, dom) {
  this._wwd = wwd;
  this._cov = cov;
  this._dom = dom;
}

/**
 * Creates a popup box when the WorldWind canvas is clicked on.
 * uses the lat and long coordinates of the click to find the data value at that point
 * and displays it in a box at that position.
 */
Popup.prototype.display = function() {

  var self = this;

  var cR = new WorldWind.ClickRecognizer(this._wwd, function() {
    var xClick = cR.clientX;
    var yClick = cR.clientY;

    var lats = self._dom.axes.get('y').values;
    var lons = self._dom.axes.get('x').values;

    //world wind has bug, doesn't give right lon and lat when zoomed out
    var vec = new WorldWind.Vec2(xClick, yClick);
    var lat = wwd.pick(vec).terrainObject().position.latitude;
    var long = wwd.pick(vec).terrainObject().position.longitude;

    var iLat = CovUtils.indexOfNearest(lats, lat);
    var iLon = CovUtils.indexOfNearest(lons, long);

    var firstParamKey = self._cov.parameters.keys().next().value;
    var param = self._cov.parameters.get(firstParamKey);
    var property = param.observedProperty.label.en;
    var categories = param.observedProperty.categories;
    var encoding = param.categoryEncoding;

    self._cov.loadRange(firstParamKey).then(function(range) {

      var canvas = document.getElementById("canvas");
      var popup = document.getElementById("popup");
      var val = range.get({y: iLat, x: iLon});

      if(categories) {
        var keys = Array.from(encoding.keys());

        for(var i = 0; i < keys.length; i++) {
          var encodingVal = encoding.get(keys[i]);
          if(val == encodingVal) {
            val = keys[i];
            break;
          }
        }

        var newVal = categories.filter(obj => obj.id == val);

        if(val) {
          val = newVal[0].label.en;
        }
      }

      canvas.addEventListener("click", function(e) {
        var xPosition = e.clientX - canvas.offsetLeft;
        var yPosition = e.clientY - canvas.offsetTop;
        popup.style.left = xPosition+'px';
        popup.style.top = yPosition+'px';

        var	txt = document.createTextNode(val);

        if(!val) {
          txt = document.createTextNode("No data");
        }
        popup.innerText = txt.textContent;

      });
    });
  });
}
