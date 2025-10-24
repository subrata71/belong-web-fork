export default {
	resultIcon: 'lock',
	resultColour: '#333',

	async onPageLoad () {
		AuthUtils.checkValidSession().then(isValid => {
			if (!isValid) {
				navigateTo('Auth');
			}
		});
	},

	getPipelineParams () {
		return {
			TASK: 'product-sync',
			PRODUCT_SYNC_ENV: selectEnv.selectedOptionValue,
			PRODUCT_SYNC_CATALOGUE: selectCatalogue.selectedOptionValue,
		};
	},

	async onSubmit() {
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
		resultLink.setText(err.message);
		this.resultIcon = constants.icons.FAIL;
		this.resultColour = constants.colours.FAIL;
		resultContainer.setVisibility(true);
	}
}