function ParamSelector() {
  var paramUI = document.getElementById("paramUI")
  var inputs = document.getElementsByTagName("input")
  var arr = Array.from(inputs)
  var self = this

  // document.addEventListener('DOMContentLoaded', function () {
    var all = document.querySelectorAll("input")
    for(var i = 0; i < all.length; i++) {
      all[i].addEventListener('click', function() {
        var otherBoxes = arr.filter(obj => obj.id != this.id).map(obj => obj.id)
        // console.log(otherBoxes);
        otherBoxes.forEach(function(obj) {
          document.getElementById(obj).checked = false
        })
        self.fire("change", this.value)
      });
    }
}

ParamSelector.prototype.runSelector = function() {
}

mixin(EventMixin, ParamSelector)
