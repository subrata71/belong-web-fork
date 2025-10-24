export default {
	resultIcon: 'lock',
	resultColour: '#333',
	isBranchSelectDisabled: true,

	onPageLoad () {
		AuthUtils.checkValidSession().then(isValid => {
			if (!isValid) {
				navigateTo('Auth');
			}
		});
	},

	onReleaseTypeChange () {
		// keep branch select disabled for releases
		this.isBranchSelectDisabled = selectReleaseType.selectedOptionValue != 'hotfix';
	},

	getPipelineParams () {
		return {
			TASK: 'create-release',
			CREATE_RELEASE_APP: selectApp.selectedOptionValue,
			CREATE_RELEASE_TYPE: selectReleaseType.selectedOptionValue,
			CREATE_RELEASE_BASE: selectBaseBranch.outputs.selectedValue
		};
	},

	validateForm () {
		const branch = selectBaseBranch.outputs.selectedValue;
		const app = selectApp.selectedOptionValue;
		if (!branch) {
			return 'No release branch selected for hotfix';
		}
		if (!new RegExp(`^release/${app}/`, 'i').test(branch)) {
			return 'Base branch must be a previous release for the same app';
		}
		return true;
	},

	async onSubmit() {
		const message = this.validateForm();
		if (message) {
			this.onFailure({ message });
			return;
		}

		try {
			const response = await GitUtils.createPipeline(
				constants.projectId, 
				'master', 
				this.getPipelineParams()
			);
			this.onSuccess(response);

		} catch (err) {
			this.onFailure(err);
		}
	},

	onSuccess(response) {		
		resultTitle.setText('Pipeline triggered successfully');
		resultLink.setText(`<a href="${response.web_url}" target="_blank">View Pipeline #${response.iid}</a>`);
		this.resultIcon = constants.icons.SUCCESS;
		this.resultColour = constants.colours.SUCCESS;
		resultContainer.setVisibility(true);
	},

	onFailure(err) {
		console.error('Failed to trigger pipeline', err);

		resultTitle.setText('Trigger failed');
		resultLink.setText(err.message.toString);
		this.resultIcon = constants.icons.FAIL;
		this.resultColour = constants.colours.FAIL;
		resultContainer.setVisibility(true);
	}
}