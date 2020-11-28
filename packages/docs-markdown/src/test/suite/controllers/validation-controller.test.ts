import * as chai from 'chai';
import { commands } from 'vscode';
import * as common from '../../../helper/common';
import * as telemetry from '../../../helper/telemetry';
import { sleep } from '../../test.common/common';

import sinon = require('sinon');
import { validateRepository } from '../../../controllers/validation-controller';

const expect = chai.expect;

suite.only('Validation Controller', () => {
	teardown(() => {
		chai.spy.restore(common);
	});
	suiteTeardown(async () => {
		await commands.executeCommand('workbench.action.closeAllEditors');
		sinon.restore();
	});
	suiteSetup(() => {
		sinon.stub(telemetry, 'sendTelemetryData');
	});
	test('validateRepository - checkExtensionInstalled', async () => {
		const spy = chai.spy.on(common, 'checkExtensionInstalled');
		validateRepository();
		await sleep(100);
		expect(spy).to.have.been.called();
	});
});
