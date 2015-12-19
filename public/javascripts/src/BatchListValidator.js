(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.BatchName = (function(superClass) {
    extend(BatchName, superClass);

    function BatchName() {
      return BatchName.__super__.constructor.apply(this, arguments);
    }

    BatchName.prototype.defaults = {
      requestName: "",
      preferredName: "",
      comment: ""
    };

    BatchName.prototype.getDisplayName = function() {
      if (this.hasValidName()) {
        return this.get("preferredName");
      } else {
        return this.get("requestName");
      }
    };

    BatchName.prototype.hasAlias = function() {
      if (this.get("preferredName") === "") {
        return false;
      } else {
        return this.get("requestName") !== this.get("preferredName");
      }
    };

    BatchName.prototype.hasValidName = function() {
      return this.get("preferredName") !== "";
    };

    BatchName.prototype.hasValidComment = function() {
      return this.get("comment") !== "";
    };

    BatchName.prototype.isSame = function(other) {
      if (this.get("preferredName") !== "" && this.get("preferredName") === other.get("preferredName")) {
        return true;
      }
      if (this.get("preferredName") === "" && other.get("preferredName") === "" && this.get("requestName") === other.get("requestName")) {
        return true;
      }
      return false;
    };

    BatchName.prototype.clear = function() {
      return this.destroy();
    };

    BatchName.prototype.validate = function(attrs) {
      var errors;
      errors = [];
      if (attrs.preferredName === "" || attrs.comment === "") {
        errors.push({
          attribute: 'preferredName',
          message: "Batch name must be valid"
        });
      }
      if (errors.length > 0) {
        return errors;
      } else {
        return null;
      }
    };

    return BatchName;

  })(Backbone.Model);

  window.BatchNameList = (function(superClass) {
    extend(BatchNameList, superClass);

    function BatchNameList() {
      this.isValid = bind(this.isValid, this);
      return BatchNameList.__super__.constructor.apply(this, arguments);
    }

    BatchNameList.prototype.model = BatchName;

    BatchNameList.prototype.getValidBatchNames = function() {
      return this.filter(function(nm) {
        return nm.isValid();
      });
    };

    BatchNameList.prototype.add = function(model, options) {
      var isDupe;
      if (model instanceof Array) {
        return _.each(model, (function(_this) {
          return function(mdl) {
            return _this.add(mdl, options);
          };
        })(this));
      } else {
        isDupe = this.any(function(tmod) {
          return tmod.isSame(new BatchName(model));
        });
        if (isDupe) {
          return false;
        }
        return Backbone.Collection.prototype.add.call(this, model);
      }
    };

    BatchNameList.prototype.isValid = function() {
      if ((this.getValidBatchNames().length === this.length) && (this.length !== 0)) {
        return true;
      } else {
        return false;
      }
    };

    return BatchNameList;

  })(Backbone.Collection);

  window.BatchNameController = (function(superClass) {
    extend(BatchNameController, superClass);

    function BatchNameController() {
      this.render = bind(this.render, this);
      return BatchNameController.__super__.constructor.apply(this, arguments);
    }

    BatchNameController.prototype.template = _.template($("#BatchNameView").html());

    BatchNameController.prototype.tagName = "tr";

    BatchNameController.prototype.className = "batchNameView control-group";

    BatchNameController.prototype.events = {
      "click .bv_removeBatch": "clear",
      "change .bv_comment": "updateComment"
    };

    BatchNameController.prototype.initialize = function() {
      this.model.on("change", this.render, this);
      return this.model.on("destroy", this.remove, this);
    };

    BatchNameController.prototype.render = function() {
      $(this.el).html(this.template());
      this.$(".bv_preferredName").html(this.model.getDisplayName());
      this.$(".bv_comment").val(this.model.get("comment"));
      if (!this.model.hasValidName()) {
        this.$('.bv_preferredName').addClass("error");
      }
      if (this.model.hasAlias() && this.model.hasValidName()) {
        this.$('.bv_preferredName').addClass("warning");
      }
      if (!this.model.hasValidComment()) {
        this.$('.bv_comment').addClass("error");
      } else {
        this.$('.bv_comment').removeClass("error");
      }
      return this;
    };

    BatchNameController.prototype.updateComment = function() {
      return this.model.set({
        comment: $.trim(this.$('.bv_comment').val())
      });
    };

    BatchNameController.prototype.clear = function() {
      return this.model.clear();
    };

    return BatchNameController;

  })(Backbone.View);

  window.BatchNameListController = (function(superClass) {
    extend(BatchNameListController, superClass);

    function BatchNameListController() {
      this.add = bind(this.add, this);
      return BatchNameListController.__super__.constructor.apply(this, arguments);
    }

    BatchNameListController.prototype.initialize = function() {
      return this.collection.bind("add", this.add, this);
    };

    BatchNameListController.prototype.render = function() {
      $(this.el).empty();
      this.collection.each((function(_this) {
        return function(bName) {
          return $(_this.el).append(new BatchNameController({
            model: bName
          }).render().el);
        };
      })(this));
      return this;
    };

    BatchNameListController.prototype.add = function() {
      return this.render();
    };

    return BatchNameListController;

  })(Backbone.View);

  window.BatchListValidatorController = (function(superClass) {
    extend(BatchListValidatorController, superClass);

    function BatchListValidatorController() {
      this.isValid = bind(this.isValid, this);
      this.updateValidCount = bind(this.updateValidCount, this);
      this.itemRemoved = bind(this.itemRemoved, this);
      this.itemChanged = bind(this.itemChanged, this);
      return BatchListValidatorController.__super__.constructor.apply(this, arguments);
    }

    BatchListValidatorController.prototype.template = _.template($("#BatchListValidatorView").html());

    BatchListValidatorController.prototype.events = {
      "click .bv_addButton": "checkAndAddBatches"
    };

    BatchListValidatorController.prototype.initialize = function() {
      $(this.el).html(this.template());
      _.bindAll(this, "ischeckAndAddBatchesComplete", "getPreferredIdReturn");
      this.batchNameListController = new BatchNameListController({
        collection: this.collection,
        el: this.$(".batchList")
      });
      this.collection.on("remove", this.itemRemoved);
      this.collection.on("change", this.itemChanged);
      this.currentReqArray = null;
      return this.updateValidCount();
    };

    BatchListValidatorController.prototype.render = function() {
      if (window.DocForBatchesConfiguration.lotCalledBatch) {
        this.$('.bv_batchHeader').html("Batch");
      } else {
        this.$('.bv_batchHeader').html("Lot");
      }
      this.batchNameListController.render();
      return this;
    };

    BatchListValidatorController.prototype.checkAndAddBatches = function() {
      this.currentReqArray = this.getCleanRequestedBatchList();
      if (this.currentReqArray.length !== 0) {
        this.trigger('amDirty');
        this.$(".bv_addButton").attr("disabled", true);
        return $.ajax({
          type: "POST",
          url: window.conf.service.preferred.batchid.path,
          data: {
            requests: this.currentReqArray,
            testMode: window.AppLaunchParams.testMode
          },
          success: this.getPreferredIdReturn,
          error: function(error) {
            return alert("can't talk to provide id server");
          }
        });
      }
    };

    BatchListValidatorController.prototype.getPreferredIdReturn = function(data) {
      var i, results;
      if (data.error) {
        alert("Preferred Batch ID service had this error: " + JSON.stringify(data.errorMessages));
        this.$(".bv_addButton").removeAttr("disabled");
        return;
      }
      results = data.results;
      if (this.currentReqArray.length !== results.length) {
        alert("problem where batch alias service did not return correct number of results");
        this.$(".bv_addButton").removeAttr("disabled");
        return;
      }
      i = 0;
      _.each(data.results, (function(_this) {
        return function(result) {
          return _this.batchNameListController.collection.add(result);
        };
      })(this));
      this.currentReqArray = null;
      this.updateValidCount();
      this.$(".bv_pasteListArea").val("");
      return this.$(".bv_addButton").removeAttr("disabled");
    };

    BatchListValidatorController.prototype.getCleanRequestedBatchList = function() {
      var cleanArray, reqArray, treq;
      cleanArray = new Array();
      if ($.trim(this.$(".bv_pasteListArea").val()) !== "") {
        reqArray = this.$(".bv_pasteListArea").val().split("\n");
        treq = void 0;
        _.each(reqArray, function(bns) {
          treq = $.trim(bns);
          if (treq !== "") {
            return cleanArray.push({
              requestName: treq
            });
          }
        });
      }
      return cleanArray;
    };

    BatchListValidatorController.prototype.ischeckAndAddBatchesComplete = function() {
      if (this.currentReqArray == null) {
        return true;
      } else {
        return false;
      }
    };

    BatchListValidatorController.prototype.itemChanged = function() {
      this.trigger('amDirty');
      return this.updateValidCount();
    };

    BatchListValidatorController.prototype.itemRemoved = function() {
      return this.updateValidCount();
    };

    BatchListValidatorController.prototype.updateValidCount = function(silent) {
      if (silent == null) {
        silent = false;
      }
      this.numValidBatches = this.batchNameListController.collection.getValidBatchNames().length;
      this.$(".validBatchCount").html(this.numValidBatches);
      if (this.isValid()) {
        return this.trigger("valid");
      } else {
        return this.trigger("invalid");
      }
    };

    BatchListValidatorController.prototype.isValid = function() {
      return this.collection.isValid();
    };

    return BatchListValidatorController;

  })(Backbone.View);

}).call(this);