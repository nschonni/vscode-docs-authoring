const markdownlint = require('markdownlint');
const column = require('../rules/column');
const errorDetailStrings = require('../rules/strings');

test('Column markdown lint', () => {
	const src = `${__dirname}/test-content/column.md`;
	let results = markdownlint.sync({
		customRules: column,
		files: [src]
	});
	expect(results[src]).toEqual([
		{
			lineNumber: 7,
			ruleNames: ['DOCSMD003', 'docsmd.column'],
			ruleDescription: 'column linting.',
			ruleInformation: null,
			errorDetail: errorDetailStrings.contenSpanAttribute,
			errorContext: ':::column robot="abc":::',
			errorRange: null
		},
		{
			lineNumber: 13,
			ruleNames: ['DOCSMD003', 'docsmd.column'],
			ruleDescription: 'column linting.',
			ruleInformation: null,
			errorDetail: errorDetailStrings.contenSpanAttribute,
			errorContext: ':::column Span="abc":::',
			errorRange: null
		},
		{
			lineNumber: 25,
			ruleNames: ['DOCSMD003', 'docsmd.column'],
			ruleDescription: 'column linting.',
			ruleInformation: null,
			errorContext: ':::column:::',
			errorDetail: errorDetailStrings.columnEndTagRequired,
			errorRange: null
		}
	]);
});
