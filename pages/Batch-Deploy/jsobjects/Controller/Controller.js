export default {
	resultIcon: 'lock',
	resultColour: '#333',

	onPageLoad () {
		AuthUtils.checkValidSession().then(isValid => {
			if (!isValid) {
				navigateTo('Auth');
			}
		});
	},

	getPipelineParams () {
		return {
			TASK: 'batch-deploy',
			BATCH_DEPLOY_ENVIRONMENT: selectEnv.selectedOptionValue,
			BATCH_DEPLOY_TARGETS: selectApps.selectedOptionValues.join(','),
			BATCH_DEPLOY_REFRESH_CONTENT: checkboxRefreshContent.isChecked
		};
	},

	validateForm () {
		const isXYZ = selectEnv.selectedOptionValue === 'xyz';
		if (isXYZ && selectBranch.outputs.selectedValue === 'master') {
			return 'Cannot deploy to XYZ from master';
		}
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
				selectBranch.outputs.selectedValue, 
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
		resultLink.setText(err.message);
		this.resultIcon = constants.icons.FAIL;
		this.resultColour = constants.colours.FAIL;
		resultContainer.setVisibility(true);
	}
}