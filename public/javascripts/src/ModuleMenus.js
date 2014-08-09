(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.ModuleMenusController = (function(_super) {
    __extends(ModuleMenusController, _super);

    function ModuleMenusController() {
      this.handleHome = __bind(this.handleHome, this);
      this.render = __bind(this.render, this);
      return ModuleMenusController.__super__.constructor.apply(this, arguments);
    }

    ModuleMenusController.prototype.template = _.template($("#ModuleMenusView").html());

    ModuleMenusController.prototype.initialize = function() {
      $(this.el).html(this.template());
      this.moduleLauncherList = new ModuleLauncherList(this.options.menuListJSON);
      this.moduleLauncherMenuListController = new ModuleLauncherMenuListController({
        el: this.$('.bv_modLaunchMenuWrapper'),
        collection: this.moduleLauncherList
      });
      this.moduleLauncherListController = new ModuleLauncherListController({
        el: this.$('.bv_mainModuleWrapper'),
        collection: this.moduleLauncherList
      });
      if (window.conf.require.login) {
        this.$('.bv_loginUserFirstName').html(window.AppLaunchParams.loginUser.firstName);
        this.$('.bv_loginUserLastName').html(window.AppLaunchParams.loginUser.lastName);
      } else {
        this.$('.bv_userInfo').hide();
      }
      if (!window.conf.roologin.showpasswordchange) {
        this.$('.bv_changePassword').hide();
      }
      this.moduleLauncherMenuListController.render();
      this.moduleLauncherListController.render();
      this.$('.bv_summaryStats').load('/dataFiles/summaryStatistics/summaryStatistics.html');
      if (window.AppLaunchParams.moduleLaunchParams != null) {
        return this.moduleLauncherMenuListController.launchModule(window.AppLaunchParams.moduleLaunchParams.moduleName);
      } else {
        return this.$('.bv_homePageWrapper').show();
      }
    };

    ModuleMenusController.prototype.render = function() {
      if (window.AppLaunchParams.deployMode != null) {
        if (window.AppLaunchParams.deployMode.toUpperCase() !== "PROD") {
          this.$('.bv_deployMode h1').html(window.AppLaunchParams.deployMode.toUpperCase());
        }
      }
      return this;
    };

    ModuleMenusController.prototype.events = {
      'click .bv_acasHome': "handleHome"
    };

    ModuleMenusController.prototype.handleHome = function() {
      $('.bv_mainModuleWrapper').hide();
      return $('.bv_homePageWrapper').show();
    };

    return ModuleMenusController;

  })(Backbone.View);

}).call(this);
