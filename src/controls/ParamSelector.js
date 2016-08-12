function ParamSelector(cov) {
  this._cov = cov
  var paramUI = document.getElementById("paramUI")
  var self = this

  this.initParams()
  var all = document.querySelectorAll("input")
  var arr = Array.from(all)
  for(var i = 0; i < all.length; i++) {
    all[i].addEventListener('click', function() {

      //gets all other parameters and unclicks them so that only one box at
      // a time is checked.
      var otherBoxes = arr.filter(obj => obj.id != this.id).map(obj => obj.id)
      otherBoxes.forEach(obj => document.getElementById(obj).checked = false)

      if(document.getElementById(this.value).checked) {
        self.fire("change", this.value)
      } else {
        //if this box has been unchecked then it fires a special string to indicate this action
        self.fire("change", "off")
      }
    })
  }
}

/**
 * Creates a check box for each parameter in the coverageJSON file.
 */
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
