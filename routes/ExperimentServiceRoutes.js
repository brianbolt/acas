(function() {
  exports.setupAPIRoutes = function(app) {
    app.get('/api/experiments/codename/:code', exports.experimentByCodename);
    app.get('/api/experiments/protocolCodename/:code', exports.experimentsByProtocolCodename);
    app.get('/api/experiments/:id', exports.experimentById);
    app.post('/api/experiments', exports.postExperiment);
    return app.put('/api/experiments/:id', exports.putExperiment);
  };

  exports.setupRoutes = function(app, loginRoutes) {
    app.get('/api/experiments/codename/:code', loginRoutes.ensureAuthenticated, exports.experimentByCodename);
    app.get('/api/experiments/protocolCodename/:code', loginRoutes.ensureAuthenticated, exports.experimentsByProtocolCodename);
    app.get('/api/experiments/:id', loginRoutes.ensureAuthenticated, exports.experimentById);
    app.post('/api/experiments', loginRoutes.ensureAuthenticated, exports.postExperiment);
    app.put('/api/experiments/:id', loginRoutes.ensureAuthenticated, exports.putExperiment);
    app.get('/api/experiments/genericSearch/:searchTerm', loginRoutes.ensureAuthenticated, exports.genericExperimentSearch);
    app.get('/api/experiments/edit/:experimentCodeName', loginRoutes.ensureAuthenticated, exports.editExperimentLookupAndRedirect);
    app["delete"]('/api/experiments/:id', loginRoutes.ensureAuthenticated, exports.deleteExperiment);
    return app.get('/api/experiments/resultViewerURL/:code', loginRoutes.ensureAuthenticated, exports.resultViewerURLByExperimentCodename);
  };

  exports.experimentByCodename = function(request, response) {
    var baseurl, config, experimentServiceTestJSON, fullObjectFlag, serverUtilityFunctions;
    console.log(request.params.code);
    console.log(request.query.testMode);
    if ((request.query.testMode === true) || (global.specRunnerTestmode === true)) {
      experimentServiceTestJSON = require('../public/javascripts/spec/testFixtures/ExperimentServiceTestJSON.js');
      return response.end(JSON.stringify(experimentServiceTestJSON.fullExperimentFromServer));
    } else {
      config = require('../conf/compiled/conf.js');
      serverUtilityFunctions = require('./ServerUtilityFunctions.js');
      baseurl = config.all.client.service.persistence.fullpath + "experiments/codename/" + request.params.code;
      fullObjectFlag = "with=fullobject";
      if (request.query.fullObject) {
        baseurl += "?" + fullObjectFlag;
        return serverUtilityFunctions.getFromACASServer(baseurl, response);
      } else {
        return serverUtilityFunctions.getFromACASServer(baseurl, response);
      }
    }
  };

  exports.experimentsByProtocolCodename = function(request, response) {
    var baseurl, config, experimentServiceTestJSON, serverUtilityFunctions;
    console.log(request.params.code);
    console.log(request.query.testMode);
    if (request.query.testMode || global.specRunnerTestmode) {
      experimentServiceTestJSON = require('../public/javascripts/spec/testFixtures/ExperimentServiceTestJSON.js');
      return response.end(JSON.stringify(experimentServiceTestJSON.fullExperimentFromServer));
    } else {
      config = require('../conf/compiled/conf.js');
      baseurl = config.all.client.service.persistence.fullpath + "experiments/protocolCodename/" + request.params.code;
      serverUtilityFunctions = require('./ServerUtilityFunctions.js');
      return serverUtilityFunctions.getFromACASServer(baseurl, response);
    }
  };

  exports.experimentById = function(req, resp) {
    var baseurl, config, experimentServiceTestJSON, serverUtilityFunctions;
    console.log(req.params.id);
    if (global.specRunnerTestmode) {
      experimentServiceTestJSON = require('../public/javascripts/spec/testFixtures/ExperimentServiceTestJSON.js');
      return resp.end(JSON.stringify(experimentServiceTestJSON.fullExperimentFromServer));
    } else {
      config = require('../conf/compiled/conf.js');
      baseurl = config.all.client.service.persistence.fullpath + "experiments/" + req.params.id;
      serverUtilityFunctions = require('./ServerUtilityFunctions.js');
      return serverUtilityFunctions.getFromACASServer(baseurl, resp);
    }
  };

  exports.postExperiment = function(req, resp) {
    var baseurl, config, experimentServiceTestJSON, request;
    if (global.specRunnerTestmode) {
      experimentServiceTestJSON = require('../public/javascripts/spec/testFixtures/ExperimentServiceTestJSON.js');
      return resp.end(JSON.stringify(experimentServiceTestJSON.fullExperimentFromServer));
    } else {
      config = require('../conf/compiled/conf.js');
      baseurl = config.all.client.service.persistence.fullpath + "experiments";
      request = require('request');
      return request({
        method: 'POST',
        url: baseurl,
        body: req.body,
        json: true
      }, (function(_this) {
        return function(error, response, json) {
          if (!error && response.statusCode === 201) {
            console.log(JSON.stringify(json));
            return resp.end(JSON.stringify(json));
          } else {
            console.log('got ajax error trying to save new experiment');
            console.log(error);
            console.log(json);
            return console.log(response);
          }
        };
      })(this));
    }
  };

  exports.putExperiment = function(req, resp) {
    var baseurl, config, experimentServiceTestJSON, putId, request;
    if (global.specRunnerTestmode) {
      experimentServiceTestJSON = require('../public/javascripts/spec/testFixtures/ExperimentServiceTestJSON.js');
      return resp.end(JSON.stringify(experimentServiceTestJSON.fullExperimentFromServer));
    } else {
      config = require('../conf/compiled/conf.js');
      putId = req.body.id;
      baseurl = config.all.client.service.persistence.fullpath + "experiments/" + putId;
      request = require('request');
      return request({
        method: 'PUT',
        url: baseurl,
        body: req.body,
        json: true
      }, (function(_this) {
        return function(error, response, json) {
          console.log(response.statusCode);
          if (!error && response.statusCode === 200) {
            console.log(JSON.stringify(json));
            return resp.end(JSON.stringify(json));
          } else {
            console.log('got ajax error trying to save new experiment');
            console.log(error);
            return console.log(response);
          }
        };
      })(this));
    }
  };

  exports.genericExperimentSearch = function(req, res) {
    var baseurl, config, emptyResponse, experimentServiceTestJSON, serverUtilityFunctions;
    if (global.specRunnerTestmode) {
      experimentServiceTestJSON = require('../public/javascripts/spec/testFixtures/ExperimentServiceTestJSON.js');
      if (req.params.searchTerm === "no-match") {
        emptyResponse = [];
        return res.end(JSON.stringify(emptyResponse));
      } else {
        return res.end(JSON.stringify([experimentServiceTestJSON.fullExperimentFromServer]));
      }
    } else {
      config = require('../conf/compiled/conf.js');
      baseurl = config.all.client.service.persistence.fullpath + "api/v1/experiments/search?q=" + req.params.searchTerm;
      console.log("baseurl");
      console.log(baseurl);
      serverUtilityFunctions = require('./ServerUtilityFunctions.js');
      return serverUtilityFunctions.getFromACASServer(baseurl, res);
    }
  };

  exports.editExperimentLookupAndRedirect = function(req, res) {
    var json;
    if (global.specRunnerTestmode) {
      json = {
        message: "got to edit experiment redirect"
      };
      return res.end(JSON.stringify(json));
    } else {
      json = {
        message: "genericExperimentSearch not implemented yet"
      };
      return res.end(JSON.stringify(json));
    }
  };

  exports.deleteExperiment = function(req, res) {
    var baseurl, config, experimentId, request;
    config = require('../conf/compiled/conf.js');
    experimentId = req.params.id;
    baseurl = config.all.client.service.persistence.fullpath + "experiments/" + experimentId;
    console.log("baseurl");
    console.log(baseurl);
    request = require('request');
    return request({
      method: 'DELETE',
      url: baseurl,
      json: true
    }, (function(_this) {
      return function(error, response, json) {
        console.log(response.statusCode);
        if (!error && response.statusCode === 200) {
          console.log(JSON.stringify(json));
          return res.end(JSON.stringify(json));
        } else {
          console.log('got ajax error trying to save new experiment');
          console.log(error);
          return console.log(response);
        }
      };
    })(this));
  };

  exports.resultViewerURLByExperimentCodename = function(request, resp) {
    var baseurl, config, experimentServiceTestJSON, resultViewerURL, serverUtilityFunctions, _;
    console.log(__dirname);
    _ = require('../public/src/lib/underscore.js');
    if ((request.query.testMode === true) || (global.specRunnerTestmode === true)) {
      experimentServiceTestJSON = require('../public/javascripts/spec/testFixtures/ExperimentServiceTestJSON.js');
      return resp.end(JSON.stringify(experimentServiceTestJSON.resultViewerURLByExperimentCodeName));
    } else {
      config = require('../conf/compiled/conf.js');
      if (config.all.client.service.result && config.all.client.service.result.viewer && (config.all.client.service.result.viewer.experimentPrefix != null) && (config.all.client.service.result.viewer.protocolPrefix != null) && (config.all.client.service.result.viewer.experimentNameColumn != null)) {
        resultViewerURL = [
          {
            resultViewerURL: ""
          }
        ];
        serverUtilityFunctions = require('./ServerUtilityFunctions.js');
        baseurl = config.all.client.service.persistence.fullpath + "experiments/codename/" + request.params.code;
        request = require('request');
        return request({
          method: 'GET',
          url: baseurl,
          json: true
        }, (function(_this) {
          return function(error, response, experiment) {
            if (!error && response.statusCode === 200) {
              if (experiment.length === 0) {
                resp.statusCode = 404;
                return resp.json(resultViewerURL);
              } else {
                baseurl = config.all.client.service.persistence.fullpath + "protocols/" + experiment[0].protocol.id;
                request = require('request');
                return request({
                  method: 'GET',
                  url: baseurl,
                  json: true
                }, function(error, response, protocol) {
                  var experimentName, preferredExperimentLabel, preferredExperimentLabelText, preferredProtocolLabel, preferredProtocolLabelText;
                  if (response.statusCode === 404) {
                    resp.statusCode = 404;
                    return resp.json(resultViewerURL);
                  } else {
                    if (!error && response.statusCode === 200) {
                      preferredExperimentLabel = _.filter(experiment[0].lsLabels, function(lab) {
                        return lab.preferred && lab.ignored === false;
                      });
                      preferredExperimentLabelText = preferredExperimentLabel[0].labelText;
                      if (config.all.client.service.result.viewer.experimentNameColumn === "EXPERIMENT_NAME") {
                        experimentName = experiment[0].codeName + "::" + preferredExperimentLabelText;
                      } else {
                        experimentName = preferredExperimentLabelText;
                      }
                      preferredProtocolLabel = _.filter(protocol.lsLabels, function(lab) {
                        return lab.preferred && lab.ignored === false;
                      });
                      preferredProtocolLabelText = preferredProtocolLabel[0].labelText;
                      return resp.json({
                        resultViewerURL: config.all.client.service.result.viewer.protocolPrefix + encodeURIComponent(preferredProtocolLabelText) + config.all.client.service.result.viewer.experimentPrefix + encodeURIComponent(experimentName)
                      });
                    } else {
                      console.log('got ajax error trying to save new experiment');
                      console.log(error);
                      console.log(json);
                      return console.log(response);
                    }
                  }
                });
              }
            } else {
              console.log('got ajax error trying to save new experiment');
              console.log(error);
              console.log(json);
              return console.log(response);
            }
          };
        })(this));
      } else {
        resp.statusCode = 500;
        return resp.end("configuration client.service.result.viewer.protocolPrefix and experimentPrefix and experimentNameColumn must exist");
      }
    }
  };

}).call(this);
