assert = require 'assert'
request = require 'request'
_ = require 'underscore'
thingServiceTestJSON = require '../testFixtures/thingServiceTestJSON.js'
fs = require 'fs'
config = require '../../../../conf/compiled/conf.js'


parseResponse = (jsonStr) ->
	try
		return JSON.parse jsonStr
	catch error
		console.log "response unparsable: " + error
		return null


describe "Thing Service testing", ->
	describe "Thing CRUD testing", ->
		describe "when fetching Thing by codename", ->
			before (done) ->
				request "http://localhost:"+config.all.server.nodeapi.port+"/api/things/parent/thing/PT00001", (error, response, body) =>
					@responseJSON = body
					@response = response
					done()
			it "should return a thing", ->
				responseJSON = parseResponse(@response.body)
				assert.equal responseJSON.codeName, "PT00001"

		describe "when saving a new thing parent", ->
		#TODO Make this spec work in live mode safely, or disable if in live mode
			before (done) ->
				@.timeout(20000)
				@testFile1Path = config.all.server.datafiles.relative_path + "/TestFile.mol"
				@testFile2Path = config.all.server.datafiles.relative_path + "/Test.csv"
				fs.writeFileSync @testFile1Path, "key,value\nflavor,sweet"
				fs.writeFileSync @testFile2Path, "key,value\nmolecule,CCC"
				request.post
					url: "http://localhost:"+config.all.server.nodeapi.port+"/api/things/parent/thing"
					json: true
					body: thingServiceTestJSON.thingParent
				, (error, response, body) =>
					@serverError = error
					@responseJSON = body
					done()
			after ->
				fs.unlink @testFile1Path #in case it fails, don't leave a mess
				fs.unlink @testFile2Path
			it "should return a thing", ->
				assert.equal @responseJSON.codeName == null, false
			it "should return the first fileValue moved to the correct location", ->
				assert.equal @responseJSON.lsStates[0].lsValues[3].fileValue, "entities/parentThings/PT00001/TestFile.mol"
			it "should return the first fileValue with the comment filled with the file name", ->
				assert.equal @responseJSON.lsStates[0].lsValues[3].comments, "TestFile.mol"
			it "should return the second fileValue moved to the correct location", ->
				assert.equal @responseJSON.lsStates[0].lsValues[4].fileValue, "entities/parentThings/PT00001/Test.csv"
			it "should return the second fileValue with the comment filled with the file name", ->
				assert.equal @responseJSON.lsStates[0].lsValues[4].comments, "Test.csv"
			it "should move the first file to the correct location", ->
				fs.unlink config.all.server.datafiles.relative_path + "/entities/parentThings/PT00001/TestFile.mol", (err) =>
					assert.equal err, null #it should be there to unlink, and we've cleaned up
			it "should move the second file to the correct location", ->
				fs.unlink config.all.server.datafiles.relative_path + "/entities/parentThings/PT00001/Test.csv", (err) =>
					assert.equal err, null #it should be there to unlink, and we've cleaned up

		describe "when saving a new thing batch", ->
			before (done) ->
				@.timeout(20000)
				@testFile1Path = config.all.server.datafiles.relative_path + "/TestFile.mol"
				@testFile2Path = config.all.server.datafiles.relative_path + "/Test.csv"
				fs.writeFileSync @testFile1Path, "key,value\nflavor,sweet"
				fs.writeFileSync @testFile2Path, "key,value\nmolecule,CCC"
				request.post
					url: "http://localhost:"+config.all.server.nodeapi.port+"/api/things/batch/thing/PT00001"
					json: true
					body: thingServiceTestJSON.thingBatch
				, (error, response, body) =>
					@serverError = error
					@responseJSON = body
					done()
			after ->
				fs.unlink @testFile1Path #in case it fails, don't leave a mess
				fs.unlink @testFile2Path
			it "should return a thing", ->
				assert.equal @responseJSON.codeName == null, false
			it "should return the first fileValue moved to the correct location", ->
				assert.equal @responseJSON.lsStates[0].lsValues[7].fileValue, "entities/parentThings/PT00001-1/TestFile.mol"
			it "should return the first fileValue with the comment filled with the file name", ->
				assert.equal @responseJSON.lsStates[0].lsValues[7].comments, "TestFile.mol"
			it "should return the second fileValue moved to the correct location", ->
				assert.equal @responseJSON.lsStates[0].lsValues[8].fileValue, "entities/parentThings/PT00001-1/Test.csv"
			it "should return the second fileValue with the comment filled with the file name", ->
				assert.equal @responseJSON.lsStates[0].lsValues[8].comments, "Test.csv"
			it "should move the first file to the correct location", ->
				fs.unlink config.all.server.datafiles.relative_path + "/entities/parentThings/PT00001-1/TestFile.mol", (err) =>
					assert.equal err, null #it should be there to unlink, and we've cleaned up
			it "should move the second file to the correct location", ->
				fs.unlink config.all.server.datafiles.relative_path + "/entities/parentThings/PT00001-1/Test.csv", (err) =>
					assert.equal err, null #it should be there to unlink, and we've cleaned up

		describe "when updating a thing parent", ->
			before (done) ->
				@.timeout(20000)
				@testFile1Path = config.all.server.datafiles.relative_path + "/TestFile.mol"
				@testFile2Path = config.all.server.datafiles.relative_path + "/Test.csv"
				fs.writeFileSync @testFile1Path, "key,value\nflavor,sweet"
				fs.writeFileSync @testFile2Path, "key,value\nmolecule,CCC"
				updatedData = thingServiceTestJSON.thingParent
				updatedData.lsStates[0].lsValues[3].id = null
				updatedData.lsStates[0].lsValues[4].id = null
				request.put
					url: "http://localhost:"+config.all.server.nodeapi.port+"/api/things/parent/thing/PT00001"
					json: true
					body: updatedData
				, (error, response, body) =>
					@serverError = error
					@responseJSON = body
					done()

			after ->
				fs.unlink @testFile1Path #in case it fails, don't leave a mess
				fs.unlink @testFile2Path
			it "should return a thing", ->
					assert.equal @responseJSON.codeName == null, false
			it "should return the first fileValue moved to the correct location", ->
				assert.equal @responseJSON.lsStates[0].lsValues[3].fileValue, "entities/parentThings/PT00001/TestFile.mol"
			it "should return the first fileValue with the comment filled with the file name", ->
				assert.equal @responseJSON.lsStates[0].lsValues[3].comments, "TestFile.mol"
			it "should return the second fileValue moved to the correct location", ->
				assert.equal @responseJSON.lsStates[0].lsValues[4].fileValue, "entities/parentThings/PT00001/Test.csv"
			it "should return the second fileValue with the comment filled with the file name", ->
				assert.equal @responseJSON.lsStates[0].lsValues[4].comments, "Test.csv"
			it "should move the first file to the correct location", ->
				fs.unlink config.all.server.datafiles.relative_path + "/entities/parentThings/PT00001/TestFile.mol", (err) =>
					assert.equal err, null #it should be there to unlink, and we've cleaned up
			it "should move the second file to the correct location", ->
				fs.unlink config.all.server.datafiles.relative_path + "/entities/parentThings/PT00001/Test.csv", (err) =>
					assert.equal err, null #it should be there to unlink, and we've cleaned up

		describe "when getting batches by parent codeName", ->
			before (done) ->
				request "http://localhost:"+config.all.server.nodeapi.port+"/api/batches/thing/parentCodeName/PT00001", (error, response, body) =>
					@responseJSON = body
					@response = response
					done()
			it "should return a thing", ->
				responseJSON = parseResponse(@response.body)
				assert.equal responseJSON[0].codeName, "PT000001-1"

		describe "when validating thing labelText", ->
			before (done) ->
				@.timeout(20000)
				request.post
					url: "http://localhost:"+config.all.server.nodeapi.port+"/api/validateName/thing"
					json: true
					body: JSON.stringify "['exampleName']"
				, (error, response, body) =>
					@serverError = error
					@responseJSON = body
					console.log @responseJSON
					done()
			it "should return a thing", ->
				assert.equal @responseJSON, true

