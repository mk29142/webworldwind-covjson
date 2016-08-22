var CJ360 = window.CJ360 || {};

CJ360.TiledCanvasLayer = function (sector, tileWidth, tileHeight, cachePath) {
  if(!cachePath) {
    cachePath = +new Date()
  }
  WorldWind.TiledImageLayer.call(this, sector, new WorldWind.Location(90, 180), 19, "image/x-canvas", cachePath, tileWidth, tileHeight);
}

CJ360.TiledCanvasLayer.prototype = Object.create(WorldWind.TiledImageLayer.prototype);

/**
* overrides TiledImageLayer.prototype.retrieveTileImage
*/
CJ360.TiledCanvasLayer.prototype.retrieveTileImage = function (dc, tile, suppressRedraw) {
  if (this.currentRetrievals.indexOf(tile.imagePath) < 0) {
      if (this.absentResourceList.isResourceAbsent(tile.imagePath)) {
          return;
      }

      var imagePath = tile.imagePath,
          cache = dc.gpuResourceCache,
          canvas = dc.currentGlContext.canvas,
          layer = this;

      var canvas = document.createElement('canvas');
      canvas.width = tile.tileWidth;
      canvas.height = tile.tileHeight;

      this.drawCanvasTile(canvas, tile);

      var texture = layer.createTexture(dc, tile, canvas);
      layer.removeFromCurrentRetrievals(imagePath);

      if (texture) {
          cache.putResource(imagePath, texture, texture.size);

          layer.currentTilesInvalid = true;
          layer.absentResourceList.unmarkResourceAbsent(imagePath);

          if (!suppressRedraw) {
              // Send an event to request a redraw.
              var e = document.createEvent('Event');
              e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
              canvas.dispatchEvent(e);
          }
      }

      this.currentRetrievals.push(imagePath);
  }
}
