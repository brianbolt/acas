(function() {
  (function(exports) {
    return exports.dataDictValues = [
      {
        "instrumentReaderCodes": [
          {
            code: "flipr",
            name: "FLIPR",
            ignored: false
          }
        ]
      }, {
        "signalDirectionCodes": [
          {
            code: "increasing signal (highest = 100%)",
            name: "Increasing Signal (highest = 100%)",
            ignored: false
          }
        ]
      }, {
        "aggregateBy1Codes": [
          {
            code: "compound batch concentration",
            name: "Compound Batch Concentration",
            ignored: false
          }
        ]
      }, {
        "aggregateBy2Codes": [
          {
            code: "median",
            name: "Median",
            ignored: false
          }
        ]
      }, {
        "transformationCodes": [
          {
            code: "(maximum-minimum)/minimum",
            name: "(Max-Min)/Min",
            ignored: false
          }
        ]
      }, {
        "normalizationCodes": [
          {
            code: "plate order",
            name: "Plate Order",
            ignored: false
          }, {
            code: "none",
            name: "None",
            ignored: false
          }
        ]
      }, {
        "readNameCodes": [
          {
            code: "fluorescence",
            name: "Fluorescence",
            ignored: false
          }, {
            code: "none",
            name: "None",
            ignored: false
          }
        ]
      }
    ];
  })((typeof process === "undefined" || !process.versions ? window.primaryScreenCodeTableTestJSON = window.primaryScreenCodeTableTestJSON || {} : exports));

}).call(this);
