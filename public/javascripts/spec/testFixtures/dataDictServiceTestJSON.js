(function() {
  (function(exports) {
    return exports.dataDictValues = {
      "well flags": [
        {
          code: "outlier",
          name: "Outlier",
          ignored: false
        }, {
          code: "high",
          name: "Value too high",
          ignored: true
        }, {
          code: "low",
          name: "Value to low",
          ignored: true
        }, {
          code: "crashout",
          name: "Compound crashed out",
          ignored: false
        }
      ]
    };
  })((typeof process === "undefined" || !process.versions ? window.dataDictServiceTestJSON = window.dataDictServiceTestJSON || {} : exports));

}).call(this);
