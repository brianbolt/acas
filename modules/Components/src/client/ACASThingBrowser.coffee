class ThingSearch extends Backbone.Model
	defaults:
		protocolCode: null
		ThingCode: null

class ThingSimpleSearchController extends AbstractFormController
	template: _.template($("#ThingSimpleSearchView").html())
	genericSearchUrl: '/api/advancedSearch/things/'

	events:
		'keyup .bv_thingSearchTerm': 'updateThingSearchTerm'
		'click .bv_doSearch': 'handleDoSearchClicked'

	initialize: (options) ->
		@configs = options.configs

	render: =>
		$(@el).empty()
		templateVariables = 
			thingName: @model.getThingKindDisplayName()
		$(@el).html @template(templateVariables)

	updateThingSearchTerm: (e) =>
		ENTER_KEY = 13
		thingSearchTerm = $.trim(@$(".bv_thingSearchTerm").val())
		if thingSearchTerm isnt ""
			@$(".bv_doSearch").attr("disabled", false)
			if e.keyCode is ENTER_KEY
				$(':focus').blur()
				@handleDoSearchClicked()
		else
			@$(".bv_doSearch").attr("disabled", true)

	handleDoSearchClicked: =>
		@$(".bv_thingTableController").addClass "hide"
		@$(".bv_errorOccurredPerformingSearch").addClass "hide"
		thingSearchTerm = $.trim(@$(".bv_thingSearchTerm").val())
		@$(".bv_exptSearchTerm").val ""
		if thingSearchTerm isnt ""
			@$(".bv_noMatchingThingsFoundMessage").addClass "hide"
			@$(".bv_thingBrowserSearchInstructions").addClass "hide"
			@$(".bv_searchThingsStatusIndicator").removeClass "hide"
			if !window.conf.browser.enableSearchAll and thingSearchTerm is "*"
				@$(".bv_moreSpecificThingSearchNeeded").removeClass "hide"
			else
				@$(".bv_searchingThingsMessage").removeClass "hide"
				@$(".bv_exptSearchTerm").html _.escape(thingSearchTerm)
				@$(".bv_moreSpecificThingSearchNeeded").addClass "hide"
				@doSearch thingSearchTerm

	doSearch: (thingSearchTerm) =>
		# disable the search text field while performing a search
		@$(".bv_thingSearchTerm").attr "disabled", true
		@$(".bv_doSearch").attr "disabled", true
		@trigger 'find'
		unless thingSearchTerm is ""
			defaultQueryTerms =
				queryString: "#{thingSearchTerm}"
				queryDTO:
					lsType: @model.get("lsType")
					lsKind: @model.get("lsKind")
					recordedBy: "#{thingSearchTerm}"
					codeName: {
						operator: "~"
					},
					labels: [ 

					]
					values: [

					]

			queryTerms = @getQueryTerms(defaultQueryTerms, thingSearchTerm)
			$.ajax
				type: 'POST'
				url: "#{@genericSearchUrl}#{@model.get("lsType")}/#{@model.get("lsKind")}?format=nestedfull"
				dataType: 'json',
				contentType: 'application/json'
				data: JSON.stringify(queryTerms)
				success: (thing) =>
					@trigger "searchReturned", thing.results
				error: (result) =>
					@trigger "searchReturned", null
				complete: =>
					# re-enable the search text field regardless of if any results found
					@$(".bv_thingSearchTerm").attr "disabled", false
					@$(".bv_doSearch").attr "disabled", false

	getQueryTerms: (queryTerms, searchTerm) ->
		for queryValue in @configs
			# Code Name and Recorded By are part of the defaults set them as isSearchable false
			if ["codeName", "recordedBy"].includes(queryValue.key)
				queryValue.isSearchable = false
	
			# Default is all display values are searchable so if the attribute is missing or set to
			# anything other than false, then it is searchable
			isSearchable = (!queryValue.isSearchable? || queryValue.isSearchable != false)
			if queryValue.key == "recordedDate"
				@addRecordedDateToQuery(queryTerms, searchTerm)
			else
				#If the key is an ls value
				valDef = @model.getValueInfo(queryValue.key)
				if valDef?
						searchOperator = "~"
						if queryValue.searchOperator?
							searchOperator = queryValue.searchOperator
						queryTerms.queryDTO.values.push	
							stateType: valDef.stateType
							stateKind: valDef.stateKind
							valueType: valDef.type
							valueKind: valDef.kind
							operator: searchOperator
				else
					# If the key is an ls label
					labDef = @model.getLabelInfo(queryValue.key)
					if labDef?
						searchOperator = "~"
						if queryValue.searchOperator?
							operator = queryValue.searchOperator
						queryTerms.queryDTO.labels.push	
							labelType: labDef.type
							labelKind: labDef.kind
							operator: searchOperator
		return queryTerms

	addRecordedDateToQuery: (queryTerms, searchTerm) ->
		# Default search for recordedDate is ISO without time
		# e.g. 2021-06-02
		dateParts = searchTerm .split('-')
		# Offset the user entered date by one month to account for month = 0 in javascript
		if typeof(dateParts[1]) != "undefined"
			dateParts[1] = dateParts[1]-1
		# Create a new date from the parts
		recordedDateGreaterThan = new Date(Date.UTC(...dateParts))

		# If the is a real date
		if !isNaN(recordedDateGreaterThan)
			# Offset a year month, or day depending on the parts the user entered for the less than date
			recordedDateLessThan = new Date(recordedDateGreaterThan.getTime())
			if dateParts.length == 1
				recordedDateLessThan.setFullYear(recordedDateLessThan.getFullYear() + 1);
			else if dateParts.length == 2
				recordedDateLessThan.setMonth(recordedDateLessThan.getMonth() + 1);
			else if dateParts.length == 3
				recordedDateLessThan.setDate(recordedDateLessThan.getDate() + 1)

			# Offset the UTC date by the current offset time
			msUTCOffset = recordedDateGreaterThan.getTimezoneOffset() * 60000
			recordedDateGreaterThan = recordedDateGreaterThan.getTime() + msUTCOffset
			recordedDateLessThan = recordedDateLessThan.getTime() + msUTCOffset

			# Add the recorded date query parameters
			queryTerms.queryDTO.recordedDateGreaterThan=recordedDateGreaterThan
			queryTerms.queryDTO.recordedDateLessThan=recordedDateLessThan

				
class ACASThingBrowserCellController extends Backbone.View
	tagName: 'td'

	initialize: (options) ->
		@configs = options.configs

	render: =>
		$(@el).empty()

		value = @model.get(@configs.key)
		if value instanceof Value
			content = value.escape("value")
			if value.get("lsType") == "dateValue"  && !@configs.formatter?
				content = UtilityFunctions::convertMSToYMDDate(content)
		else if value instanceof Label
			content = value.escape("labelText")
		else
			content = value
		
		if @configs.formatter?
			content = @configs.formatter content

		$(@el).html content
		@

	handleCellClicked: =>
		@trigger 'cellClicked', @collection

class ACASThingBrowserRowSummaryController extends Backbone.View
	tagName: 'tr'
	className: 'dataTableRow'
	events:
		"click": "handleClick"

	handleClick: =>
		@trigger "gotClick", @model
		$(@el).closest("table").find("tr").removeClass "info"
		$(@el).addClass "info"

	initialize: (options)->
		@configs = options.configs

	render: =>
		for config in @configs
			cellController = new ACASThingBrowserCellController
				configs: config
				model: @model

			$(@el).append cellController.render().el
		@

class ThingSummaryTableController extends Backbone.View
	initialize: (options)->
		@configs = options.configs
		@columnFilters = options.columnFilters

	selectedRowChanged: (row) =>
		@trigger "selectedRowUpdated", row

	render: =>
		@template = _.template($('#ThingSummaryTableView').html())
		$(@el).html @template
		for config in @configs
			@$(".bv_firstRow").append("<th style=\"width: 125px;\">#{config.name}</th>")

		# Add empty tr in thead for filter use
		if @columnFilters? && @columnFilters
			for config in @configs
			 	# Remove space from key name
				filterClass = "bv_filter_" + config.key.replace(/\s/g, '')
				@$(".bv_colFilters").append("<th style=\"width: 125px;\" class=\"bv_thingBrowserFilter "+filterClass+"\"></th>")
		
		if @collection.models.length is 0
			@$(".bv_noMatchingThingsFoundMessage").removeClass "hide"
			# display message indicating no results were found
		else
			@$(".bv_noMatchingThingsFoundMessage").addClass "hide"
			@collection.each (thing) =>
				prsc = new ACASThingBrowserRowSummaryController
					model: thing
					configs: @configs
				prsc.on "gotClick", @selectedRowChanged
				@$("tbody").append prsc.render().el

			$.fn.dataTableExt.oApi.fnGetColumnData = (oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty) ->
				# check that we have a column id
				if typeof iColumn == 'undefined'
					return new Array
				# by default we only want unique data
				if typeof bUnique == 'undefined'
					bUnique = true
				# by default we do want to only look at filtered data
				if typeof bFiltered == 'undefined'
					bFiltered = true
				# by default we do not want to include empty values
				if typeof bIgnoreEmpty == 'undefined'
					bIgnoreEmpty = true
				# list of rows which we're going to loop through
				aiRows = undefined
				# use only filtered rows
				if bFiltered == true
					aiRows = oSettings.aiDisplay
				else
					aiRows = oSettings.aiDisplayMaster
				# all row numbers
				# set up data array   
				asResultData = new Array
				i = 0
				c = aiRows.length
				while i < c
					iRow = aiRows[i]
					aData = @fnGetData(iRow)
					sValue = aData[iColumn]
					# ignore empty values?
					if bIgnoreEmpty == true and sValue.length == 0
						i++
						continue
					else if bUnique == true and jQuery.inArray(sValue, asResultData) > -1
						i++
						continue
					else
						asResultData.push sValue
					i++

				# Sort lexicographically before returning
				asResultData.sort (a, b)->
					return a.toLowerCase().localeCompare(b.toLowerCase());
				
			
			fnCreateSelect = (aData) ->
				r = '<select><option value=""></option>'
				i = undefined
				iLen = aData.length
				i = 0
				while i < iLen
					r += '<option value="' + aData[i] + '">' + aData[i] + '</option>'
					i++
				r + '</select>'
				
			oTable = @$("table").dataTable oLanguage:
				sSearch: "Filter results: " #rename summary table's search bar

			if @columnFilters? && @columnFilters
				configs = @configs
				this.$('thead tr.bv_colFilters th').each (i) ->
					# Default is to add a filter to each column
					# So only skip filtering if filter is false
					if !configs[i].filter? || configs[i].filter
						@innerHTML = fnCreateSelect(oTable.fnGetColumnData(i))
						$('select', this).change ->
							oTable.fnFilter "^"+$(this).val()+"$", i, true
							return
						return

		@


class ACASThingBrowserController extends Backbone.View
	events:
		"click .bv_deleteThing": "handleDeleteThingClicked"
		"click .bv_editThing": "handleEditThingClicked"
		"click .bv_confirmDeleteThingButton": "handleConfirmDeleteThingClicked"
		"click .bv_cancelDelete": "handleCancelDeleteClicked"

	initialize: (options)->
		thingModel = new @modelClass
		@configs = @configs
		@columnFilters = @columnFilters
		templateVariables = 
			thingName: thingModel.getThingKindDisplayName()
		template = _.template($("#ThingBrowserView").html())
		$(@el).empty()
		$(@el).html template(templateVariables)
		@searchController = new ThingSimpleSearchController
			model: thingModel
			query: @query
			configs: @configs
			el: @$('.bv_thingSearchController')
		@searchController.render()
		@searchController.on "searchReturned", @setupThingSummaryTable.bind(@)
		@$('.bv_queryToolDisplayName').html window.conf.service.result.viewer.displayName

	setupThingSummaryTable: (things) =>
		@destroyThingSummaryTable()

		$(".bv_searchingThingsMessage").addClass "hide"
		if things is null
			@$(".bv_errorOccurredPerformingSearch").removeClass "hide"

		else if things.length is 0
			@$(".bv_noMatchingThingsFoundMessage").removeClass "hide"
			@$(".bv_thingTableController").html ""
		else
			@$(".bv_searchThingsStatusIndicator").addClass "hide"
			@$(".bv_thingTableController").removeClass "hide"
			thingCollection =  Backbone.Collection.extend 
				model: @modelClass
			@thingSummaryTable = new ThingSummaryTableController
				collection: new thingCollection things
				configs: @configs
				columnFilters: @columnFilters

			@thingSummaryTable.on "selectedRowUpdated", @selectedThingUpdated
			$(".bv_thingTableController").html @thingSummaryTable.render().el

	selectedThingUpdated: (thing) =>
		@$('.bv_thingControllerWrapper').append("<div class='bv_thingController'></div>")
		@trigger "selectedThingUpdated"
		@thingController = new @controllerClass
			el: @$('.bv_thingController')
			model: thing
			readOnly: true

		@thingController.render()
		@$(".bv_thingController").removeClass("hide")
		@$(".bv_thingControllerContainer").removeClass("hide")

		@$('.bv_editThing').show()
		if window.conf.thing?.editingRoles?
			editingRoles = window.conf.thing.editingRoles.split(",")
			if !UtilityFunctions::testUserHasRole(window.AppLaunchParams.loginUser, editingRoles)
				@$('.bv_editThing').hide()

		if window.conf.thing?.deletingRoles?
			deletingRoles= window.conf.thing.deletingRoles.split(",")
			if !UtilityFunctions::testUserHasRole(window.AppLaunchParams.loginUser, deletingRoles)
				@$('.bv_deleteThing').hide()

	handleDeleteThingClicked: =>
		@$(".bv_thingUserName").html @thingController.model.get("codeName")
		@$(".bv_deleteButtons").removeClass "hide"
		@$(".bv_okayButton").addClass "hide"
		@$(".bv_errorDeletingThingMessage").addClass "hide"
		@$(".bv_deleteWarningMessage").removeClass "hide"
		@$(".bv_deletingStatusIndicator").addClass "hide"
		@$(".bv_thingDeletedSuccessfullyMessage").addClass "hide"
		@$(".bv_confirmDeleteThing").removeClass "hide"
		@$('.bv_confirmDeleteThing').modal({
			keyboard: false,
			backdrop: true
		})

	handleConfirmDeleteThingClicked: =>
		@$(".bv_deleteWarningMessage").addClass "hide"
		@$(".bv_deletingStatusIndicator").removeClass "hide"
		@$(".bv_deleteButtons").addClass "hide"
		$.ajax(
			url: "/api/things/#{@thingController.model.get("lsKind")}/#{@thingController.model.get("lsType")}/#{@thingController.model.get("id")}",
			type: 'DELETE',
			success: (result) =>
				@$(".bv_okayButton").removeClass "hide"
				@$(".bv_deletingStatusIndicator").addClass "hide"
				@$(".bv_thingDeletedSuccessfullyMessage").removeClass "hide"
				@searchController.handleDoSearchClicked()
			error: (result) =>
				@$(".bv_okayButton").removeClass "hide"
				@$(".bv_deletingStatusIndicator").addClass "hide"
				@$(".bv_errorDeletingThingMessage").removeClass "hide"
		)

	handleCancelDeleteClicked: =>
		@$(".bv_confirmDeleteThing").modal('hide')

	handleEditThingClicked: =>
		# This relies on the item being configured in the ControllerRedirectConf configuration file
		window.open("/entity/edit/codeName/#{@thingController.model.get("codeName")}",'_blank');

	destroyThingSummaryTable: =>
		if @thingSummaryTable?
			@thingSummaryTable.remove()
		if @thingController?
			@thingController.remove()
		@$(".bv_thingController").addClass("hide")
		@$(".bv_thingControllerContainer").addClass("hide")
		@$(".bv_noMatchingThingsFoundMessage").addClass("hide")

	render: =>

		@
