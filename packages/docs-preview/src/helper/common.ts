'use-strict';

import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { TextDocument, Uri, window, workspace, Position, commands } from 'vscode';
import { reporter } from './telemetry';

export const output = window.createOutputChannel('docs-preview');

/**
 * Create a posted warning message and applies the message to the log
 * @param {string} message - the message to post to the editor as an warning.
 */
export function postWarning(message: string) {
	window.showWarningMessage(message);
}

/**
 * Create a posted information message and applies the message to the log
 * @param {string} message - the message to post to the editor as an information.
 */
export function postInformation(message: string) {
	window.showInformationMessage(message);
}

/**
 * Create a posted information message and applies the message to the log
 * @param {string} message - the message to post to the editor as an information.
 */
export function postError(message: string) {
	window.showErrorMessage(message);
}

export function hasValidWorkSpaceRootPath(senderName: string) {
	const folderPath = workspace.rootPath;

	if (folderPath == null) {
		postWarning(
			`The ${senderName} command requires an active workspace. Please open VS Code from the root of your clone to continue.`
		);
		return false;
	}

	return true;
}

/**
 * Create timestamp
 */
export function generateTimestamp() {
	const date = new Date(Date.now());
	return {
		msDateValue: date.toLocaleDateString('en-us'),
		msTimeValue: date.toLocaleTimeString([], { hour12: false })
	};
}

/**
 * Return repo name
 * @param Uri
 */
export function getRepoName(workspacePath: Uri) {
	const repo = workspace.getWorkspaceFolder(workspacePath);
	if (repo) {
		const repoName = repo.name;
		return repoName;
	}
}

export function sendTelemetryData(telemetryCommand: string, commandOption: string) {
	const editor = window.activeTextEditor;
	const workspaceUri = editor.document.uri;
	const activeRepo = getRepoName(workspaceUri);
	const telemetryProperties = activeRepo
		? { command_option: commandOption, repo_name: activeRepo }
		: { command_option: commandOption, repo_name: '' };
	reporter.sendTelemetryEvent(telemetryCommand, telemetryProperties);
}

export function isMarkdownFile(document: TextDocument) {
	return document.languageId === 'markdown'; // prevent processing of own documents
}

export function isYamlFile(document: TextDocument) {
	return document.languageId === 'yaml' || document.languageId === 'yml'; // prevent processing of own documents
}

export function tryFindFile(rootPath: string, fileName: string) {
	try {
		const fullPath = path.resolve(rootPath, fileName);
		const exists = fs.existsSync(fullPath);
		if (exists) {
			return fullPath;
		} else {
			const files = glob.sync(`**/**/${fileName}`, {
				cwd: rootPath
			});
			if (files) {
				return path.join(rootPath, files[0]);
			}
		}
	} catch (error) {
		postError(error.toString());
	}

	postWarning(`Unable to find a file named "${fileName}", recursively at root "${rootPath}".`);
	return undefined;
}

export function inline_plugin(md, name, options) {
	options = options || {};
	const marker_str = options.marker;
	const render = options.render;
	const tripleColon = ':::';
	function nolocContainer(state, silent) {
		let pos = state.pos;
		if (state.src.charAt(pos) !== marker_str) {
			return false;
		}
		pos++;
		if (state.src.charAt(pos) !== marker_str) {
			return false;
		}
		pos++;
		if (state.src.charAt(pos) !== marker_str) {
			return false;
		}
		pos++;
		const markup = state.src.slice(state.pos, pos);

		const endOfContainer = state.src.indexOf(tripleColon, pos);
		if (endOfContainer !== -1) {
			const params = state.src.slice(state.pos, endOfContainer + 3);

			if (!params.startsWith(`:::${name}`)) {
				return false;
			}

			if (!silent) {
				const token = state.push(`${name}_container`, name, 0);
				token.info = params;
			}
			state.pos = endOfContainer + 3;
			return true;
		}

		if (!silent) {
			state.pending += markup;
		}
		state.pos = pos;
		return true;
	}

	md.inline.ruler.push(`${name}_container`, nolocContainer, {
		alt: []
	});
	md.renderer.rules[`${name}_container`] = render;
}
