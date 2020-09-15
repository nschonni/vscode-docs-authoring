const markdownlint = require('markdownlint');
const moniker = require('../rules/moniker');
const errorDetailStrings = require('../rules/strings');
const monikerLinting = 'moniker linting.';
test('Moniker markdown lint', () => {
	const src = `${__dirname}/test-content/moniker.md`;
	let results = markdownlint.sync({
		customRules: moniker,
		files: [src]
	});
	expect(results[src]).toEqual([
		{
			lineNumber: 3,
			ruleNames: ['DOCSMD006', 'docsmd.moniker'],
			ruleDescription: monikerLinting,
			ruleInformation: null,
			errorDetail: errorDetailStrings.monikerRange,
			errorContext: ':::moniker',
			errorRange: null
		},
		{
			lineNumber: 18,
			ruleNames: ['DOCSMD006', 'docsmd.moniker'],
			ruleDescription: monikerLinting,
			ruleInformation: null,
			errorDetail: errorDetailStrings.monikerRange,
			errorContext: '::: moniker range=""',
			errorRange: null
		},
		{
			lineNumber: 28,
			ruleNames: ['DOCSMD006', 'docsmd.moniker'],
			ruleDescription: monikerLinting,
			ruleInformation: null,
			errorDetail: errorDetailStrings.monikerEndTagRequired,
			errorContext: '::: moniker range="<="',
			errorRange: null
		},
		{
			lineNumber: 32,
			ruleNames: ['DOCSMD006', 'docsmd.moniker'],
			ruleDescription: monikerLinting,
			ruleInformation: null,
			errorDetail: errorDetailStrings.monikerEndTagRequired,
			errorContext: '::: moniker robot="abc"',
			errorRange: null
		}
	]);
});
