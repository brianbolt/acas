
class window.ExperimentValue extends Backbone.Model

class window.ExperimentValueList extends Backbone.Collection
	model: ExperimentValue

class window.ExperimentState extends Backbone.Model
	defaults:
		lsValues: new ExperimentValueList()

	initialize: ->
		if @has('lsValues')
			if @get('lsValues') not instanceof ExperimentValueList
				@set lsValues: new ExperimentValueList(@get('lsValues'))
		@get('lsValues').on 'change', =>
			@trigger 'change'

	parse: (resp) ->
		if resp.lsValues?
			if resp.lsValues not instanceof ExperimentValueList
				resp.lsValues = new ExperimentValueList(resp.lsValues)
				resp.lsValues.on 'change', =>
					@trigger 'change'
		resp

	getValuesByTypeAndKind: (type, kind) ->
		@get('lsValues').filter (value) ->
			(not value.get('ignored')) and (value.get('lsType')==type) and (value.get('lsKind')==kind)

class window.ExperimentStateList extends Backbone.Collection
	model: ExperimentState

	getStatesByTypeAndKind: (type, kind) ->
		@filter (state) ->
			(not state.get('ignored')) and (state.get('lsType')==type) and (state.get('lsKind')==kind)

	getStateValueByTypeAndKind: (stype, skind, vtype, vkind) ->
		value = null
		states = @getStatesByTypeAndKind stype, skind
		if states.length > 0
			#TODO get most recent state and value if more than 1 or throw error
			values = states[0].getValuesByTypeAndKind(vtype, vkind)
			if values.length > 0
				value = values[0]
		value



class window.Experiment extends Backbone.Model
	urlRoot: "/api/experiments"
	defaults:
		kind: ""
		recordedBy: ""
		recordedDate: null
		shortDescription: ""
		lsLabels: new LabelList()
		lsStates: new ExperimentStateList()
		protocol: null
		analysisGroups: new AnalysisGroupList()

	initialize: ->
		@fixCompositeClasses()
		@setupCompositeChangeTriggers()

	parse: (resp) =>
		if resp.lsLabels?
			if resp.lsLabels not instanceof LabelList
				resp.lsLabels = new LabelList(resp.lsLabels)
				resp.lsLabels.on 'change', =>
					@trigger 'change'
		if resp.lsStates?
			if resp.lsStates not instanceof ExperimentStateList
				resp.lsStates = new ExperimentStateList(resp.lsStates)
				resp.lsStates.on 'change', =>
					@trigger 'change'
		if resp.analysisGroups?
			if resp.analysisGroups not instanceof AnalysisGroupList
				resp.analysisGroups = new AnalysisGroupList(resp.analysisGroups)
		if resp.protocol?
			if resp.protocol not instanceof Protocol
				resp.protocol = new Protocol(resp.protocol)
		resp

	fixCompositeClasses: =>
		if @has('lsLabels')
			if @get('lsLabels') not instanceof LabelList
				@set lsLabels: new LabelList(@get('lsLabels'))
		if @has('lsStates')
			if @get('lsStates') not instanceof ExperimentStateList
				@set lsStates: new ExperimentStateList(@get('lsStates'))
		if @has('analysisGroups')
			if @get('analysisGroups') not instanceof AnalysisGroupList
				@set analysisGroups: new AnalysisGroupList(@get('analysisGroups'))
		if @get('protocol') != null
			if @get('protocol') not instanceof Backbone.Model
				@set protocol: new Protocol(@get('protocol'))

	setupCompositeChangeTriggers: ->
		@get('lsLabels').on 'change', =>
			@trigger 'change'
		@get('lsStates').on 'change', =>
			@trigger 'change'

	copyProtocolAttributes: (protocol) ->
		estates = new ExperimentStateList()
		pstates = protocol.get('lsStates')
		pstates.each (st) ->
			estate = new ExperimentState(_.clone(st.attributes))
			estate.unset 'id'
			estate.unset 'lsTransaction'
			estate.unset 'lsValues'
			evals = new ExperimentValueList()
			svals = st.get('lsValues')
			svals.each (sv) ->
				evalue = new ProtocolValue(sv.attributes)
				evalue.unset 'id'
				evalue.unset 'lsTransaction'
				evals.add(evalue)
			estate.set lsValues: evals
			estates.add(estate)
		@set
			kind: protocol.get('lsKind')
			protocol: protocol
			shortDescription: protocol.get('shortDescription')
			lsStates: estates
		@trigger "protocol_attributes_copied"
		return

	validate: (attrs) ->
		errors = []
		bestName = attrs.lsLabels.pickBestName()
		nameError = false
		if bestName?
			nameError = true
			if bestName.get('labelText') != ""
				nameError = false
		if nameError
			errors.push
				attribute: 'experimentName'
				message: "Experiment name must be set"
		if _.isNaN(attrs.recordedDate)
			errors.push
				attribute: 'recordedDate'
				message: "Experiment date must be set"
		if attrs.recordedBy is ""
			errors.push
				attribute: 'recordedBy'
				message: "Scientist must be set"

#		if attrs.protocol = null
#			errors.push
#				attribute: 'protocol'
#				message: "Protocol must be set"

		if errors.length > 0
			return errors
		else
			return null

class window.ExperimentBaseController extends AbstractFormController
	template: _.template($("#ExperimentBaseView").html())

	events:
		"change .bv_recordedBy": "handleRecordedByChanged"
		"change .bv_shortDescription": "handleShortDescriptionChanged"
		"change .bv_description": "handleDescriptionChanged"
		"change .bv_experimentName": "handleNameChanged"
		"change .bv_recordedDate": "handleDateChanged"
		"click .bv_useProtocolParameters": "handleUseProtocolParametersClicked"
		"change .bv_protocolCode": "handleProtocolCodeChanged"
		"click .bv_recordDateIcon": "handleRecordDateIconClicked"

	initialize: ->
		@model.on 'sync', @render
		@errorOwnerName = 'ExperimentBaseController'
		@setBindings()

	render: =>
		console.log @model
		$(@el).empty()
		$(@el).html @template()
		#@setupProtocolSelect()
		if @model.get('protocol') != null
			@$('.bv_protocolCode').val(@model.get('protocol').get('codeName'))
		@$('.bv_shortDescription').html @model.get('shortDescription')
		@$('.bv_description').html @model.get('description')
		bestName = @model.get('lsLabels').pickBestName()
		if bestName?
			@$('.bv_experimentName').val bestName.get('labelText')
		@$('.bv_recordedBy').val(@model.get('recordedBy'))
		@$('.bv_experimentCode').html(@model.get('codeName'))
		@getAndShowProtocolName()
		@setUseProtocolParametersDisabledState()
		@$('.bv_recordedDate').datepicker( );
		@$('.bv_recordedDate').datepicker( "option", "dateFormat", "yy-mm-dd" );
		if @model.get('recordedDate') != null
			date = new Date(@model.get('recordedDate'))
			@$('.bv_recordedDate').val(date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate())
		@$('.bv_description').html(@getDescriptionValue())

		@

	setupProtocolSelect: ->
		@protocolList = new PickListList()
		@protocolList.url = "api/protocolCodes/filter/FLIPR"
		@protocolListController = new PickListSelectController
			el: @$('.bv_protocolCode')
			collection: @protocolList
			insertFirstOption: new PickList
				code: "unassigned"
				name: "Select Protocol"
			selectedCode: "unassigned"

	setUseProtocolParametersDisabledState: ->
		if (not @model.isNew()) or (@model.get('protocol') == null) or (@$('.bv_protocolCode').val() == "")
			@$('.bv_useProtocolParameters').attr("disabled", "disabled")
		else
			@$('.bv_useProtocolParameters').removeAttr("disabled")

	getAndShowProtocolName: ->
		if @model.get('protocol') != null
			if @model.get('protocol').isStub()
				@model.get('protocol').fetch success: =>
					newProtName = @model.get('protocol').get('lsLabels').pickBestLabel().get('labelText')
					@updateProtocolNameField(newProtName)
					@setUseProtocolParametersDisabledState()
			else
				@updateProtocolNameField(@model.get('protocol').get('lsLabels').pickBestLabel().get('labelText'))
				@setUseProtocolParametersDisabledState()
		else
			@updateProtocolNameField "no protocol selected yet"

	updateProtocolNameField: (protocolName) ->
		@$('.bv_protocolName').html(protocolName)

	getDescriptionValue: ->
		value = @model.get('lsStates').getStateValueByTypeAndKind "metadata", "experiment info", "stringValue", "description"
		desc = ""
		if value != null
			desc = value.get('stringValue')
		desc

	handleRecordedByChanged: =>
		@model.set recordedBy: @$('.bv_recordedBy').val()
		@handleNameChanged()

	handleShortDescriptionChanged: =>
		@model.set shortDescription: @getTrimmedInput('.bv_shortDescription')

	handleDescriptionChanged: =>
		@model.set description:@getTrimmedInput('.bv_description')

	handleNameChanged: =>
		newName = @getTrimmedInput('.bv_experimentName')
		@model.get('lsLabels').setBestName new Label
			labelKind: "experiment name"
			labelText: newName
			recordedBy: @model.get 'recordedBy'
			recordedDate: @model.get 'recordedDate'

	handleDateChanged: =>
		@model.set recordedDate: @convertYMDDateToMs(@getTrimmedInput('.bv_recordedDate'))
		@handleNameChanged()

	handleRecordDateIconClicked: =>
		$( ".bv_recordedDate" ).datepicker( "show" );

	handleProtocolCodeChanged: =>
		code = @$('.bv_protocolCode').val()
		if code == ""
			@model.set 'protocol': null
			@getAndShowProtocolName()
			@setUseProtocolParametersDisabledState()
		else
			$.ajax
				type: 'GET'
				url: "api/protocols/codename/"+code
				success: (json) =>
					if json.length == 0
						@updateProtocolNameField("could not find selected protocol in database")
					else
						@model.set protocol: new Protocol(json[0])
						@getAndShowProtocolName() # this will fetch full protocol
				error: (err) ->
					alert 'got ajax error from api/protocols/codename/ in Exeriment.coffee'
				dataType: 'json'

	handleUseProtocolParametersClicked: =>
		@model.copyProtocolAttributes(@model.get('protocol'))
		@render()
