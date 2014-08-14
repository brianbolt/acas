(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.GenericDataParserController = (function(_super) {
    __extends(GenericDataParserController, _super);

    function GenericDataParserController() {
      return GenericDataParserController.__super__.constructor.apply(this, arguments);
    }

    GenericDataParserController.prototype.initialize = function() {
      this.fileProcessorURL = "/api/genericDataParser";
      this.errorOwnerName = 'GenericDataParser';
      GenericDataParserController.__super__.initialize.call(this);
      return this.$('.bv_moduleTitle').html('Simple Experiment Loader');
    };

    return GenericDataParserController;

  })(BasicFileValidateAndSaveController);

}).call(this);
