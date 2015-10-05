window.conf={"service":{"preferred":{"batchid":{"path":"/api/preferredBatchId"}},"project":{"path":"/api/projects"},"users":{"path":"/api/users"},"persistence":{"path":"acas/api/v1","host":"host5.labsynch.com","port":8080,"fullpath":"http://host5.labsynch.com:8080/acas/api/v1/"},"rapache":{"port":1080,"use":{"ssl":false},"host":"192.168.99.100","path":"r-services-api","fullpath":"http://192.168.99.100:1080/r-services-api/"},"external":{"structure":{"url":"http://host4.labsynch.com:8080/cmpdreg/structureimage/lot/"},"lotDetails":{"url":"http://192.168.99.100:8080/cmpdreg/#lot/"},"preferred":{"batchid":{"type":"NewLineSepBulkPost"}}},"result":{"viewer":{"protocolPrefix":"http://host5.labsynch.com:9080/seurat/runseurat?cmd=newjob&AssayName=","experimentPrefix":"&AssayProtocol=","experimentNameColumn":"EXPERIMENT_NAME","experimentName":{"invalidCharacters":"\"',"}}},"control":{"tolerance":{"percentage":0.01}},"spotfire":{"host":"dsantsptdxp","path":"/Lead Discovery/HTSWells"},"cmpdReg":{"persistence":{"host":"host5.labsynch.com","path":"cmpdreg/api/v1","fullpath":"http://host5.labsynch.com:8080/cmpdreg/api/v1/"}}},"host":"192.168.99.100","port":3000,"datafiles":{"downloadurl":{"prefix":"/dataFiles/"}},"use":{"ssl":false},"sar":{"sorting":"includeOperators"},"deployMode":"Dev","include":{"project":"FALSE"},"path":null,"roologin":{"showpasswordchange":true},"require":{"login":true},"moduleMenus":{"headerName":"ACAS","homePageMessage":"Welcome to ACAS","copyrightMessage":"&copy; John McNeil & Company 2012-2015","summaryStats":false,"modules":{"external":"[{\"displayName\": \"Gene ID Query Test\", \"href\": \"/GeneIDQuery\"},{\"displayName\": \"Test module\", \"href\": \"http://www.yahoo.com\"}]"}},"leaveACASMessage":"There are no unsaved changes.","scientistCodeOrigin":"ACAS authors","molecularTargetCodeOrigin":"ACAS DDICT","roles":{"htsAdmin":"admin"},"browser":{"enableSearchAll":true},"cmpdReg":{"showProjectSelect":true,"projectName":"ACAS"},"curvefit":{"modelfitparameter":{"classes":"[{\"code\":\"4 parameter D-R\", \"parametersController\":\"DoseResponseAnalysisParametersController\", \"parametersClass\": \"DoseResponseAnalysisParameters\", \"plotCurveClass\": \"DoseResponsePlotCurveLL4\", \"RSource\":\"public/src/modules/CurveAnalysis/src/server/ll4.R\"}, {\"code\":\"Ki Fit\", \"parametersController\":\"DoseResponseKiAnalysisParametersController\", \"parametersClass\": \"DoseResponseKiAnalysisParameters\", \"plotCurveClass\": \"DoseResponsePlotCurveKi\", \"RSource\":\"public/src/modules/CurveAnalysis/src/server/ki.R\"}]"}},"experiment":{"lockwhenapproved":{"filter":"[{\"lsType\": \"Bio Activity\"}]"}},"entity":{"hideStatuses":"[\"deleted\"]"}};