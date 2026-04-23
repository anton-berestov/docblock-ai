const vscode = require('vscode')
const OpenAI = require('openai')

const DOC_FORMATS = {
	php: {
		name: 'PHPDoc',
		check: /function\s+\w+/,
		example: `/**\n * Short description.\n *\n * @param type $name Description\n * @return type\n * @throws ExceptionType Description\n */`,
	},
	javascript: {
		name: 'JSDoc',
		check: /function\s+\w+|=>\s*\{|const\s+\w+\s*=/,
		example: `/**\n * Short description.\n *\n * @param {type} name - Description\n * @returns {type} Description\n * @throws {Error} Description\n */`,
	},
	typescript: {
		name: 'TSDoc',
		check: /function\s+\w+|=>\s*\{|const\s+\w+\s*=/,
		example: `/**\n * Short description.\n *\n * @param name - Description\n * @returns Description\n * @throws Description\n */`,
	},
	python: {
		name: 'Google-style docstring',
		check: /def\s+\w+|class\s+\w+/,
		example: `"""\nShort description.\n\nArgs:\n    name (type): Description.\n\nReturns:\n    type: Description.\n\nRaises:\n    ExceptionType: Description.\n"""`,
	},
	java: {
		name: 'Javadoc',
		check: /(public|private|protected|static)\s+\w+\s+\w+\s*\(/,
		example: `/**\n * Short description.\n *\n * @param name Description\n * @return Description\n * @throws ExceptionType Description\n */`,
	},
	csharp: {
		name: 'XML documentation comment',
		check: /(public|private|protected|static)\s+\w+\s+\w+\s*\(/,
		example: `/// <summary>\n/// Short description.\n/// </summary>\n/// <param name="name">Description</param>\n/// <returns>Description</returns>`,
	},
	go: {
		name: 'GoDoc comment',
		check: /func\s+\w+/,
		example: `// FunctionName does something.\n//\n// It accepts name and returns something.`,
	},
	ruby: {
		name: 'YARD documentation',
		check: /def\s+\w+/,
		example: `# Short description.\n#\n# @param name [Type] Description\n# @return [Type] Description`,
	},
	rust: {
		name: 'Rust doc comment',
		check: /fn\s+\w+/,
		example: `/// Short description.\n///\n/// # Arguments\n///\n/// * \`name\` - Description\n///\n/// # Returns\n///\n/// Description`,
	},
}

const SUPPORTED_LANG_IDS = Object.keys(DOC_FORMATS)

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		'docblock-ai.generateDoc',
		async function () {
			const editor = vscode.window.activeTextEditor
			if (!editor) {
				vscode.window.showInformationMessage('No active editor.')
				return
			}

			const langId = editor.document.languageId
			if (!SUPPORTED_LANG_IDS.includes(langId)) {
				vscode.window.showInformationMessage(
					`DocBlock AI does not support "${langId}" files. Supported: ${SUPPORTED_LANG_IDS.join(', ')}.`,
				)
				return
			}

			const text = editor.document.getText(editor.selection)
			if (!text.trim()) {
				vscode.window.showInformationMessage(
					'Please select a function or method before generating documentation.',
				)
				return
			}

			const format = DOC_FORMATS[langId]
			if (format.check && !format.check.test(text)) {
				vscode.window.showInformationMessage(
					`Selected text does not appear to contain a ${langId} function or method.`,
				)
				return
			}

			await vscode.window.withProgress(
				{
					location: vscode.ProgressLocation.Notification,
					title: 'DocBlock AI: generating documentation…',
					cancellable: true,
				},
				async (_, token) => {
					const doc = await generateDoc(text, langId, token)
					if (doc && doc !== false) {
						await insertDoc(doc, editor)
					}
				},
			)
		},
	)

	context.subscriptions.push(disposable)

	let disposableKey = vscode.commands.registerCommand(
		'docblock-ai.insertApiKey',
		async function () {
			const apiKey = await vscode.window.showInputBox({
				placeHolder: 'Enter your OpenAI API key here',
				prompt: 'Enter your OpenAI API key to use with DocBlock AI',
				ignoreFocusOut: true,
				password: true,
			})

			if (apiKey) {
				const config = vscode.workspace.getConfiguration('docblock-ai')
				await config.update('openaiApiKey', apiKey, vscode.ConfigurationTarget.Global)
				vscode.window.showInformationMessage('OpenAI API key saved successfully.')
			}
		},
	)

	context.subscriptions.push(disposableKey)
}

function deactivate() {}

async function generateDoc(code, langId, cancellationToken) {
	const config = vscode.workspace.getConfiguration('docblock-ai')
	const provider = config.get('provider') || 'openai'
	const docLanguage = config.get('language') || 'English'

	if (provider === 'copilot') {
		return sendToCopilot(code, langId, docLanguage, cancellationToken)
	}
	return sendToOpenAI(code, langId, docLanguage)
}

function buildPrompt(code, langId, docLanguage) {
	const format = DOC_FORMATS[langId]
	return `Return ONLY the ${format.name} documentation comment for the code below.
Write ALL descriptive text in ${docLanguage} language.
Do not include the function code itself — only the documentation comment block.
Use best practices and include all relevant tags (params, return, throws/raises, etc.).

Code:
${code}

Reference format (write content in ${docLanguage}):
${format.example}`
}

async function sendToCopilot(code, langId, docLanguage, cancellationToken) {
	let models
	try {
		models = await vscode.lm.selectChatModels({ vendor: 'copilot' })
	} catch {
		vscode.window.showErrorMessage(
			'GitHub Copilot is not available. Please install and sign in to GitHub Copilot.',
		)
		return false
	}

	if (!models || models.length === 0) {
		vscode.window.showErrorMessage(
			'No Copilot models found. Make sure GitHub Copilot is installed and active.',
		)
		return false
	}

	const model = models[0]
	const prompt = buildPrompt(code, langId, docLanguage)
	const messages = [vscode.LanguageModelChatMessage.User(prompt)]

	try {
		const response = await model.sendRequest(messages, {}, cancellationToken)
		let result = ''
		for await (const chunk of response.text) {
			result += chunk
		}
		return result.trim() || false
	} catch (error) {
		if (error.code === vscode.LanguageModelError.Blocked?.name) {
			vscode.window.showErrorMessage('Request was blocked by Copilot content filter.')
		} else if (error.name === 'Canceled') {
			// user cancelled
		} else {
			vscode.window.showErrorMessage('Copilot error: ' + error.message)
		}
		return false
	}
}

async function sendToOpenAI(code, langId, docLanguage) {
	const config = vscode.workspace.getConfiguration('docblock-ai')
	const apiKey = config.get('openaiApiKey')
	const model = config.get('model') || 'gpt-3.5-turbo'

	if (!apiKey) {
		vscode.window.showInformationMessage(
			'Please configure your OpenAI API key in DocBlock AI settings.',
		)
		return false
	}

	const openai = new OpenAI({ apiKey })
	const prompt = buildPrompt(code, langId, docLanguage)

	try {
		const response = await openai.chat.completions.create({
			model,
			messages: [{ role: 'user', content: prompt }],
		})

		const content = response.choices?.[0]?.message?.content?.trim()
		if (content) return content

		vscode.window.showInformationMessage('Could not generate documentation for this code.')
		return false
	} catch (error) {
		console.error('OpenAI API error:', error)
		vscode.window.showErrorMessage('OpenAI API error: ' + error.message)
		return false
	}
}

async function insertDoc(doc, editor) {
	const start = new vscode.Position(editor.selection.start.line, 0)
	await editor.edit(editBuilder => {
		editBuilder.insert(start, doc + '\n')
	})
}

module.exports = { activate, deactivate }
