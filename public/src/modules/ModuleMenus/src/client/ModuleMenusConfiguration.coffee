window.ModuleMenusConfiguration =
	[
		isHeader: true
		menuName: "Load Data"
	,
		isHeader: false
		menuName: "Load Experiment"
		mainControllerClassName: "GenericDataParserController"
		autoLaunchName:"generic_data_parser"
	,
		isHeader: false
		menuName: "Load Experiment (permission test)"
		mainControllerClassName: "GenericDataParserController"
		requireUserRoles: ["admin", "loadData"]
	,
		isHeader: false
		menuName: "Dose-Response Fit"
		mainControllerClassName: "DoseResponseFitWorkflowController"
	,
		isHeader: false
		menuName: "Protocol Base"
		mainControllerClassName: "ProtocolBaseController"
		autoLaunchName:"protocol_base"
	,
		isHeader: false
		menuName: "Primary Screen Protocol"
		mainControllerClassName: "PrimaryScreenProtocolModuleController"
		autoLaunchName:"primary_screen_protocol"
	,
		isHeader: false
		menuName: "Experiment Base"
		mainControllerClassName: "ExperimentBaseController"
		autoLaunchName:"experiment_base"
	,
		isHeader: false
		menuName: "Analyze FLIPR Data"
		mainControllerClassName: "PrimaryScreenExperimentController"
		autoLaunchName:"flipr_screening_assay"
	,
		isHeader: false
		menuName: "Analyze KD Data"
		mainControllerClassName: "DNSKDPrimaryScreenExperimentController"
		autoLaunchName:"dnskd_screening_assay"
	,
		isHeader: false
		menuName: "Cationic Block"
		mainControllerClassName: "CationicBlockController"
		autoLaunchName:"cationic_block"
	,
		isHeader: false
		menuName: "Linker Small Molecule"
		mainControllerClassName: "LinkerSmallMoleculeController"
		autoLaunchName:"linker_small_molecule"
	,
		isHeader: false
		menuName: "Protein"
		mainControllerClassName: "ProteinController"
		autoLaunchName:"protein"
	,
		isHeader: false
		menuName: "Spacer"
		mainControllerClassName: "SpacerController"
		autoLaunchName:"spacer"
	,
		isHeader: false
		menuName: "Internalization Agent"
		mainControllerClassName: "InternalizationAgentController"
		autoLaunchName:"internalization_agent"
	,
		isHeader: false
		menuName: "Attach File"
		mainControllerClassName: "AttachFileListController"
		autoLaunchName:"attach_file"
	,
		isHeader: true
		menuName: "Inventory"
	,
		isHeader: false
		menuName: "Load Containers From SDF"
		mainControllerClassName: "BulkLoadContainersFromSDFController"
	,
		isHeader: false
		menuName: "Load Sample Transfer Log"
		mainControllerClassName: "BulkLoadSampleTransfersController"
	,
		isHeader: true
		menuName: "Search and Edit"
	,
		isHeader: false, menuName: "Experiment Browser"
		mainControllerClassName: "ExperimentBrowserController"
	,
		isHeader: true
		menuName: "Admin"
	,
		isHeader: false, menuName: "Logging"
		mainControllerClassName: "LoggingController"
	]

