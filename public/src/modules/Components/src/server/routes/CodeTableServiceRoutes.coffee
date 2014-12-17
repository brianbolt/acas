_ = require "underscore"

exports.setupAPIRoutes = (app) ->
	app.get '/api/codetables/:type/:kind', exports.getCodeTableValues
	app.get '/api/codetables', exports.getAllCodeTableValues
	app.post '/api/codetables', exports.postCodeTable
	app.put '/api/codetables/:id', exports.putCodeTable

exports.setupRoutes = (app, loginRoutes) ->
	app.get '/api/codetables/:type/:kind', loginRoutes.ensureAuthenticated, exports.getCodeTableValues
	app.get '/api/codetables', loginRoutes.ensureAuthenticated, exports.getAllCodeTableValues
	app.post '/api/codetables', loginRoutes.ensureAuthenticated, exports.postCodeTable
	app.put '/api/codetables/:id', loginRoutes.ensureAuthenticated, exports.putCodeTable



exports.getAllCodeTableValues = (req, resp) ->
	if global.specRunnerTestmode
		codeTableServiceTestJSON = require '../public/javascripts/spec/testFixtures/CodeTableJSON.js'
		resp.end JSON.stringify correctCodeTable['codes']

	else
		config = require '../conf/compiled/conf.js'
		baseurl = "#{config.all.client.service.persistence.fullpath}api/v1/ddictvalues?format=codetable"
		request = require 'request'
		request(
			method: 'GET'
			url: baseurl
			json: true
		, (error, response, json) =>
			if !error && response.statusCode == 200
				resp.json json
			else
				console.log 'got ajax error trying to get protocol labels'
				console.log error
				console.log json
				console.log response
		)

exports.getCodeTableValues = (req, resp) ->
	if global.specRunnerTestmode
		codeTableServiceTestJSON = require '../public/javascripts/spec/testFixtures/CodeTableJSON.js'
		correctCodeTable = _.findWhere(codeTableServiceTestJSON.codes, {type:req.params.type, kind:req.params.kind})
		resp.end JSON.stringify correctCodeTable['codes']

	else
		config = require '../conf/compiled/conf.js'
		baseurl = "#{config.all.client.service.persistence.fullpath}api/v1/ddictvalues/all/#{req.params.type}/#{req.params.kind}/codetable"
		request = require 'request'
		request(
			method: 'GET'
			url: baseurl
			json: true
		, (error, response, json) =>
			if !error && response.statusCode == 200
				resp.json json
			else
				console.log 'got ajax error trying to get protocol labels'
				console.log error
				console.log json
				console.log response
		)


exports.postCodeTable = (req, resp) ->
	if global.specRunnerTestmode
		codeTableServiceTestJSON = require '../public/javascripts/spec/testFixtures/CodeTableJSON.js'
		correctCodeTable = _.findWhere(codeTableServiceTestJSON.codes, {type:req.params.type, kind:req.params.kind})
		resp.end JSON.stringify correctCodeTable['codes']
	else
		console.log "attempting to post new code table value"
		config = require '../conf/compiled/conf.js'
		baseurl = "#{config.all.client.service.persistence.fullpath}api/v1/ddictvalues/codetable"
		request = require 'request'
		request(
			method: 'POST'
			url: baseurl
			body: req.body
			json: true
		, (error, response, json) =>
			if !error && response.statusCode == 201
				resp.end JSON.stringify json
			else
				console.log 'got ajax error trying to save new code table'
				console.log error
				console.log json
				console.log response
		)


exports.putCodeTable = (req, resp) ->
	#console.log JSON.stringify req.body
	if global.specRunnerTestmode
		codeTableServiceTestJSON = require '../public/javascripts/spec/testFixtures/CodeTableJSON.js'
		correctCodeTable = _.findWhere(codeTableServiceTestJSON.codes, {type:req.params.type, kind:req.params.kind})
		resp.end JSON.stringify correctCodeTable['codes']
	else
		config = require '../conf/compiled/conf.js'
		putId = req.body.id
		baseurl = "#{config.all.client.service.persistence.fullpath}api/v1/ddictvalues/codetable/#{putId}"

		request = require 'request'
		request(
			method: 'PUT'
			url: baseurl
			body: req.body
			json: true
		, (error, response, json) =>
			console.log response.statusCode
			if !error && response.statusCode == 200
				resp.end JSON.stringify json
			else
				console.log 'got ajax error trying to update code table'
				console.log error
				console.log response
		)







