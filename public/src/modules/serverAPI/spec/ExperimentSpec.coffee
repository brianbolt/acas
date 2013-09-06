beforeEach ->
	@fixture = $.clone($("#fixture").get(0))

afterEach ->
	$("#fixture").remove()
	$("body").append $(@fixture)

describe "Experiment module testing", ->
	describe "Experiment model testing", ->
		describe "When loaded from new", ->
			beforeEach ->
				@exp = new Experiment()
			describe "Defaults", ->
				it 'Should have default type and kind', ->
					expect(@exp.get('lsType')).toEqual "default"
					expect(@exp.get('lsKind')).toEqual "default"
				it 'Should have an empty label list', ->
					expect(@exp.get('lsLabels').length).toEqual 0
					expect(@exp.get('lsLabels') instanceof LabelList).toBeTruthy()
				it 'Should have an empty state list', ->
					expect(@exp.get('lsStates').length).toEqual 0
					expect(@exp.get('lsStates') instanceof StateList).toBeTruthy()
				it 'Should have an empty scientist', ->
					expect(@exp.get('recordedBy')).toEqual ""
				it 'Should have an empty recordedDate', ->
					expect(@exp.get('recordedDate')).toBeNull()
				it 'Should have an empty short description', ->
					expect(@exp.get('shortDescription')).toEqual ""
				it 'Should have no protocol', ->
					expect(@exp.get('protocol')).toBeNull()
				it 'Should have an empty analysisGroups', ->
					expect(@exp.get('analysisGroups') instanceof AnalysisGroupList).toBeTruthy()
			describe "required states and values", ->
				it 'Should have a description value', ->
					expect(@exp.getDescription() instanceof Value).toBeTruthy()

		describe "when loaded from existing", ->
			beforeEach ->
				@exp = new Experiment window.experimentServiceTestJSON.savedExperimentWithAnalysisGroups
			describe "after initial load", ->
				it "should have a kind", ->
					expect(@exp.get('kind')).toEqual "ACAS doc for batches"
				it "should have the protocol set ", ->
					expect(@exp.get('protocol').id).toEqual 2403
				it "should have the analysisGroups set ", ->
					expect(@exp.get('analysisGroups').length).toEqual 1
				it "should have the analysisGroup List", ->
					expect(@exp.get('analysisGroups') instanceof AnalysisGroupList).toBeTruthy()
				it "should have the analysisGroup ", ->
					expect(@exp.get('analysisGroups').at(0) instanceof AnalysisGroup).toBeTruthy()
				it "should have the states ", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates') instanceof StateList).toBeTruthy()

				it "should have the states lsKind ", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates').at(0).get('lsKind')).toEqual 'Document for Batch'
				it "should have the states lsType", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates').at(0).get('lsType')).toEqual 'results'
				it "should have the states recordedBy", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates').at(0).get('recordedBy')).toEqual 'jmcneil'

				it "should have the AnalysisGroupValues ", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates').at(0).get('lsValues') instanceof ValueList).toBeTruthy()
				it "should have the AnalysisGroupValues array", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates').at(0).get('lsValues').length).toEqual 3
				it "should have the AnalysisGroupValue ", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates').at(0).get('lsValues').at(0) instanceof Value).toBeTruthy()
				it "should have the AnalysisGroupValue valueKind ", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates').at(0).get('lsValues').at(0).get('lsKind')).toEqual "annotation"
				it "should have the AnalysisGroupValue valueType", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates').at(0).get('lsValues').at(0).get('lsType')).toEqual "fileValue"
				it "should have the AnalysisGroupValue value", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates').at(0).get('lsValues').at(0).get('fileValue')).toEqual "exampleUploadedFile.txt"
				it "should have the AnalysisGroupValue comment", ->
					expect(@exp.get('analysisGroups').at(0).get('lsStates').at(0).get('lsValues').at(0).get('comments')).toEqual "ok"
				it "should have the analysisGroup id ", ->
					expect(@exp.get('analysisGroups').at(0).id ).toEqual 64782
				it "should have a code ", ->
					expect(@exp.get('codeName')).toEqual "EXPT-00000222"
				it "should have the shortDescription set", ->
					expect(@exp.get('shortDescription')).toEqual window.experimentServiceTestJSON.savedExperimentWithAnalysisGroups.shortDescription
				it "should have labels", ->
					expect(@exp.get('lsLabels').length).toEqual window.experimentServiceTestJSON.savedExperimentWithAnalysisGroups.lsLabels.length
				it "should have labels", ->
					expect(@exp.get('lsLabels').at(0).get('lsKind')).toEqual "experiment name"
				it 'Should have a description value', ->
					expect(@exp.getDescription().get('stringValue')).toEqual "long description goes here"
		describe "when created from template protocol", ->
			beforeEach ->
				@exp = new Experiment()
				@exp.copyProtocolAttributes new Protocol(window.protocolServiceTestJSON.fullSavedProtocol)
			describe "after initial load", ->
				it "Class should exist", ->
					expect(@exp).toBeDefined()
				it "should have same kind as protocol", ->
					expect(@exp.get('kind')).toEqual window.protocolServiceTestJSON.fullSavedProtocol.lsKind
				it "should have the protocol set ", ->
					expect(@exp.get('protocol').get('codeName')).toEqual "PROT-00000001"
				it "should have the shortDescription set to the protocols short description", ->
					expect(@exp.get('shortDescription')).toEqual window.protocolServiceTestJSON.fullSavedProtocol.shortDescription
				it "should have the description set to the protocols description", ->
					expect(@exp.get('description')).toEqual window.protocolServiceTestJSON.fullSavedProtocol.description
				it "should not have the labels copied", ->
					expect(@exp.get('lsLabels').length).toEqual 0
				it "should have the states copied", ->
					expect(@exp.get('lsStates').length).toEqual window.protocolServiceTestJSON.fullSavedProtocol.lsStates.length
				it 'Should have a description value', ->
					expect(@exp.getDescription().get('stringValue')).toEqual "long description goes here"
		describe "model change propogation", ->
			it "should trigger change when label changed", ->
				runs ->
					@exp = new Experiment()
					@experimentChanged = false
					@exp.get('lsLabels').setBestName new Label
						labelKind: "experiment name"
						labelText: "test label"
						recordedBy: @exp.get 'recordedBy'
						recordedDate: @exp.get 'recordedDate'
					@exp.on 'change', =>
						@experimentChanged = true
					@experimentChanged = false
					@exp.get('lsLabels').setBestName new Label
						labelKind: "experiment name"
						labelText: "new label"
						recordedBy: @exp.get 'recordedBy'
						recordedDate: @exp.get 'recordedDate'
				waitsFor ->
					@experimentChanged
				, 500
				runs ->
					expect(@experimentChanged).toBeTruthy()
			it "should trigger change when value changed in state", ->
				runs ->
					@exp = new Experiment window.experimentServiceTestJSON.fullExperimentFromServer
					@experimentChanged = false
					@exp.on 'change', =>
						@experimentChanged = true
					@exp.get('lsStates').at(0).get('lsValues').at(0).set(lsKind: 'fred')
				waitsFor ->
					@experimentChanged
				, 500
				runs ->
					expect(@experimentChanged).toBeTruthy()
		describe "model validation", ->
			beforeEach ->
				@exp = new Experiment window.experimentServiceTestJSON.fullExperimentFromServer
			it "should be valid when loaded from saved", ->
				expect(@exp.isValid()).toBeTruthy()
			it "should be invalid when name is empty", ->
				@exp.get('lsLabels').setBestName new Label
					labelKind: "experiment name"
					labelText: ""
					recordedBy: @exp.get 'recordedBy'
					recordedDate: @exp.get 'recordedDate'
				expect(@exp.isValid()).toBeFalsy()
				filtErrors = _.filter(@exp.validationError, (err) ->
					err.attribute=='experimentName'
				)
				expect(filtErrors.length).toBeGreaterThan 0
			it "should be invalid when date is empty", ->
				@exp.set recordedDate: new Date("").getTime()
				expect(@exp.isValid()).toBeFalsy()
				filtErrors = _.filter(@exp.validationError, (err) ->
					err.attribute=='recordedDate'
				)
				expect(filtErrors.length).toBeGreaterThan 0
			it "should be invalid when scientist not selected", ->
				@exp.set recordedBy: ""
				expect(@exp.isValid()).toBeFalsy()
				filtErrors = _.filter(@exp.validationError, (err) ->
					err.attribute=='recordedBy'
				)
			it "should be invalid when protocol not selected", ->
				@exp.set protocol: null
				expect(@exp.isValid()).toBeFalsy()
				filtErrors = _.filter(@exp.validationError, (err) ->
					err.attribute=='protocol'
				)
				expect(filtErrors.length).toBeGreaterThan 0

		describe "model composite component conversion", ->
			beforeEach ->
				runs ->
					@saveSucessful = false
					@saveComplete = false
					@exp = new Experiment id: 1
					@exp.on 'sync', =>
						@saveSucessful = true
						@saveComplete = true
					@exp.on 'invalid', =>
						@saveComplete = true
					@exp.fetch()
				waitsFor ->
					@saveComplete == true
				, 500
			it "should return from sync, not invalid", ->
				runs ->
					expect(@saveSucessful).toBeTruthy()
			it "should convert labels array to label list", ->
				runs ->
					expect(@exp.get('lsLabels')  instanceof LabelList).toBeTruthy()
					expect(@exp.get('lsLabels').length).toBeGreaterThan 0
			it "should convert state array to state list", ->
				runs ->
					expect(@exp.get('lsStates')  instanceof StateList).toBeTruthy()
					expect(@exp.get('lsStates').length).toBeGreaterThan 0
			it "should convert protocol has to Protocol", ->
				runs ->
					expect(@exp.get('protocol')  instanceof Protocol).toBeTruthy()

	describe "ExperimentBaseController testing", ->
		# This basic controller manages display and editing of basic attributes
		# Other controllers may be setup by a wrapping app controller to handle special
		# experiment attributes like primary screen analysis or dose response fitting.
		describe "When created with an unsaved experiment that has protocol attributes copied in", ->
			beforeEach ->
				runs ->
					@copied = false
					@exp = new Experiment()
					@exp.on "protocol_attributes_copied", =>
						@copied = true
					@exp.copyProtocolAttributes new Protocol(window.protocolServiceTestJSON.fullSavedProtocol)
					@ebc = new ExperimentBaseController
						model: @exp
						el: $('#fixture')
					@ebc.render()
			describe "Basic loading", ->
				it "Class should exist", ->
					expect(@ebc).toBeDefined()
				it "Should load the template", ->
					expect(@ebc.$('.bv_experimentCode').html()).toEqual "autofill when saved"
				it "should trigger copy complete", ->
					waitsFor ->
						@copied
					, 500
					runs ->
						expect(@copied).toBeTruthy()
			describe "populated fields", ->
				it "should show the protocol code", ->
					waitsFor ->
						@ebc.$('.bv_protocolCode option').length > 0
					, 1000
					runs ->
						expect(@ebc.$('.bv_protocolCode').val()).toEqual "PROT-00000001"
				it "should show the protocol name", ->
					expect(@ebc.$('.bv_protocolName').html()).toEqual "FLIPR target A biochemical"
				it "should fill the short description field", ->
					expect(@ebc.$('.bv_shortDescription').html()).toEqual "primary analysis"
			describe "User edits fields", ->
				it "should update model when scientist is changed", ->
					expect(@ebc.model.get 'recordedBy').toEqual ""
					@ebc.$('.bv_recordedBy').val("jmcneil")
					@ebc.$('.bv_recordedBy').change()
					expect(@ebc.model.get 'recordedBy').toEqual "jmcneil"
				it "should update model when shortDescription is changed", ->
					@ebc.$('.bv_shortDescription').val(" New short description   ")
					@ebc.$('.bv_shortDescription').change()
					expect(@ebc.model.get 'shortDescription').toEqual "New short description"
				it "should update model when description is changed", ->
					@ebc.$('.bv_description').val(" New long description   ")
					@ebc.$('.bv_description').change()
					states = @ebc.model.get('lsStates').getStatesByTypeAndKind "metadata", "experiment metadata"
					expect(states.length).toEqual 1
					values = states[0].getValuesByTypeAndKind("stringValue", "description")
					desc = values[0].get('stringValue')
					expect(desc).toEqual "New long description"
					expect(@ebc.model.getDescription().get('stringValue')).toEqual "New long description"
				it "should update model when name is changed", ->
					@ebc.$('.bv_experimentName').val(" Updated experiment name   ")
					@ebc.$('.bv_experimentName').change()
					expect(@ebc.model.get('lsLabels').pickBestLabel().get('labelText')).toEqual "Updated experiment name"
				it "should update model when recorded date is changed", ->
					@ebc.$('.bv_recordedDate').val(" 2013-3-16   ")
					@ebc.$('.bv_recordedDate').change()
					expect(@ebc.model.get 'recordedDate').toEqual new Date(2013,2,16).getTime()
		describe "When created from a saved experiment", ->
			beforeEach ->
				@exp2 = new Experiment window.experimentServiceTestJSON.fullExperimentFromServer
				@ebc = new ExperimentBaseController
					model: @exp2
					el: $('#fixture')
				@ebc.render()
			it "should show the protocol code", ->
				waitsFor ->
					@ebc.$('.bv_protocolCode option').length > 0
				, 1000
				runs ->
					expect(@ebc.$('.bv_protocolCode').val()).toEqual "PROT-00000001"
			it "should show the protocol name", ->
				waits(200) # needs to fill out stub protocol
				runs ->
					expect(@ebc.$('.bv_protocolName').html()).toEqual "FLIPR target A biochemical"
			it "should have use protocol parameters disabled", ->
				expect(@ebc.$('.bv_useProtocolParameters').attr("disabled")).toEqual "disabled"
			it "should fill the short description field", ->
				expect(@ebc.$('.bv_shortDescription').html()).toEqual "experiment created by generic data parser"
			it "should fill the long description field", ->
				expect(@ebc.$('.bv_description').html()).toEqual "long description goes here"
			#TODO this test breaks because of the weird behavior where new a Model from a json hash
			# then setting model attribites changes the hash
			xit "should fill the name field", ->
				expect(@ebc.$('.bv_experimentName').val()).toEqual "FLIPR target A biochemical"
			it "should fill the date field", ->
				expect(@ebc.$('.bv_recordedDate').val()).toEqual "2013-7-7"
			it "should fill the user field", ->
				expect(@ebc.$('.bv_recordedBy').val()).toEqual "smeyer"
			it "should fill the code field", ->
				expect(@ebc.$('.bv_experimentCode').html()).toEqual "EXPT-00000001"
		describe "When created from a new experiment", ->
			beforeEach ->
				@exp0 = new Experiment()
				@ebc = new ExperimentBaseController
					model: @exp0
					el: $('#fixture')
				@ebc.render()
			describe "basic startup conditions", ->
				it "should have protocol code not set", ->
					waitsFor ->
						@ebc.$('.bv_protocolCode option').length > 0
					, 1000
					runs ->
						expect(@ebc.$('.bv_protocolCode').val()).toEqual "unassigned"
				it "should have use protocol parameters disabled", ->
					expect(@ebc.$('.bv_useProtocolParameters').attr("disabled")).toEqual "disabled"
				it "should fill the date field", ->
					expect(@ebc.$('.bv_recordedDate').val()).toEqual ""
			describe "when user picks protocol ", ->
				beforeEach ->
					runs ->
						@ebc.$('.bv_protocolCode').val("PROT-00000001")
						@ebc.$('.bv_protocolCode').change()
				describe "When user picks protocol", ->
					it "should update model", ->
						waits(200) # needs to fetch stub protocol
						runs ->
							expect(@ebc.model.get('protocol').get('codeName')).toEqual "PROT-00000001"
					it "should enable use protocol params", ->
						waits(200) # needs to fill out stub protocol
						runs ->
							expect(@ebc.$('.bv_useProtocolParameters').attr("disabled")).toBeUndefined()
					it "should show the protocol name", ->
						waits(200) # needs to fill out stub protocol
						runs ->
							expect(@ebc.$('.bv_protocolName').html()).toEqual "FLIPR target A biochemical"
				describe "When user and asks to clone attributes should populate fields", ->
					beforeEach ->
						waits(200)
						runs ->
							@ebc.$('.bv_useProtocolParameters').click()
					it "should fill the short description field", ->
						waits(200)
						runs ->
							expect(@ebc.$('.bv_shortDescription').html()).toEqual "primary analysis"
			describe "controller validation rules", ->
				beforeEach ->
					runs ->
						@ebc.$('.bv_recordedBy').val("jmcneil")
						@ebc.$('.bv_recordedBy').change()
						@ebc.$('.bv_recordedDate').val(" 2013-3-16   ")
						@ebc.$('.bv_recordedDate').change()
						@ebc.$('.bv_shortDescription').val(" New short description   ")
						@ebc.$('.bv_shortDescription').change()
						@ebc.$('.bv_protocolCode').val("PROT-00000001")
						@ebc.$('.bv_protocolCode').change()
						@ebc.$('.bv_experimentName').val(" Updated experiment name   ")
						@ebc.$('.bv_experimentName').change()
					waits(200)
					runs ->
						@ebc.$('.bv_useProtocolParameters').click()
					waits(200)
				it "should be valid if form fully filled out", ->
					runs ->
						expect(@ebc.isValid()).toBeTruthy()
				describe "when name field not filled in", ->
					beforeEach ->
						runs ->
							@ebc.$('.bv_experimentName').val("")
							@ebc.$('.bv_experimentName').change()
					it "should be invalid if experiment name not filled in", ->
						runs ->
							expect(@ebc.isValid()).toBeFalsy()
					it "should show error in name field", ->
						runs ->
							expect(@ebc.$('.bv_group_experimentName').hasClass('error')).toBeTruthy()
				describe "when date field not filled in", ->
					beforeEach ->
						runs ->
							@ebc.$('.bv_recordedDate').val("")
							@ebc.$('.bv_recordedDate').change()
					it "should show error in date field", ->
						runs ->
							expect(@ebc.$('.bv_group_recordedDate').hasClass('error')).toBeTruthy()
				describe "when scientist not selected", ->
					beforeEach ->
						runs ->
							@ebc.$('.bv_recordedBy').val("")
							@ebc.$('.bv_recordedBy').change()
					it "should show error on scientist dropdown", ->
						runs ->
							expect(@ebc.$('.bv_group_recordedBy').hasClass('error')).toBeTruthy()
				describe "when protocol not selected", ->
					beforeEach ->
						runs ->
							@ebc.$('.bv_protocolCode').val("unassigned")
							@ebc.$('.bv_protocolCode').change()
					it "should show error on protocol dropdown", ->
						runs ->
							expect(@ebc.$('.bv_group_protocol').hasClass('error')).toBeTruthy()





#TODO make scientist and date render from and update recorded** if new expt and updated** if existing
#TODO add notebook field
#TODO fix styling or DOM grouping to force protocol, scientist and date fields to show red when they have error style
#TODO fix all recordedBy in states, values and lables before initial save,
# or when that field is updated
#TODO save user input date in state, not recordedDate