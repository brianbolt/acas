window.conf={"service":{"preferred":{"batchid":{"path":"/api/preferredBatchId"}},"project":{"path":"/api/projects"},"users":{"path":"/api/users"},"persistence":{"path":"acas/api/v1","host":"tomcat","port":8080,"fullpath":"http://tomcat:8080/acas/api/v1/"},"rapache":{"port":1080,"use":{"ssl":false},"host":"localhost","path":"r-services-api","fullpath":"http://localhost:1080/r-services-api/"},"external":{"structure":{"url":"http://localhost:8080/cmpdreg/structureimage/lot/"},"lotDetails":{"url":"http://localhost:8080/cmpdreg/#lot/"},"preferred":{"batchid":{"type":"NewLineSepBulkPost"}}},"result":{"viewer":{"displayName":"Data Viewer","configuredViewers":"DataViewer","defaultViewer":"DataViewer","liveDesign":{"baseUrl":null,"username":null,"password":null},"simpleSAR":{"baseUrl":null},"seurat":{"protocolPrefix":"http://tomcat:9080/seurat/runseurat?cmd=newjob&AssayName=","experimentPrefix":"&AssayProtocol="},"protocolPrefix":"http://tomcat:9080/seurat/runseurat?cmd=newjob&AssayName=","experimentPrefix":"&AssayProtocol=","experimentNameColumn":"EXPERIMENT_NAME","experimentName":{"invalidCharacters":"\"',"}}},"control":{"tolerance":{"percentage":0.01}},"spotfire":{"host":"dsantsptdxp","path":"/Lead Discovery/HTSWells"},"cmpdReg":{"persistence":{"host":"tomcat","path":"cmpdreg/api/v1","fullpath":"http://tomcat:8080/cmpdreg/api/v1/"}}},"host":"localhost","port":3000,"datafiles":{"downloadurl":{"prefix":"/dataFiles/"}},"use":{"ssl":false},"sar":{"sorting":"includeOperators"},"deployMode":"1.7.0-release","include":{"project":"FALSE"},"path":null,"roologin":{"showpasswordchange":true},"require":{"login":true},"moduleMenus":{"headerName":"ACAS","homePageMessage":"Welcome to ACAS","copyrightMessage":"&copy; John McNeil & Company 2012-2015","summaryStats":false,"modules":{"external":"[{\"displayName\": \"Compound Registration\", \"href\": \"http://localhost:8080/cmpdreg\"},{\"displayName\": \"Seurat\", \"href\": \"http://localhost:9080/seurat\"}, {\"displayName\": \"Compound Registration Bulk Loader\", \"href\": \"http://localhost:3000/CmpdRegBulkLoader\"}, {\"displayName\": \"Data Viewer\", \"href\": \"http://localhost:3000/dataViewer\"}]"}},"leaveACASMessage":"There are no unsaved changes.","scientistCodeOrigin":"ACAS authors","molecularTargetCodeOrigin":"ACAS DDICT","roles":{"htsAdmin":"admin"},"browser":{"enableSearchAll":true},"cmpdReg":{"showProjectSelect":true,"projectName":"ACAS","showFileDate":true},"curvefit":{"modelfitparameter":{"classes":"[{\"code\":\"4 parameter D-R\", \"parametersController\":\"DoseResponseAnalysisParametersController\", \"parametersClass\": \"DoseResponseAnalysisParameters\", \"plotCurveClass\": \"DoseResponsePlotCurveLL4\", \"RSource\":\"public/src/modules/CurveAnalysis/src/server/ll4.R\"}, {\"code\":\"Ki Fit\", \"parametersController\":\"DoseResponseKiAnalysisParametersController\", \"parametersClass\": \"DoseResponseKiAnalysisParameters\", \"plotCurveClass\": \"DoseResponsePlotCurveKi\", \"RSource\":\"public/src/modules/CurveAnalysis/src/server/ki.R\"}]"}},"experiment":{"lockwhenapproved":{"filter":"[{\"lsType\": \"Bio Activity\"}]"}},"entity":{"hideStatuses":"[\"deleted\"]"},"protocol":{"showAssayTreeRule":false}};