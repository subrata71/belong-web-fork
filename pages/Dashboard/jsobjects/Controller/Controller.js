export default {
	deployPage: 'Batch-Deploy',
	projectPath: 'digital/belong-web',
	apiEnvs: ['DEV', 'DEV01', 'DEV02', 'AT', 'AT01', 'AT02', 'SIT', 'PREPROD', 'PRODUCTION', 'SVT'],
	contentfulEnvs: ['PRODUCTION'],
	environments: [
		{ name: 'DEV' },
		{ name: 'DEV01' },
		{ name: 'DEV02' },
		{ name: 'DEV03' },
		{ name: 'DEV06' },
		{ name: 'DEV07' },
		{ name: 'AT' },
		{ name: 'AT01' },
		{ name: 'AT02' },
		{ name: 'SIT' },
		{ name: 'PREPROD' },
		{ name: 'PRODUCTION'},
		{ name: 'SVT' },
		{ name: 'PREVIEW' }
	],	

	verifyAuth() {
		AuthUtils1.checkValidSession().then(isValid => {
			if (!isValid) {
				navigateTo('Auth');
			}
		});
	},

	onPageLoad() {
		this.loadEnv();
	},

	// format the environment + appName
	getEnvironmentName(app) {
		if (!app) {
			return;
		}
		return `${envSelect.selectedOptionValue}/${app}`;
	},

	loadEnv() {
		this.verifyAuth();
		const env = envSelect.selectedOptionValue;

		api.setVisibility(this.apiEnvs.includes(env));
		contentful.setVisibility(this.contentfulEnvs.includes(env));
	}
}