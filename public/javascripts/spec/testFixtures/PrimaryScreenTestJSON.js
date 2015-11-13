(function() {
  (function(exports) {
    exports.primaryAnalysisReads = [
      {
        readNumber: 1,
        readPosition: 11,
        readName: "none",
        activity: true
      }, {
        readNumber: 2,
        readPosition: 12,
        readName: "fluorescence",
        activity: false
      }, {
        readNumber: 3,
        readPosition: 13,
        readName: "luminescence",
        activity: false
      }
    ];
    exports.transformationRules = [
      {
        transformationRule: "% efficacy"
      }, {
        transformationRule: "sd"
      }, {
        transformationRule: "null"
      }
    ];
    return exports.primaryScreenAnalysisParameters = {
      positiveControl: {
        batchCode: "CMPD-12345678-01",
        concentration: 10,
        concentrationUnits: "uM"
      },
      negativeControl: {
        batchCode: "CMPD-87654321-01",
        concentration: 1,
        concentrationUnits: "uM"
      },
      agonistControl: {
        batchCode: "CMPD-87654399-01",
        concentration: 250753.77,
        concentrationUnits: "uM"
      },
      vehicleControl: {
        batchCode: "CMPD-00000001-01",
        concentration: null,
        concentrationUnits: null
      },
      instrumentReader: "flipr",
      signalDirectionRule: "increasing",
      aggregateBy: "compound batch concentration",
      aggregationMethod: "median",
      normalizationRule: "plate order only",
      hitEfficacyThreshold: 42,
      hitSDThreshold: 5.0,
      thresholdType: "sd",
      transferVolume: 12,
      dilutionFactor: 21,
      volumeType: "dilution",
      assayVolume: 24,
      autoHitSelection: false,
      htsFormat: false,
      matchReadName: false,
      primaryAnalysisReadList: exports.primaryAnalysisReads,
      transformationRuleList: exports.transformationRules
    };
  })((typeof process === "undefined" || !process.versions ? window.primaryScreenTestJSON = window.primaryScreenTestJSON || {} : exports));

}).call(this);