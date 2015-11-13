(function() {
  var _, appScriptLines, fs, getFileNameFromPath, glob, includeLines, insertToLayoutTemplate, makeFileNameHash, makeScriptLines, prepAppScripts, prepIncludes, prepRouteIncludes, prepSpecScripts, routeLines, scriptPaths, specScriptLines, workingDir;

  fs = require('fs');

  glob = require('glob');

  _ = require('underscore');

  workingDir = process.argv[2];

  if (typeof workingDir !== "undefined") {
    process.chdir("..");
    process.chdir(workingDir + "/conf");
  }

  prepIncludes = function() {
    var i, includeLines, includeStr, j, len, len1, path, styleFiles, templateFiles;
    styleFiles = glob.sync('../public/src/modules/*/src/client/**/*.css');
    templateFiles = glob.sync('../public/src/modules/*/src/client/**/*.html');
    includeLines = "";
    for (i = 0, len = styleFiles.length; i < len; i++) {
      path = styleFiles[i];
      includeStr = '        link(rel="stylesheet", href="';
      includeStr += path.replace("../public", "");
      includeStr += '")\n';
      includeLines += includeStr;
    }
    for (j = 0, len1 = templateFiles.length; j < len1; j++) {
      path = templateFiles[j];
      includeStr = "        include ";
      includeStr += path;
      includeStr += '\n';
      includeLines += includeStr;
    }
    return includeLines;
  };

  insertToLayoutTemplate = function(replaceRegex, includeLines, templateFileName, outputFileName) {
    var data, result;
    fs = require("fs");
    data = fs.readFileSync(templateFileName, "utf8", function(err) {
      if (err) {
        return console.log(err);
      }
    });
    result = data.replace(replaceRegex, includeLines);
    return fs.writeFileSync(outputFileName, result, "utf8", function(err) {
      if (err) {
        return console.log(err);
      }
    });
  };

  includeLines = prepIncludes();

  insertToLayoutTemplate(/TO_BE_REPLACED_BY_PREPAREMODULEINCLUDES/, includeLines, "../views/layout.jade_template", "../views/layout.jade");

  scriptPaths = require('../routes/RequiredClientScripts_template.js');

  getFileNameFromPath = function(path) {
    return path.replace(/^.*[\\\/]/, '');
  };

  makeFileNameHash = function(inArray) {
    var i, len, path, scripts;
    scripts = {};
    for (i = 0, len = inArray.length; i < len; i++) {
      path = inArray[i];
      scripts[getFileNameFromPath(path)] = path;
    }
    return scripts;
  };

  makeScriptLines = function(scripts) {
    var fname, path, script, scriptLines;
    scriptLines = "";
    for (fname in scripts) {
      path = scripts[fname];
      script = '\t"';
      script += path.replace("../public", "");
      script += '",\n';
      scriptLines += script;
    }
    return scriptLines.replace(/,([^,]*)$/, "");
  };

  prepAppScripts = function() {
    var allScripts, appScriptsInJavascripts, appScriptsInModules, templateAppScripts;
    appScriptsInModules = makeFileNameHash(glob.sync('../public/src/modules/*/src/client/*.js'));
    appScriptsInJavascripts = makeFileNameHash(glob.sync('../public/javascripts/src/*.js'));
    appScriptsInJavascripts = _.omit(appScriptsInJavascripts, _.keys(appScriptsInModules));
    templateAppScripts = makeFileNameHash(scriptPaths.applicationScripts);
    appScriptsInJavascripts = _.omit(appScriptsInJavascripts, _.keys(templateAppScripts));
    allScripts = _.extend(appScriptsInModules, appScriptsInJavascripts);
    return makeScriptLines(allScripts);
  };

  prepSpecScripts = function() {
    var allScripts, allSpecScripts, specScriptsInJavascripts, specScriptsInModules, templateSpecScripts, testJSONInJavascripts, testJSONInModules, testJSONScripts;
    testJSONInModules = makeFileNameHash(glob.sync('../public/src/modules/*/spec/testFixtures/*.js'));
    testJSONInJavascripts = makeFileNameHash(glob.sync('../public/javascripts/spec/testFixtures/*.js'));
    testJSONInJavascripts = _.omit(testJSONInJavascripts, _.keys(testJSONInModules));
    testJSONScripts = _.extend(testJSONInModules, testJSONInJavascripts);
    testJSONScripts = _.omit(testJSONScripts, ["CodeTableJSON.js"]);
    specScriptsInModules = makeFileNameHash(glob.sync('../public/src/modules/*/spec/*.js'));
    specScriptsInJavascripts = makeFileNameHash(glob.sync('../public/javascripts/spec/*.js'));
    specScriptsInJavascripts = _.omit(specScriptsInJavascripts, _.keys(specScriptsInModules));
    templateSpecScripts = makeFileNameHash(scriptPaths.specScripts);
    specScriptsInJavascripts = _.omit(specScriptsInJavascripts, _.keys(templateSpecScripts));
    allSpecScripts = _.extend(specScriptsInModules, specScriptsInJavascripts);
    allScripts = _.extend(testJSONScripts, allSpecScripts);
    return makeScriptLines(allScripts);
  };

  appScriptLines = prepAppScripts();

  insertToLayoutTemplate("//APPLICATIONSCRIPTS_TO_BE_REPLACED_BY_PREPAREMODULEINCLUDES", ",\n" + appScriptLines, "../routes/RequiredClientScripts_template.js", "../routes/RequiredClientScripts.js");

  specScriptLines = prepSpecScripts();

  insertToLayoutTemplate("//SPECSCRIPTS_TO_BE_REPLACED_BY_PREPAREMODULEINCLUDES", ",\n" + specScriptLines, "../routes/RequiredClientScripts.js", "../routes/RequiredClientScripts.js");

  prepRouteIncludes = function(apiMode) {
    var fname, includeStr, path, routeFiles, routeLines, routeNum;
    routeFiles = makeFileNameHash(glob.sync('../routes/*.js'));
    routeFiles = _.omit(routeFiles, ["index.js", "loginRoutes.js", "RequiredClientScripts.js", "RequiredClientScripts_template.js", "user.js"]);
    routeLines = "";
    routeNum = 1;
    for (fname in routeFiles) {
      path = routeFiles[fname];
      includeStr = '\trouteSet_' + routeNum + ' = require("./routes/' + fname + '");\n';
      if (apiMode) {
        includeStr += '\tif (routeSet_' + routeNum + '.setupAPIRoutes) {\n';
        includeStr += '\t\trouteSet_' + routeNum + '.setupAPIRoutes(app); }\n';
      } else {
        includeStr += '\trouteSet_' + routeNum + '.setupRoutes(app, loginRoutes);\n';
      }
      routeLines += includeStr;
      routeNum++;
    }
    return routeLines;
  };

  routeLines = prepRouteIncludes(false);

  insertToLayoutTemplate("  /*TO_BE_REPLACED_BY_PREPAREMODULEINCLUDES */", routeLines, "../app_template.js", "../app.js");

  routeLines = prepRouteIncludes(true);

  insertToLayoutTemplate("  /*TO_BE_REPLACED_BY_PREPAREMODULEINCLUDES */", routeLines, "../app_api_template.js", "../app_api.js");

}).call(this);