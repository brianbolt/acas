_ = require('lodash')
Backbone = require('backbone')
PickListList = require('./SelectList.coffee').PickListList

PLATE_DEFINITION_COLLECTION_CONST =
  URL: "/api/containers/definition%20container/plate?format=codetable"


class PlateDefinitionCollection extends PickListList
  url: ->
    PLATE_DEFINITION_COLLECTION_CONST.URL

module.exports =
  PlateDefinitionCollection: PlateDefinitionCollection
  PLATE_DEFINITION_COLLECTION_CONST: PLATE_DEFINITION_COLLECTION_CONST