############################################################################
# models
############################################################################
class CodeTablesAdminSearch extends Backbone.Model
	defaults:
		codeType: null
		codeKind: null
		name: null
		code: null
		id: null

############################################################################
class CodeTablesAdminList extends Backbone.Collection
	model: CodeTablesAdminSearch

############################################################################
# controllers
############################################################################
class CodeTablesAdminSimpleSearchController extends AbstractFormController
	###
  	Instantiating controller must provide urlRoot and toDisplay in options
	###

	initialize: (options) ->
		@options = options
		@searchUrl = ""
		@searchUrl = @options.urlRoot + '/search/'

	events:
		'keyup .bv_codeTablesAdminSearchTerm': 'updateCodeTablesAdminSearchTerm'
		'click .bv_doSearch': 'handleDoSearchClicked'
		"click .bv_createNewCodeTablesAdminBtn": "handleCreateNewCodeTablesAdminClicked"

	render: =>
		console.log "rendering SimpleSearchController"
		template = _.template($("#CodeTablesAdminSimpleSearchView").html())
		$(@el).empty()
		console.log @options.toDisplay
		$(@el).html(template(@options.toDisplay))
		@

	updateCodeTablesAdminSearchTerm: (e) =>
		ENTER_KEY = 13
		codeTablesAdminSearchTerm = $.trim(@$(".bv_codeTablesAdminSearchTerm").val())
		if codeTablesAdminSearchTerm isnt ""
			@$(".bv_doSearch").attr("disabled", false)
			if e.keyCode is ENTER_KEY
				$(':focus').blur()
				@trigger 'searchRequested'
		else
			@$(".bv_doSearch").attr("disabled", true)

	doSearch: (codeTablesAdminSearchTerm) =>
# disable the search text field while performing a search
		@$(".bv_codeTablesAdminSearchTerm").attr "disabled", true
		@$(".bv_doSearch").attr "disabled", true
		@trigger 'find'
		unless codeTablesAdminSearchTerm is ""
			$.ajax
				type: 'GET'
				url: @searchUrl + codeTablesAdminSearchTerm
				dataType: "json"
				data:
					testMode: false

#fullObject: true
				success: (codeTablesAdmin) =>
					@trigger "searchReturned", codeTablesAdmin
				error: (result) =>
					@trigger "searchReturned", null
				complete: =>
# re-enable the search text field regardless of if any results found
					@$(".bv_codeTablesAdminSearchTerm").attr "disabled", false
					@$(".bv_doSearch").attr "disabled", false

	handleCreateNewCodeTablesAdminClicked: =>
		@trigger 'createNewCodeTablesAdmin'

############################################################################
class CodeTablesAdminRowSummaryController extends Backbone.View
	tagName: 'tr'
	className: 'dataTableRow'
	events:
		"click": "handleClick"

	handleClick: =>
		@trigger "gotClick", @model
		$(@el).closest("table").find("tr").removeClass "info"
		$(@el).addClass "info"

	initialize: ->
		@template = _.template($('#CodeTablesAdminRowSummaryView').html())
		if @options.showIgnore?
			@showIgnore = @options.showIgnore
		else
			@showIgnore = false

	render: =>
		toDisplay =
			code: @model.get('code')
			name: @model.get('name')

		$(@el).html(@template(toDisplay))
		if @showIgnore
			ignored = if @model.get('ignored')? then @model.get('ignored') else false

			@$(".bv_codeTablesAdminIgnore").show()
			@$(".bv_codeTablesAdminIgnore").html ignored.toString()
		else
			@$(".bv_codeTablesAdminIgnore").hide()
		@

############################################################################
class CodeTablesAdminSummaryTableController extends Backbone.View
	initialize: (options) ->
		@options = options
		if @options.showIgnore?
			@showIgnore = @options.showIgnore
		else
			@showIgnore = false

	selectedRowChanged: (row) =>
		@trigger "selectedRowUpdated", row

	render: =>
		@template = _.template($('#CodeTablesAdminSummaryTableView').html())
		$(@el).html @template(@options.toDisplay)
		#will always be instantiated with at least one model in collection
		@collection.each (admin) =>
			prsc = new CodeTablesAdminRowSummaryController
				model: admin
				showIgnore: @showIgnore
			prsc.on "gotClick", @selectedRowChanged
			@$("tbody").append prsc.render().el

		@$("table").dataTable oLanguage:
			sSearch: "Filter results: " #rename summary table's search bar

		if @showIgnore
			@$(".bv_ignoredHeader").show()
		else
			@$(".bv_ignoredHeader").hide()

		@

############################################################################
class AbstractCodeTablesAdminBrowserController extends Backbone.View
	###
  	Instantiating controller must provide:
  		codeType
  		entityClass
  		entityControllerClass
  		moduleLaunchName
  ###
	includeDuplicateAndEdit: false
	events:
		"click .bv_deleteCodeTablesAdmin": "handleDeleteCodeTablesAdminClicked"
		"click .bv_editCodeTablesAdmin": "handleEditCodeTablesAdminClicked"
		"click .bv_confirmDeleteCodeTablesAdminButton": "handleConfirmDeleteCodeTablesAdminClicked"
		"click .bv_cancelDelete": "handleCancelDeleteClicked"


	initialize: ->
		template = _.template( $("#AbstractCodeTablesAdminBrowserView").html());
		$(@el).empty()
		@toDisplay =
			displayName: @displayName
			pluralDisplayName: @pluralDisplayName
			upperDisplayName: @upperDisplayName
			upperPluralDisplayName: @upperPluralDisplayName
		$(@el).html(template(@toDisplay))
		unless @showIgnore?
			@showIgnore = false
		@searchController = new CodeTablesAdminSimpleSearchController
			model: new CodeTablesAdminSearch()
			el: @$('.bv_codeTablesAdminSearchController')
			urlRoot: "/api/codeTablesAdmin/#{@codeType}/#{@codeKind}"
			toDisplay: @toDisplay
		@searchController.render()
		@searchController.on "searchRequested", @handleSearchRequested.bind(@)
		@searchController.on "searchReturned", @setupCodeTablesAdminSummaryTable.bind(@)
		@searchController.on "createNewCodeTablesAdmin", @handleCreateNewCodeTablesAdminClicked.bind(@)
	#@searchController.on "resetSearch", @destroyCodeTablesAdminSummaryTable

	setupCodeTablesAdminSummaryTable: (codeTablesAdmins) =>
		@destroyCodeTablesAdminSummaryTable()

		@$(".bv_searchingCodeTablesAdminsMessage").addClass "hide"
		if codeTablesAdmins is null
			@$(".bv_errorOccurredPerformingSearch").removeClass "hide"

		else if codeTablesAdmins.length is 0
			@$(".bv_noMatchingCodeTablesAdminsFoundMessage").removeClass "hide"
			@$(".bv_codeTablesAdminTableController").html ""
		else
			@$(".bv_searchCodeTablesAdminsStatusIndicator").addClass "hide"
			@$(".bv_codeTablesAdminTableController").removeClass "hide"
			@codeTablesAdminSummaryTable = new CodeTablesAdminSummaryTableController
				collection: new CodeTablesAdminList codeTablesAdmins
				toDisplay: @toDisplay
				showIgnore: @showIgnore

			@codeTablesAdminSummaryTable.on "selectedRowUpdated", @selectedCodeTablesAdminUpdated
			@$(".bv_codeTablesAdminTableController").html @codeTablesAdminSummaryTable.render().el

	selectedCodeTablesAdminUpdated: (codeTablesAdmin) =>
		@trigger "selectedCodeTablesAdminUpdated"
		if @codeTablesAdminController?
			@codeTablesAdminController.undelegateEvents()
		@codeTablesAdminController = new window[@entityControllerClass]
			model: new window[@entityClass] codeTablesAdmin.attributes
			readOnly: true

		@$('.bv_codeTablesAdminController').html @codeTablesAdminController.render().el
		@$(".bv_codeTablesAdminController").removeClass("hide")
		@$(".bv_codeTablesAdminControllerContainer").removeClass("hide")
		@$('.bv_editCodeTablesAdmin').show()
		@$('.bv_deleteCodeTablesAdmin').show()

	handleSearchRequested: =>
		@$(".bv_codeTablesAdminTableController").addClass "hide"
		@$(".bv_errorOccurredPerformingSearch").addClass "hide"
		codeTablesAdminSearchTerm = $.trim(@$(".bv_codeTablesAdminSearchTerm").val())
		if codeTablesAdminSearchTerm isnt ""
			@$(".bv_noMatchingCodeTablesAdminsFoundMessage").addClass "hide"
			@$(".bv_codeTablesAdminBrowserSearchInstructions").addClass "hide"
			@$(".bv_searchCodeTablesAdminsStatusIndicator").removeClass "hide"
			if !window.conf.browser.enableSearchAll and codeTablesAdminSearchTerm is "*"
				@$(".bv_moreSpecificCodeTablesAdminSearchNeeded").removeClass "hide"
			else
				@$(".bv_searchingCodeTablesAdminsMessage").removeClass "hide"
				@$(".bv_codeTablesAdminSearchTerm").html _.escape(codeTablesAdminSearchTerm)
				@$(".bv_moreSpecificCodeTablesAdminSearchNeeded").addClass "hide"
				@searchController.doSearch codeTablesAdminSearchTerm
		
	handleDeleteCodeTablesAdminClicked: =>
		@$(".bv_codeTablesAdminCodeName").html @codeTablesAdminController.model.escape("code")
		@$(".bv_deleteButtons").removeClass "hide"
		@$(".bv_okayButton").addClass "hide"
		@$(".bv_errorDeletingCodeTablesAdminMessage").addClass "hide"
		@$(".bv_deleteWarningMessage").removeClass "hide"
		@$(".bv_deletingStatusIndicator").addClass "hide"
		@$(".bv_codeTablesAdminDeletedSuccessfullyMessage").addClass "hide"
		@$(".bv_confirmDeleteCodeTablesAdmin").removeClass "hide"
		@$('.bv_confirmDeleteCodeTablesAdmin').modal({
			keyboard: false,
			backdrop: true
		})

	handleConfirmDeleteCodeTablesAdminClicked: =>
		@$(".bv_deleteWarningMessage").addClass "hide"
		@$(".bv_deletingStatusIndicator").removeClass "hide"
		@$(".bv_deleteButtons").addClass "hide"
		$.ajax(
			url: "/api/codeTablesAdmin/#{@codeTablesAdminController.model.get("id")}",
			type: 'DELETE',
			success: (result) =>
				@$(".bv_okayButton").removeClass "hide"
				@$(".bv_deletingStatusIndicator").addClass "hide"
				@$(".bv_codeTablesAdminDeletedSuccessfullyMessage").removeClass "hide"
				@handleSearchRequested()
			error: (result) =>
				@$(".bv_okayButton").removeClass "hide"
				@$(".bv_deletingStatusIndicator").addClass "hide"
				@$(".bv_errorDeletingCodeTablesAdminMessage").removeClass "hide"
		)

	handleCancelDeleteClicked: =>
		@$(".bv_confirmDeleteCodeTablesAdmin").modal('hide')

	handleEditCodeTablesAdminClicked: =>
		@createCodeTablesAdminController @codeTablesAdminController.model

	destroyCodeTablesAdminSummaryTable: =>
		if @codeTablesAdminSummaryTable?
			@codeTablesAdminSummaryTable.remove()
		if @codeTablesAdminController?
			@codeTablesAdminController.remove()
			
		@$(".bv_codeTablesAdminController").addClass("hide")
		@$(".bv_codeTablesAdminControllerContainer").addClass("hide")
		@$(".bv_noMatchingCodeTablesAdminsFoundMessage").addClass("hide")

	render: =>
		@

	handleCreateNewCodeTablesAdminClicked: =>
		@createCodeTablesAdminController new window[@entityClass]()

	createCodeTablesAdminController: (mdl) =>
		@$('.bv_codeTablesAdminBrowserWrapper').hide()
		@$('.bv_codeTablesAdminControllerWrapper').show()
		if @codeTablesAdminController?
			@codeTablesAdminController.undelegateEvents()
			@$(".bv_codeTablesAdminControllerWrapper").html ""
		@codeTablesAdminController = new window[@entityControllerClass]
			model: mdl
		@codeTablesAdminController.on 'backToBrowser', @handleBackToCodeTablesAdminBrowserClicked
		@codeTablesAdminController.on 'amDirty', =>
			@trigger 'amDirty'
		@codeTablesAdminController.on 'amClean', =>
			@trigger 'amClean'
		@$(".bv_codeTablesAdminControllerWrapper").append @codeTablesAdminController.render().el
		@codeTablesAdminController.$('.bv_backToCodeTablesAdminBrowserBtn').show()

	handleBackToCodeTablesAdminBrowserClicked: =>
		@$('.bv_codeTablesAdminBrowserWrapper').show()
		@$('.bv_codeTablesAdminControllerWrapper').hide()
		@handleSearchRequested()
		@trigger 'amClean'
