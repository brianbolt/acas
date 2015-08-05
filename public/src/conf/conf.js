window.conf={"service":{"preferred":{"batchid":{"path":"/api/preferredBatchId"}},"project":{"path":"/api/projects"},"users":{"path":"/api/users"},"persistence":{"path":"acas/api/v1","host":"172.17.0.8","port":8080,"fullpath":"http://172.17.0.8:8080/acas/api/v1/"},"rapache":{"port":1080,"use":{"ssl":false},"host":"localhost","path":"r-services-api","fullpath":"http://localhost:1080/r-services-api/"},"result":{"viewer":{"protocolPrefix":"http://172.17.0.8:9080/seurat/runseurat?cmd=newjob&AssayName=","experimentPrefix":"&AssayProtocol=","experimentNameColumn":"EXPERIMENT_NAME","experimentName":{"invalidCharacters":"\"',"}}},"control":{"tolerance":{"percentage":0.01}},"external":{"preferred":{"batchid":{"type":"LabSynchCmpdReg"}}},"rshiny":{"host":"172.17.0.8","path":"fred","port":3838,"fullpath":"http://172.17.0.8:3838/fred"},"spotfire":{"host":"dsantsptdxp","path":"/Lead Discovery/HTSWells"}},"host":"localhost","port":3000,"deployMode":"sar","include":{"project":"FALSE"},"path":null,"use":{"ssl":false},"roologin":{"showpasswordchange":true},"require":{"login":true},"datafiles":{"downloadurl":{"prefix":"/dataFiles/"}},"moduleMenus":{"headerName":"ACAS","homePageMessage":"Welcome to ACAS","copyrightMessage":"&copy; John McNeil & Company 2012-2015","summaryStats":true},"leaveACASMessage":"There are no unsaved changes.","scientistCodeOrigin":"ACAS authors","molecularTargetCodeOrigin":"ACAS DDICT","roles":{"htsAdmin":"admin"},"browser":{"enableSearchAll":true},"curvefit":{"modelfitparameter":{"classes":"[{\"code\":\"4 parameter D-R\", \"parametersController\":\"DoseResponseAnalysisParametersController\", \"parametersClass\": \"DoseResponseAnalysisParameters\", \"plotCurveClass\": \"DoseResponsePlotCurveLL4\", \"RSource\":\"public/src/modules/CurveAnalysis/src/server/ll4.R\"}, {\"code\":\"Ki Fit\", \"parametersController\":\"DoseResponseKiAnalysisParametersController\", \"parametersClass\": \"DoseResponseKiAnalysisParameters\", \"plotCurveClass\": \"DoseResponsePlotCurveKi\", \"RSource\":\"public/src/modules/CurveAnalysis/src/server/ki.R\"}]"}},"experiment":{"lockwhenapproved":{"filter":"[{\"lsType\": \"Bio Activity\"}]"}},"entity":{"hideStatuses":"[\"deleted\"]"}};