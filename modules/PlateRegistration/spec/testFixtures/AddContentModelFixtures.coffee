validAddContentModel =
  identifierType: "identifierType"
  identifiers: "identifiers"
  volume: 100
  concentration: 5
  fillStrategy: "fillStrategy"
  fillDirection: "fillDirection"
  wells: "wells"
  numberOfIdentifiers: 5
  numberOfCellsSelected: 5

listOfIdentifiers =
  singleIdentifierInput: "Only one identifier here"
  singleIdentifierOutput: ["Only one identifier here"]
  commaSeparatedInput: "TEST1,TEST2,TEST3"
  commaSeparatedInputOutput: ["TEST1,TEST2,TEST3"]
  semicolonSeparatedInput: "TEST1;TEST2;TEST3"
  semicolonSeparatedOutput: [
    "TEST1"
    "TEST2"
    "TEST3"
    ]
  tabSeparatedInput: "TEST1\tTEST2\tTEST3"
  tabSeparatedOutput: [
    "TEST1"
    "TEST2"
    "TEST3"
  ]
  newlineSeparatedInput: "TEST1\nTEST2\nTEST3"
  newlineSeparatedOutput: [
    "TEST1"
    "TEST2"
    "TEST3"
  ]
module.exports =
  validAddContentModel: validAddContentModel
  listOfIdentifiers: listOfIdentifiers