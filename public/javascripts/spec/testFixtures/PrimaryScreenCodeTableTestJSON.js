(function() {
  (function(exports) {
    return exports.codetableValues = [
      {
        type: "equipment",
        kind: "instrument reader",
        codes: [
          {
            code: "flipr",
            name: "FLIPR",
            ignored: false
          }
        ]
      }, {
        type: "analysis parameter",
        kind: "signal direction",
        codes: [
          {
            code: "increasing",
            name: "Increasing Signal (highest = 100%)",
            ignored: false
          }
        ]
      }, {
        type: "analysis parameter",
        kind: "aggregate by",
        codes: [
          {
            code: "compound batch concentration",
            name: "Compound Batch Concentration",
            ignored: false
          }
        ]
      }, {
        type: "analysis parameter",
        kind: "aggregation method",
        codes: [
          {
            code: "median",
            name: "Median",
            ignored: false
          }, {
            code: "mean",
            name: "Mean",
            ignored: false
          }
        ]
      }, {
        type: "analysis parameter",
        kind: "transformation",
        codes: [
          {
            code: "% efficacy",
            name: "% Efficacy",
            ignored: false
          }, {
            code: "sd",
            name: "SD",
            ignored: false
          }, {
            code: "null",
            name: "Not Set",
            ignored: false
          }
        ]
      }, {
        type: "analysis parameter",
        kind: "normalization",
        codes: [
          {
            code: "plate order only",
            name: "Plate Order Only",
            ignored: false
          }, {
            code: "plate order and row",
            name: "Plate Order And Row",
            ignored: false
          }, {
            code: "plate order and tip",
            name: "Plate Order And Tip",
            ignored: false
          }, {
            code: "none",
            name: "None",
            ignored: false
          }
        ]
      }, {
        type: "reader data",
        kind: "read name",
        codes: [
          {
            code: "luminescence",
            name: "Luminescence",
            ignored: false
          }, {
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
