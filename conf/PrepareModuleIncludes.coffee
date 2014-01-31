fs = require 'fs'
glob = require 'glob'
_ = require 'underscore'

prepIncludes = ->
	styleFiles = glob.sync '../public/src/modules/*/src/client/*.css'
	templateFiles = glob.sync '../public/src/modules/*/src/client/*.html'

	includeLines = ""
	for path in styleFiles
		includeStr = '        link(rel="stylesheet", href="'
		includeStr += path.replace "../public", ""
		includeStr += '")\n'
		includeLines += includeStr
	for path in templateFiles
		includeStr = "        include "
		includeStr += path
		includeStr += '\n'
		includeLines += includeStr

	includeLines

insertToLayoutTemplate = (replaceRegex, includeLines, templateFileName, outputFileName) ->
	fs = require("fs")
	fs.readFile templateFileName, "utf8", (err, data) ->
		return console.log(err) if err
		result = data.replace(replaceRegex, includeLines)
		fs.writeFile outputFileName, result, "utf8", (err) ->
			console.log err if err

includeLines = prepIncludes()
insertToLayoutTemplate /TO_BE_REPLACED_BY_PREPAREMODULEINCLUDES/, includeLines, "../views/layout.jade_template", "../views/layout.jade"

getFileNameFromPath = (path) ->
	path.replace(/^.*[\\\/]/, '')

makeFileNameHash = (inArray) ->
	scripts = {}
	for path in inArray
		scripts[getFileNameFromPath(path)] = path
	scripts

makeScriptLines = (scripts) ->
	scriptLines = ""
	for fname, path of scripts
		script = '\t"'
		script += path.replace "../public", ""
		script += '",\n'
		scriptLines += script
	scriptLines.replace /,([^,]*)$/, "" #kill last comma and newline

insertToLayoutTemplate = (replaceRegex, includeLines, templateFileName, outputFileName) ->
	fs = require("fs")
	data = fs.readFileSync templateFileName, "utf8", (err) ->
		return console.log(err) if err
	result = data.replace(replaceRegex, includeLines)
	fs.writeFileSync outputFileName, result, "utf8", (err) ->
		console.log err if err

prepAppScripts = ->
	appScriptsInModules = makeFileNameHash glob.sync('../public/src/modules/*/src/client/*.js')
	appScriptsInJavascripts = makeFileNameHash glob.sync('../public/javascripts/src/*.js')
	appScriptsInJavascripts = _.omit appScriptsInJavascripts, _.keys(appScriptsInModules)
	allScripts = _.extend appScriptsInModules, appScriptsInJavascripts
	makeScriptLines allScripts

prepSpecScripts = ->
	testJSONInModules = makeFileNameHash glob.sync('../public/src/modules/*/spec/testFixtures/*.js')
	testJSONInJavascripts = makeFileNameHash glob.sync('../public/javascripts/spec/testFixtures/*.js')
	testJSONInJavascripts = _.omit testJSONInJavascripts, _.keys(testJSONInModules)
	testJSONScripts = _.extend testJSONInModules, testJSONInJavascripts

	specScriptsInModules = makeFileNameHash glob.sync('../public/src/modules/*/spec/*.js')
	specScriptsInJavascripts = makeFileNameHash glob.sync('../public/javascripts/spec/*.js')
	specScriptsInJavascripts = _.omit specScriptsInJavascripts, _.keys(specScriptsInModules)
	allSpecScripts = _.extend specScriptsInModules, specScriptsInJavascripts
	allScripts = _.extend testJSONScripts, allSpecScripts
	makeScriptLines allScripts

appScriptLines = prepAppScripts()
insertToLayoutTemplate /APPLICATIONSCRIPTS_TO_BE_REPLACED_BY_PREPAREMODULEINCLUDES/, appScriptLines, "../routes/RequiredClientScripts.js_template", "../routes/RequiredClientScripts.js"
specScriptLines = prepSpecScripts()
insertToLayoutTemplate /SPECSCRIPTS_TO_BE_REPLACED_BY_PREPAREMODULEINCLUDES/, specScriptLines, "../routes/RequiredClientScripts.js", "../routes/RequiredClientScripts.js"

