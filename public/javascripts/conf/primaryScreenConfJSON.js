(function() {
  (function(exports) {
    return exports.typeKindList = {
      valuetypes: [
        {
          typeName: "dateValue"
        }, {
          typeName: "codeValue"
        }, {
          typeName: "stringValue"
        }, {
          typeName: "clobValue"
        }, {
          typeName: "fileValue"
        }, {
          typeName: "urlValue"
        }, {
          typeName: "blobValue"
        }, {
          typeName: "inlineFileValue"
        }, {
          typeName: "numericValue"
        }
      ],
      valuekinds: [
        {
          kindName: "efficacy",
          typeName: "numericValue"
        }, {
          kindName: "flag file",
          typeName: "fileValue"
        }
      ],
      codetables: [
        {
          codeType: "preprocess well flags",
          codeKind: "flag observation",
          codeOrigin: "ACAS DDICT",
          code: "sel ko",
          name: "Knocked Out by Simple Experiment Loader",
          ignored: false
        }, {
          codeType: "preprocess well flags",
          codeKind: "flag cause",
          codeOrigin: "ACAS DDICT",
          code: "sel ko",
          name: "Knocked Out by Simple Experiment Loader",
          ignored: false
        }, {
          codeType: "preprocess well flags",
          codeKind: "flag status",
          codeOrigin: "ACAS DDICT",
          code: "knocked out",
          name: "Knocked Out",
          ignored: false
        }
      ]
    };
  })((typeof process === "undefined" || !process.versions ? window.genericDataParserConfJSON = window.genericDataParserConfJSON || {} : exports));

}).call(this);
