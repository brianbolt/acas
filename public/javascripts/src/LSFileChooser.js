(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.LSFileChooserModel = (function(superClass) {
    extend(LSFileChooserModel, superClass);

    function LSFileChooserModel() {
      return LSFileChooserModel.__super__.constructor.apply(this, arguments);
    }

    LSFileChooserModel.prototype.defaults = {
      fileName: '',
      fileNameOnServer: '',
      fileType: ''
    };

    LSFileChooserModel.prototype.initialize = function() {
      return _.bindAll(this, 'isDirty');
    };

    LSFileChooserModel.prototype.isDirty = function() {
      return this.get('fileNameOnServer') === '';
    };

    return LSFileChooserModel;

  })(Backbone.Model);

  window.LSFileModelCollection = (function(superClass) {
    extend(LSFileModelCollection, superClass);

    function LSFileModelCollection() {
      return LSFileModelCollection.__super__.constructor.apply(this, arguments);
    }

    LSFileModelCollection.prototype.model = LSFileChooserModel;

    return LSFileModelCollection;

  })(Backbone.Collection);

  window.LSFileChooserController = (function(superClass) {
    extend(LSFileChooserController, superClass);

    function LSFileChooserController() {
      return LSFileChooserController.__super__.constructor.apply(this, arguments);
    }

    LSFileChooserController.prototype.allowedFileTypes = ['xls', 'rtf', 'pdf', 'txt', 'csv', 'sdf', 'xlsx', 'doc', 'docx', 'png', 'gif', 'jpg', 'ppt', 'pptx', 'pzf'];

    LSFileChooserController.prototype.dropZoneClassId = "fileupload";

    LSFileChooserController.prototype.allowMultipleFiles = false;

    LSFileChooserController.prototype.maxNumberOfFiles = 3;

    LSFileChooserController.prototype.autoUpload = true;

    LSFileChooserController.prototype.maxFileSize = 200000000;

    LSFileChooserController.prototype.listOfFileModels = [];

    LSFileChooserController.prototype.currentNumberOfFiles = 0;

    LSFileChooserController.prototype.requiresValidation = true;

    LSFileChooserController.prototype.hideDelete = false;

    LSFileChooserController.prototype.initialize = function() {
      var self;
      _.bindAll(this, 'render', 'handleDragOverDocument', 'handleDragLeaveDocument', 'handleDeleteFileUIChanges', 'handleFileAddedEvent', 'fileUploadComplete', 'fileUploadFailed', 'canAcceptAnotherFile', 'filePassedServerValidation');
      self = this;
      $(document).bind('dragover', function(e) {
        return self.handleDragOverDocument();
      });
      $(document).bind('drop dragleave', function(e) {
        return self.handleDragLeaveDocument();
      });
      if (this.options.allowedFileTypes != null) {
        this.allowedFileTypes = this.options.allowedFileTypes;
      }
      if (this.options.defaultMessage != null) {
        this.defaultMessage = this.options.defaultMessage;
      }
      if (this.options.dragOverMessage != null) {
        this.dragOverMessage = this.options.dragOverMessage;
      }
      if (this.options.dropZoneClassId != null) {
        this.dropZoneClassId = this.options.dropZoneClassId;
      }
      if (this.options.allowMultipleFiles != null) {
        this.allowMultipleFiles = this.options.allowMultipleFiles;
      }
      if (this.options.maxNumberOfFiles != null) {
        this.maxNumberOfFiles = this.options.maxNumberOfFiles;
      }
      if (this.options.url != null) {
        this.url = this.options.url;
      }
      if (this.options.autoUpload != null) {
        this.autoUpload = this.options.autoUpload;
      }
      if (this.options.maxFileSize != null) {
        this.maxFileSize = this.options.maxFileSize;
      }
      if (this.options.requiresValidation != null) {
        this.requiresValidation = this.options.requiresValidation;
      }
      if (this.options.hideDelete != null) {
        this.hideDelete = this.options.hideDelete;
      }
      return this.currentNumberOfFiles = 0;
    };

    LSFileChooserController.prototype.events = {
      'click .bv_deleteFile': 'handleFileValueChanged',
      'click .bv_cancelFile': 'handleDeleteFileUIChanges'
    };

    LSFileChooserController.prototype.canAcceptAnotherFile = function() {
      return this.currentNumberOfFiles < this.maxNumberOfFiles;
    };

    LSFileChooserController.prototype.handleDragOverDocument = function() {
      if (this.canAcceptAnotherFile()) {
        this.$('.bv_manualFileSelect').hide();
        return this.$('.' + this.options.dropZoneClassId).show();
      }
    };

    LSFileChooserController.prototype.handleDragLeaveDocument = function() {
      if (!this.mouseIsInDropField) {
        if (this.canAcceptAnotherFile()) {
          this.$('.' + this.options.dropZoneClassId).hide();
          return this.$('.bv_manualFileSelect').show();
        }
      }
    };

    LSFileChooserController.prototype.handleFileValueChanged = function() {
      return this.trigger('fileDeleted');
    };

    LSFileChooserController.prototype.handleDeleteFileUIChanges = function() {
      this.$('.bv_manualFileSelect').show("slide");
      this.currentNumberOfFiles--;
      return this.trigger('fileUploader:removedFile');
    };

    LSFileChooserController.prototype.handleFileAddedEvent = function(e, data) {
      this.currentNumberOfFiles++;
      if (!this.canAcceptAnotherFile()) {
        return this.$('.bv_manualFileSelect').hide("slide");
      }
    };

    LSFileChooserController.prototype.fileUploadComplete = function(e, data) {
      var self;
      self = this;
      if (!this.options.hideDelete) {
        this.$('.delete').show();
      }
      _.each(data.result, function(result) {
        return self.listOfFileModels.push(new LSFileChooserModel({
          fileNameOnServer: result.name
        }));
      });
      this.trigger('fileUploader:uploadComplete', data.result[0].name);
      if (this.requiresValidation) {
        this.$('.dv_validatingProgressBar').show("slide");
      }
      return this.delegateEvents();
    };

    LSFileChooserController.prototype.fileUploadFailed = function(e, data) {
      this.trigger('fileUploader:uploadFailed');
      return window.notificationController.addError("file upload failed!");
    };

    LSFileChooserController.prototype.filePassedServerValidation = function() {
      this.$('.bv_status').addClass('icon-ok-sign');
      return this.$('.dv_validatingProgressBar').hide("slide");
    };

    LSFileChooserController.prototype.fileFailedServerValidation = function() {
      this.$('.bv_status').addClass('icon-exclamation-sign');
      return this.$('.dv_validatingProgressBar').hide("slide");
    };

    LSFileChooserController.prototype.render = function() {
      var self, template;
      self = this;
      $(this.el).html("");
      template = _.template($("#LSFileChooserView").html(), {
        uploadUrl: this.uploadUrl,
        paramname: this.paramname,
        dragOverMessage: this.dragOverMessage,
        dropZoneClassId: this.dropZoneClassId,
        allowMultipleFiles: this.allowMultipleFiles
      });
      $(this.el).html(template);
      this.$('.bv_fileDropField').html(this.defaultMessage);
      this.$('.fileupload').fileupload();
      this.$('.fileupload').fileupload('option', {
        url: self.url,
        maxFileSize: self.maxFileSize,
        acceptFileTypes: RegExp('(\\.|\\/)(' + this.allowedFileTypes.join('|') + ')$', 'i'),
        autoUpload: self.autoUpload,
        dropZone: this.$('.' + self.dropZoneClassId)
      });
      this.$('.' + this.dropZoneClassId).bind('mouseover', function(e) {
        return this.mouseIsInDropField = true;
      });
      this.$('.' + this.dropZoneClassId).bind('mouseout', function(e) {
        return this.mouseIsInDropField = false;
      });
      this.$('.' + this.dropZoneClassId).bind('dragover', function(e) {
        return self.handleDragOverDocument();
      });
      this.$('.' + this.dropZoneClassId).bind('dragleave', function(e) {
        return self.handleDragLeaveDocument();
      });
      this.$('.fileupload').bind('fileuploaddrop', this.handleDragLeaveDocument);
      this.$('.fileupload').bind('fileuploadadd', this.handleFileAddedEvent);
      this.$('.fileupload').bind('fileuploadcompleted', this.fileUploadComplete);
      this.$('.fileupload').bind('fileUploadFailed', this.fileUploadComplete);
      return this.$('.fileupload').bind('fileuploaddestroyed', this.handleDeleteFileUIChanges);
    };

    return LSFileChooserController;

  })(Backbone.View);

}).call(this);