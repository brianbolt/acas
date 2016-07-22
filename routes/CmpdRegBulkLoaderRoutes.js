(function() {
  var path;

  path = require('path');

  exports.setupAPIRoutes = function(app) {
    return app.post('/api/cmpdRegBulkLoader', exports.postAssignedProperties);
  };

  exports.setupRoutes = function(app, loginRoutes) {
    app.get('/cmpdRegBulkLoader', loginRoutes.ensureAuthenticated, exports.cmpdRegBulkLoaderIndex);
    app.get('/api/cmpdRegBulkLoader/templates/:user', loginRoutes.ensureAuthenticated, exports.getCmpdRegBulkLoaderTemplates);
    app.get('/api/cmpdRegBulkLoader/getFilesToPurge', loginRoutes.ensureAuthenticated, exports.getFilesToPurge);
    app.post('/api/cmpdRegBulkLoader/readSDF', loginRoutes.ensureAuthenticated, exports.cmpdRegBulkLoaderReadSdf);
    app.post('/api/cmpdRegBulkLoader/saveTemplate', loginRoutes.ensureAuthenticated, exports.saveTemplate);
    app.post('/api/cmpdRegBulkLoader/registerCmpds', loginRoutes.ensureAuthenticated, exports.registerCmpds);
    app.post('/api/cmpdRegBulkLoader', loginRoutes.ensureAuthenticated, exports.postAssignedProperties);
    app.post('/api/cmpdRegBulkLoader/checkFileDependencies', loginRoutes.ensureAuthenticated, exports.checkFileDependencies);
    return app.post('/api/cmpdRegBulkLoader/purgeFile', loginRoutes.ensureAuthenticated, exports.purgeFile);
  };

  exports.cmpdRegBulkLoaderIndex = function(req, res) {
    var config, loginUser, loginUserName, scriptPaths, scriptsToLoad;
    scriptPaths = require('./RequiredClientScripts.js');
    config = require('../conf/compiled/conf.js');
    global.specRunnerTestmode = global.stubsMode ? true : false;
    scriptsToLoad = scriptPaths.requiredScripts.concat(scriptPaths.applicationScripts);
    if (config.all.client.require.login) {
      loginUserName = req.user.username;
      loginUser = req.user;
    } else {
      loginUserName = "nouser";
      loginUser = {
        id: 0,
        username: "nouser",
        email: "nouser@nowhere.com",
        firstName: "no",
        lastName: "user"
      };
    }
    return res.render('CmpdRegBulkLoader', {
      title: "Compound Registration Bulk Loader",
      scripts: scriptsToLoad,
      AppLaunchParams: {
        loginUserName: loginUserName,
        loginUser: loginUser,
        testMode: false,
        moduleLaunchParams: typeof moduleLaunchParams !== "undefined" && moduleLaunchParams !== null ? moduleLaunchParams : null,
        deployMode: global.deployMode
      }
    });
  };

  exports.getCmpdRegBulkLoaderTemplates = function(req, resp) {
    var baseurl, cmpdRegBulkLoaderTestJSON, config, serverUtilityFunctions;
    if (req.query.testMode || global.specRunnerTestmode) {
      cmpdRegBulkLoaderTestJSON = require('../public/javascripts/spec/testFixtures/CmpdRegBulkLoaderServiceTestJSON.js');
      return resp.end(JSON.stringify(cmpdRegBulkLoaderTestJSON.templates));
    } else {
      config = require('../conf/compiled/conf.js');
      serverUtilityFunctions = require('./ServerUtilityFunctions.js');
      baseurl = config.all.client.service.cmpdReg.persistence.fullpath + "bulkload/templates?userName=" + req.params.user;
      return serverUtilityFunctions.getFromACASServer(baseurl, resp);
    }
  };

  exports.getFilesToPurge = function(req, resp) {
    var baseurl, cmpdRegBulkLoaderTestJSON, config, serverUtilityFunctions;
    if (req.query.testMode || global.specRunnerTestmode) {
      cmpdRegBulkLoaderTestJSON = require('../public/javascripts/spec/testFixtures/CmpdRegBulkLoaderServiceTestJSON.js');
      return resp.end(JSON.stringify(cmpdRegBulkLoaderTestJSON.filesToPurge));
    } else {
      config = require('../conf/compiled/conf.js');
      serverUtilityFunctions = require('./ServerUtilityFunctions.js');
      baseurl = config.all.client.service.cmpdReg.persistence.fullpath + "bulkload/files";
      return serverUtilityFunctions.getFromACASServer(baseurl, resp);
    }
  };

  exports.cmpdRegBulkLoaderReadSdf = function(req, resp) {
    var baseurl, cmpdRegBulkLoaderTestJSON, config, filePath, request, serverUtilityFunctions, uploadsPath;
    if (req.query.testMode || global.specRunnerTestmode) {
      cmpdRegBulkLoaderTestJSON = require('../public/javascripts/spec/testFixtures/CmpdRegBulkLoaderServiceTestJSON.js');
      if (req.body.templateName === "Template 1") {
        if (req.body.numRecords < 300) {
          return resp.end(JSON.stringify(cmpdRegBulkLoaderTestJSON.propertiesList));
        } else {
          return resp.end(JSON.stringify(cmpdRegBulkLoaderTestJSON.propertiesList2));
        }
      } else {
        return resp.end(JSON.stringify(cmpdRegBulkLoaderTestJSON.propertiesList3));
      }
    } else {
      serverUtilityFunctions = require('./ServerUtilityFunctions.js');
      config = require('../conf/compiled/conf.js');
      uploadsPath = serverUtilityFunctions.makeAbsolutePath(config.all.server.datafiles.relative_path);
      filePath = uploadsPath + req.body.fileName;
      req.body.fileName = filePath;
      baseurl = config.all.client.service.cmpdReg.persistence.fullpath + "bulkload/getSdfProperties";
      request = require('request');
      return request({
        method: 'POST',
        url: baseurl,
        body: req.body,
        json: true
      }, (function(_this) {
        return function(error, response, json) {
          if (!error && response.statusCode === 200) {
            return resp.json(json);
          } else {
            console.log('got ajax error trying to read sdf');
            console.log(error);
            console.log(json);
            console.log(response);
            return resp.end(JSON.stringify("Error"));
          }
        };
      })(this));
    }
  };

  exports.saveTemplate = function(req, resp) {
    var baseurl, cmpdRegBulkLoaderTestJSON, config, request;
    if (req.query.testMode || global.specRunnerTestmode) {
      cmpdRegBulkLoaderTestJSON = require('../public/javascripts/spec/testFixtures/CmpdRegBulkLoaderServiceTestJSON.js');
      return resp.end(JSON.stringify(cmpdRegBulkLoaderTestJSON.savedTemplateReturn));
    } else {
      config = require('../conf/compiled/conf.js');
      baseurl = config.all.client.service.cmpdReg.persistence.fullpath + "bulkload/templates/saveTemplate";
      request = require('request');
      return request({
        method: 'POST',
        url: baseurl,
        body: req.body,
        json: true
      }, (function(_this) {
        return function(error, response, json) {
          if (!error && response.statusCode === 200) {
            return resp.json(json);
          } else {
            console.log('got ajax error trying to save template');
            console.log(error);
            console.log(json);
            console.log(response);
            return resp.end(JSON.stringify("Error"));
          }
        };
      })(this));
    }
  };

  exports.registerCmpds = function(req, resp) {
    var createSummaryZip, moveSdfFile, registerCmpds;
    req.connection.setTimeout(6000000);
    createSummaryZip = function(fileName, json) {
      var JSZip, config, fs, fstream, i, len, movedUploadsPath, origUploadsPath, rFile, rFileName, ref, serverUtilityFunctions, splitNames, zip, zipFileName, zipFilePath;
      console.log("fileName");
      console.log(fileName);
      fileName = fileName.substring(0, fileName.length - 4);
      zipFileName = fileName + ".zip";
      fs = require('fs');
      JSZip = require('jszip');
      zip = new JSZip();
      ref = json.reportFiles;
      for (i = 0, len = ref.length; i < len; i++) {
        rFile = ref[i];
        serverUtilityFunctions = require('./ServerUtilityFunctions.js');
        config = require('../conf/compiled/conf.js');
        splitNames = rFile.split(path.sep + "cmpdreg_bulkload" + path.sep);
        rFileName = splitNames[1];
        zip.file(rFileName, fs.readFileSync(rFile));
      }
      origUploadsPath = serverUtilityFunctions.makeAbsolutePath(config.all.server.datafiles.relative_path);
      movedUploadsPath = origUploadsPath + "cmpdreg_bulkload" + path.sep;
      zipFilePath = movedUploadsPath + zipFileName;
      zipFilePath = config.all.server.service.persistence.filePath + path.sep + "cmpdreg_bulkload" + path.sep + zipFileName;
      zipFilePath = zipFilePath.replace(/\\/g, "%5C");
      console.log(zipFilePath);
      fstream = zip.generateNodeStream({
        type: "nodebuffer",
        streamFiles: true
      }).pipe(fs.createWriteStream(zipFilePath));
      fstream.on('finish', function() {
        console.log("finished create write stream");
        return resp.json([json, zipFileName]);
      });
      return fstream.on('error', function(err) {
        console.log("error writing stream for zip");
        console.log(err);
        return resp.end("Summary ZIP file could not be created");
      });
    };
    registerCmpds = function(req, resp) {
      var baseurl, config, fileName, request;
      if (req === "error") {
        return resp.end(JSON.stringify("Error"));
      } else {
        if (req.query.testMode || global.specRunnerTestmode) {
          return resp.end(JSON.stringify("Registration Summary here"));
        } else {
          fileName = req.body.fileName;
          delete req.body.fileName;
          config = require('../conf/compiled/conf.js');
          baseurl = config.all.client.service.cmpdReg.persistence.fullpath + "bulkload/registerSdf";
          request = require('request');
          return request({
            method: 'POST',
            url: baseurl,
            body: req.body,
            json: true
          }, (function(_this) {
            return function(error, response, json) {
              if (!error && response.statusCode === 200) {
                return createSummaryZip(fileName, json);
              } else {
                console.log('got ajax error trying to register compounds');
                console.log(error);
                console.log(json);
                console.log(response);
                return resp.end(JSON.stringify("Error"));
              }
            };
          })(this));
        }
      }
    };
    moveSdfFile = function(req, resp, callback) {
      var bulkLoadFolder, config, fileName, fs, newPath, oldPath, serverUtilityFunctions, uploadsPath;
      fileName = req.body.fileName;
      serverUtilityFunctions = require('./ServerUtilityFunctions.js');
      config = require('../conf/compiled/conf.js');
      fs = require('fs');
      uploadsPath = serverUtilityFunctions.makeAbsolutePath(config.all.server.datafiles.relative_path);
      oldPath = uploadsPath + fileName;
      bulkLoadFolder = uploadsPath + "cmpdreg_bulkload" + path.sep;
      while (fs.existsSync(bulkLoadFolder + path.sep + fileName)) {
        fileName = fileName.replace(/(?:(?: \(([\d]+)\))?(\.[^.]+))?$/, function(s, index, ext) {
          return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');
        });
      }
      newPath = bulkLoadFolder + fileName;
      return serverUtilityFunctions.ensureExists(bulkLoadFolder, 0x1e4, function(err) {
        if (err != null) {
          console.log("Can't find or create bulkload folder: " + bulkLoadFolder);
          return callback("error", resp);
        } else {
          return fs.rename(oldPath, newPath, function(err) {
            if (err != null) {
              console.log(err);
              return callback("error", resp);
            } else {
              req.body.filePath = newPath;
              req.body.fileName = fileName;
              return callback(req, resp);
            }
          });
        }
      });
    };
    return moveSdfFile(req, resp, registerCmpds);
  };

  exports.checkFileDependencies = function(req, resp) {
    var baseurl, config, request;
    if (req.query.testMode || global.specRunnerTestmode) {
      return resp.end(JSON.stringify("File has 10 parents and 10 lots"));
    } else {
      config = require('../conf/compiled/conf.js');
      baseurl = config.all.client.service.cmpdReg.persistence.fullpath + "bulkload/checkDependencies";
      request = require('request');
      return request({
        method: 'POST',
        url: baseurl,
        body: req.body.fileInfo,
        json: true
      }, (function(_this) {
        return function(error, response, json) {
          if (!error && response.statusCode === 200) {
            return resp.json(json);
          } else {
            console.log('got ajax error trying to check dependencies');
            console.log(error);
            console.log(json);
            console.log(response);
            return resp.end(JSON.stringify("Error"));
          }
        };
      })(this));
    }
  };

  exports.purgeFile = function(req, resp) {
    var baseurl, config, request;
    if (req.query.testMode || global.specRunnerTestmode) {
      return resp.end(JSON.stringify("Successful purge in stubsMode."));
    } else {
      config = require('../conf/compiled/conf.js');
      baseurl = config.all.client.service.cmpdReg.persistence.fullpath + "bulkload/purge";
      request = require('request');
      return request({
        method: 'POST',
        url: baseurl,
        body: req.body.fileInfo,
        json: true
      }, (function(_this) {
        return function(error, response, json) {
          if (!error && response.statusCode === 200) {
            return resp.json(json);
          } else {
            console.log('got ajax error trying to purge');
            console.log(error);
            console.log(json);
            console.log(response);
            return resp.end(JSON.stringify("Error"));
          }
        };
      })(this));
    }
  };

}).call(this);