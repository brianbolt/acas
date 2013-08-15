(function() {
  var _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.DocForBatches = (function(_super) {
    __extends(DocForBatches, _super);

    function DocForBatches() {
      _ref = DocForBatches.__super__.constructor.apply(this, arguments);
      return _ref;
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
      var docForBatchesProtocolCode,
        _this = this;
      docForBatchesProtocolCode = "ACASdocForBatches";
      return $.ajax({
        type: 'GET',
        url: "api/protocols/codename/" + docForBatchesProtocolCode,
        success: function(json) {
          if (json.length === 0) {
            return alert("Could not find required protocol with code: " + docForBatchesProtocolCode + ". Please seek help from an administrator");
          } else {
            return _this.protocol = new Protocol(json[0]);
          }
        },
        error: function(err) {
          return alert('got ajax error from api/protocols/codename/ in DocForBatches.coffee');
        },
        dataType: 'json'
      });
    };

    DocForBatches.prototype.asExperiment = function() {
      var analysisGroup, analysisGroupState, analysisGroupStates, analysisGroups, eName, exp, recBy, recDate, stateValue_1, stateValue_2, stateValues;
      if (!this.isValid()) {
        return null;
      }
      recBy = window.AppLaunchParams.loginUserName;
      recDate = new Date().getTime();
      analysisGroup = new AnalysisGroup();
      analysisGroups = new AnalysisGroupList(analysisGroup);
      if (this.get('docUpload').get('docType') === "file") {
        eName = this.get('docUpload').get('currentFileName');
        stateValue_1 = new AnalysisGroupValue({
          valueType: 'fileValue',
          valueKind: 'annotation',
          value: eName,
          ignored: false
        });
      } else {
        eName = this.get('docUpload').get('url');
        stateValue_1 = new AnalysisGroupValue({
          valueType: 'urlValue',
          valueKind: 'annotation',
          value: eName,
          ignored: false
        });
      }
      stateValue_2 = new AnalysisGroupValue({
        valueType: 'stringValue',
        valueKind: 'document kind',
        value: this.get('docUpload').get('documentKind'),
        ignored: false
      });
      stateValues = new AnalysisGroupValueList();
      stateValues.add(stateValue_1);
      stateValues.add(stateValue_2);
      this.get('batchNameList').each(function(batchName) {
        var stateValue;
        stateValue = new AnalysisGroupValue({
          valueType: 'codeValue',
          valueKind: 'batch code',
          comments: batchName.get('comment'),
          value: batchName.get('preferredName'),
          ignored: false
        });
        return stateValues.add(stateValue);
      });
      analysisGroupState = new AnalysisGroupState({
        analysisGroupValues: stateValues,
        stateKind: 'Document for Batch',
        stateType: 'results',
        recordedBy: this.protocol.get('recordedBy')
      });
      analysisGroupStates = new AnalysisGroupStateList();
      analysisGroupStates.add(analysisGroupState);
      analysisGroup = new AnalysisGroup({
        analysisGroupStates: analysisGroupStates
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
        labelKind: "experiment name",
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
      this.get('experiment').get('analysisGroups').at(0).get('analysisGroupStates').each(function(analysisGroupState) {
        return analysisGroupState.get('analysisGroupValues').each(function(analysisGroupValue) {
          var newBatchName, value, valueType;
          valueType = analysisGroupValue.get('valueType');
          value = analysisGroupValue.get(valueType);
          switch (valueType) {
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

  window.DocForBatchesController = (function(_super) {
    __extends(DocForBatchesController, _super);

    function DocForBatchesController() {
      this.resetForm = __bind(this.resetForm, this);
      this.save = __bind(this.save, this);
      this.subFormIsInvalid = __bind(this.subFormIsInvalid, this);
      this.subFormIsValid = __bind(this.subFormIsValid, this);
      this.render = __bind(this.render, this);
      _ref1 = DocForBatchesController.__super__.constructor.apply(this, arguments);
      return _ref1;
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
      var _this = this;
      this.docUploadController = new DocUploadController({
        model: this.model.get('docUpload'),
        el: this.$('.bv_docUpload')
      });
      this.docUploadController.on("invalid", this.subFormIsInvalid);
      this.docUploadController.on("valid", this.subFormIsValid);
      this.docUploadController.on('amDirty', function() {
        return _this.trigger('amDirty');
      });
      this.batchListValidator = new BatchListValidatorController({
        el: this.$(".bv_batchListValidator"),
        collection: this.model.get('batchNameList')
      });
      this.batchListValidator.on("invalid", this.subFormIsInvalid);
      this.batchListValidator.on("valid", this.subFormIsValid);
      this.batchListValidator.on('amDirty', function() {
        return _this.trigger('amDirty');
      });
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
      var _this = this;
      if (this.model.isValid()) {
        return $.ajax({
          type: 'POST',
          url: "/api/docForBatches",
          data: {
            docForBatches: JSON.stringify(this.model),
            user: window.AppLaunchParams.loginUserName
          },
          success: function(response) {
            _this.model.set({
              id: response.results.id
            });
            _this.trigger('amClean');
            return _this.render();
          },
          error: function(err) {
            return _this.serviceReturn = null;
          },
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
