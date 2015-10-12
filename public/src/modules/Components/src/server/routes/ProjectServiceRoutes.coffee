exports.setupAPIRoutes = (app) ->
  app.get '/api/projects', exports.getProjects

exports.setupRoutes = (app, loginRoutes) ->
	app.get '/api/projects', loginRoutes.ensureAuthenticated, exports.getProjects

exports.getProjects = (req, resp) ->
	csUtilities = require '../src/CustomerSpecificServerFunctions.js'
	if global.specRunnerTestmode
		projectServiceTestJSON = require '../public/javascripts/spec/testFixtures/projectServiceTestJSON.js'
		resp.end JSON.stringify projectServiceTestJSON.projects
	else
		csUtilities.getProjects resp


