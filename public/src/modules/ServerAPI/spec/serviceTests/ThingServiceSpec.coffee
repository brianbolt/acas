assert = require 'assert'
request = require 'request'
_ = require 'underscore'
cationicBlockTestJSON = require '../testFixtures/CationicBlockTestJSON.js'
fs = require 'fs'
config = require '../../../../conf/compiled/conf.js'


parseResponse = (jsonStr) ->
	try
		return JSON.parse jsonStr
	catch error
		console.log "response unparsable: " + error
		return null


describe.only "Thing Service testing", ->
	describe "Thing CRUD testing", ->
		describe "when fetching Thing by codename", ->
			before (done) ->
				request "http://localhost:"+config.all.server.nodeapi.port+"/api/things/parent/cationic block/CB000001", (error, response, body) =>
					@responseJSON = body
					@response = response
					done()
			it "should return a thing", ->
				responseJSON = parseResponse(@response.body)
				assert.equal responseJSON.codeName, "CB000001"

		describe "when saving a new thing parent", ->
			before (done) ->
				@.timeout(20000)
				request.post
					url: "http://localhost:"+config.all.server.nodeapi.port+"/api/things/parent/cationic block"
					json: true
					body: cationicBlockTestJSON.cationicBlockParent
				, (error, response, body) =>
					@serverError = error
					@responseJSON = body
					done()
			it "should return a thing", ->
				assert.equal @responseJSON.codeName == null, false

		describe "when saving a new thing batch", ->
			before (done) ->
				@.timeout(20000)
				request.post
					url: "http://localhost:"+config.all.server.nodeapi.port+"/api/things/batch/cationic block/CB000001"
					json: true
					body: cationicBlockTestJSON.cationicBlockBatch
				, (error, response, body) =>
					@serverError = error
					@responseJSON = body
					done()
			it "should return a thing", ->
				assert.equal @responseJSON.codeName == null, false

		describe "when updating an thing parent", ->
			before (done) ->
				@.timeout(20000)
				request.put
					url: "http://localhost:"+config.all.server.nodeapi.port+"/api/things/parent/cationic block/CB00001"
					json: true
					body: cationicBlockTestJSON.cationicBlockParent
				, (error, response, body) =>
					@serverError = error
					@responseJSON = body
					done()
			it "should return a thing", ->
				assert.equal @responseJSON.codeName == null, false

		describe "when getting batches by parent codeName", ->
			before (done) ->
				request "http://localhost:"+config.all.server.nodeapi.port+"/api/batches/cationic block/parentCodeName/CB000001", (error, response, body) =>
					@responseJSON = body
					@response = response
					done()
			it "should return a thing", ->
				responseJSON = parseResponse(@response.body)
				assert.equal responseJSON[0].codeName, "CB000001-1"

		describe "when validating thing labelText", ->
			before (done) ->
				@.timeout(20000)
				request.post
					url: "http://localhost:"+config.all.server.nodeapi.port+"/api/validateName/cationic block"
					json: true
					body: JSON.stringify "['exampleName']"
				, (error, response, body) =>
					@serverError = error
					@responseJSON = body
					console.log @responseJSON
					done()
			it "should return a thing", ->
				assert.equal @responseJSON, true

