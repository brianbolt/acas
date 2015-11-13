(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.DocForBatches = (function(superClass) {
    extend(DocForBatches, superClass);

    function DocForBatches() {
      return DocForBatches.__super__.constructor.apply(this, arguments);
    }

    DocForBatches.prototype.protocol = null;

    DocForBatches.prototype.experiment = null;

    DocForBatches.prototype.initialize = function() {
      var js;
      if (this.has('json')) {
        js = this.get('json');
        return this.set({
          id: js.id,
          docUpload: new DocUpload(js.docUpload),
          batchNameList: new BatchNameList(js.batchNameList)
        });
      } else if (this.has('experiment')) {
        return this.updateDocForBatches();
      } else {
        this._fetchStubProtocol();
        if (!this.has('docUpload')) {
          this.set({
            docUpload: new DocUpload()
          });
        }
        if (!this.has('batchNameList')) {
          return this.set({
            batchNameList: new BatchNameList()
          });
        }
      }
    };

    DocForBatches.prototype.validate = function(attrs) {
      var errors;
      errors = [];
      if (!attrs.docUpload.isValid()) {
        errors.push({
          attribute: 'docUpload',
          message: "Document portion of form is not valid"
        });
      }
      if (!attrs.batchNameList.isValid()) {
        errors.push({
          attribute: 'batchNameList',
          message: "Batch list portion of form is not valid"
        });
      }
      if (errors.length > 0) {
        return errors;
      } else {
        return null;
      }
    };

    DocForBatches.prototype._fetchStubProtocol = function() {
      var docForBatchesProtocolCode;
      docForBatchesProtocolCode = "ACASdocForBatches";
      return $.ajax({
        type: 'GET',
        url: "api/protocols/codename/" + docForBatchesProtocolCode,
        success: (function(_this) {
          return function(json) {
            if (json.length === 0) {
              return alert("Could not find required protocol with code: " + docForBatchesProtocolCode + ". Please seek help from an administrator");
            } else {
              return _this.protocol = new Protocol(json);
            }
          };
        })(this),
        error: function(err) {
          return alert('got ajax error from api/protocols/codename/ in DocForBatches.coffee');
        },
        dataType: 'json'
      });
    };

    DocForBatches.prototype.asExperiment = function() {
      var analysisGroup, analysisGroupState, analysisGroups, eName, exp, lsStates, lsValues, recBy, recDate, stateValue_1, stateValue_2;
      if (!this.isValid()) {
        return null;
      }
      recBy = window.AppLaunchParams.loginUserName;
      recDate = new Date().getTime();
      analysisGroup = new AnalysisGroup();
      analysisGroups = new AnalysisGroupList(analysisGroup);
      if (this.get('docUpload').get('docType') === "file") {
        eName = this.get('docUpload').get('currentFileName');
        stateValue_1 = new Value({
          lsType: 'fileValue',
          lsKind: 'annotation',
          value: eName,
          ignored: false
        });
      } else {
        eName = this.get('docUpload').get('url');
        stateValue_1 = new Value({
          lsType: 'urlValue',
          lsKind: 'annotation',
          value: eName,
          ignored: false
        });
      }
      stateValue_2 = new Value({
        lsType: 'stringValue',
        lsKind: 'document kind',
        value: this.get('docUpload').get('documentKind'),
        ignored: false
      });
      lsValues = new ValueList();
      lsValues.add(stateValue_1);
      lsValues.add(stateValue_2);
      this.get('batchNameList').each(function(batchName) {
        var stateValue;
        stateValue = new Value({
          lsType: 'codeValue',
          lsKind: 'batch code',
          comments: batchName.get('comment'),
          value: batchName.get('preferredName'),
          ignored: false
        });
        return lsValues.add(stateValue);
      });
      analysisGroupState = new State({
        lsValues: lsValues,
        lsKind: 'Document for Batch',
        lsType: 'results',
        recordedBy: this.protocol.get('recordedBy')
      });
      lsStates = new StateList();
      lsStates.add(analysisGroupState);
      analysisGroup = new AnalysisGroup({
        lsStates: lsStates
      });
      analysisGroups = new AnalysisGroupList(analysisGroup);
      exp = new Experiment({
        protocol: this.protocol,
        kind: "ACAS doc for batches",
        recordedBy: recBy,
        recordedDate: recDate,
        shortDescription: this.get('docUpload').get('description'),
        analysisGroups: analysisGroups
      });
      exp.get('lsLabels').setBestName(new Label({
        lsKind: "experiment name",
        labelText: eName,
        recordedBy: recBy,
        recordedDate: recDate
      }));
      return exp;
    };

    DocForBatches.prototype.updateDocForBatches = function() {
      var newBatchNameList, newDocUpload;
      newDocUpload = new DocUpload({
        id: 1
      });
      newBatchNameList = new BatchNameList();
      this.get('experiment').get('analysisGroups').at(0).get('lsStates').each(function(analysisGroupState) {
        return analysisGroupState.get('lsValues').each(function(analysisGroupValue) {
          var lsType, newBatchName, value;
          lsType = analysisGroupValue.get('lsType');
          value = analysisGroupValue.get(lsType);
          switch (lsType) {
            case "fileValue":
              if (value !== null) {
                return newDocUpload.set({
                  id: analysisGroupValue.get('id'),
                  currentFileName: value,
                  docType: "file"
                });
              }
              break;
            case "urlValue":
              if (value !== null) {
                return newDocUpload.set({
                  id: analysisGroupValue.get('id'),
                  url: value,
                  docType: "url"
                });
              }
              break;
            case "stringValue":
              if (value !== null) {
                return newDocUpload.set({
                  documentKind: value
                });
              }
              break;
            case "codeValue":
              if (value !== null) {
                newBatchName = new BatchName({
                  id: analysisGroupValue.id,
                  preferredName: value,
                  comment: analysisGroupValue.get('comments')
                });
                return newBatchNameList.add(newBatchName);
              }
          }
        });
      });
      this.set({
        batchNameList: newBatchNameList,
        docUpload: newDocUpload
      });
      return this;
    };

    return DocForBatches;

  })(Backbone.Model);

  window.DocForBatchesController = (function(superClass) {
    extend(DocForBatchesController, superClass);

    function DocForBatchesController() {
      this.resetForm = bind(this.resetForm, this);
      this.save = bind(this.save, this);
      this.subFormIsInvalid = bind(this.subFormIsInvalid, this);
      this.subFormIsValid = bind(this.subFormIsValid, this);
      this.render = bind(this.render, this);
      return DocForBatchesController.__super__.constructor.apply(this, arguments);
    }

    DocForBatchesController.prototype.template = _.template($("#DocForBatchesView").html());

    DocForBatchesController.prototype.events = {
      "click .bv_saveButton": "save",
      "click .bv_cancelButton": "resetForm"
    };

    DocForBatchesController.prototype.initialize = function() {
      $(this.el).html(this.template());
      if (this.model == null) {
        this.model = new DocForBatches();
      }
      return this.setupSubControllers();
    };

    DocForBatchesController.prototype.setupSubControllers = function() {
      this.docUploadController = new DocUploadController({
        model: this.model.get('docUpload'),
        el: this.$('.bv_docUpload')
      });
      this.docUploadController.on("invalid", this.subFormIsInvalid);
      this.docUploadController.on("valid", this.subFormIsValid);
      this.docUploadController.on('amDirty', (function(_this) {
        return function() {
          return _this.trigger('amDirty');
        };
      })(this));
      this.batchListValidator = new BatchListValidatorController({
        el: this.$(".bv_batchListValidator"),
        collection: this.model.get('batchNameList')
      });
      this.batchListValidator.on("invalid", this.subFormIsInvalid);
      this.batchListValidator.on("valid", this.subFormIsValid);
      this.batchListValidator.on('amDirty', (function(_this) {
        return function() {
          return _this.trigger('amDirty');
        };
      })(this));
      return this.subFormIsInvalid();
    };

    DocForBatchesController.prototype.render = function() {
      this.batchListValidator.render();
      this.docUploadController.render();
      if (this.model.isNew()) {
        this.$('.bv_title').html("New Document Annotations");
        this.$(".bv_deleteButton").hide();
        this.$(".bv_saveButton").html("Save");
      } else {
        this.$('.bv_title').html("Edit Document Annotations");
        this.$(".bv_deleteButton").show();
        this.$(".bv_saveButton").html("Update");
      }
      return this;
    };

    DocForBatchesController.prototype.subFormIsValid = function() {
      this.trigger('amDirty');
      if (this.model.isValid()) {
        return this.$(".bv_saveButton").removeAttr('disabled');
      }
    };

    DocForBatchesController.prototype.subFormIsInvalid = function() {
      return this.$(".bv_saveButton").attr('disabled', 'disabled');
    };

    DocForBatchesController.prototype.save = function() {
      if (this.model.isValid()) {
        return $.ajax({
          type: 'POST',
          url: "/api/docForBatches",
          data: {
            docForBatches: JSON.stringify(this.model),
            user: window.AppLaunchParams.loginUserName
          },
          success: (function(_this) {
            return function(response) {
              _this.model.set({
                id: response.results.id
              });
              _this.trigger('amClean');
              return _this.render();
            };
          })(this),
          error: (function(_this) {
            return function(err) {
              return _this.serviceReturn = null;
            };
          })(this),
          dataType: 'json'
        });
      }
    };

    DocForBatchesController.prototype.resetForm = function() {
      $(this.el).empty();
      $(this.el).html(this.template());
      this.model = new DocForBatches();
      this.setupSubControllers();
      return this.render();
    };

    return DocForBatchesController;

  })(Backbone.View);

}).call(this);