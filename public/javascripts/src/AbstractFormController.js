(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.AbstractFormController = (function(_super) {
    __extends(AbstractFormController, _super);

    function AbstractFormController() {
      this.handleModelChange = __bind(this.handleModelChange, this);
      this.clearValidationErrorStyles = __bind(this.clearValidationErrorStyles, this);
      this.validationError = __bind(this.validationError, this);      _ref = AbstractFormController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AbstractFormController.prototype.show = function() {
      return $(this.el).show();
    };

    AbstractFormController.prototype.hide = function() {
      return $(this.el).hide();
    };

    AbstractFormController.prototype.cancel = function() {
      this.clearValidationErrorStyles();
      return this.hide();
    };

    AbstractFormController.prototype.setModel = function(model) {
      this.model = model;
      this.setBindings();
      return this.render();
    };

    AbstractFormController.prototype.setBindings = function() {
      this.model.on('invalid', this.validationError);
      return this.model.on('change', this.handleModelChange);
    };

    AbstractFormController.prototype.validationError = function() {
      var errors,
        _this = this;

      errors = this.model.validationError;
      this.clearValidationErrorStyles();
      _.each(errors, function(err) {
        _this.$('.bv_group_' + err.attribute).addClass('input_error error');
        return _this.trigger('notifyError', {
          owner: _this.errorOwnerName,
          errorLevel: 'error',
          message: err.message
        });
      });
      return this.trigger('invalid');
    };

    AbstractFormController.prototype.clearValidationErrorStyles = function() {
      var errorElms,
        _this = this;

      errorElms = this.$('.input_error');
      this.trigger('clearErrors', this.errorOwnerName);
      return _.each(errorElms, function(ee) {
        return $(ee).removeClass('input_error error');
      });
    };

    AbstractFormController.prototype.isValid = function() {
      return this.model.isValid();
    };

    AbstractFormController.prototype.handleModelChange = function() {
      this.clearValidationErrorStyles();
      if (this.isValid()) {
        return this.trigger('valid');
      } else {
        return this.trigger('invalid');
      }
    };

    return AbstractFormController;

  })(Backbone.View);

}).call(this);
