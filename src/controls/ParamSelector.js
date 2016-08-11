function ParamSelector(cov) {
  this._cov = cov
  var paramUI = document.getElementById("paramUI")
  var self = this

  this.initParams()
  var all = document.querySelectorAll("input")
  var arr = Array.from(all)
  for(var i = 0; i < all.length; i++) {
    all[i].addEventListener('click', function() {
      var otherBoxes = arr.filter(obj => obj.id != this.id).map(obj => obj.id)
      otherBoxes.forEach(function(obj) {
        document.getElementById(obj).checked = false
      })
      if(document.getElementById(this.value).checked) {
        self.fire("change", this.value)
      } else {
        self.fire("change", "off")
      }
    });
  }
}

ParamSelector.prototype.initParams = function() {
   var params = Array.from(this._cov.parameters.keys())

   var ps = document.getElementById("paramUI")
   var ul = document.getElementById("paramList")

   for(var i = 0; i < params.length; i++) {

     var li = document.createElement("li")
     var elem = document.createElement("input")
     elem.type = "checkbox"
     elem.id = params[i]
     elem.value = params[i]
     elem.checked = false;

     var label = document.createElement("label")
     label.appendChild(document.createTextNode(params[i]))
     li.appendChild(elem)
     li.appendChild(label)
     ul.appendChild(li)
   }
   ps.appendChild(ul)

   document.getElementById(params[0]).checked = true;
   this._paramKey = params[0]
 }

mixin(EventMixin, ParamSelector)
