const vscode = require('vscode')
const OpenAI = require('openai')

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		'phpdoc-ai-generator.generatePHPDoc',
		async function () {
			const editor = vscode.window.activeTextEditor
			if (!editor) {
				vscode.window.showInformationMessage('No PHP function selected.')
				return
			}

			if (editor.document.languageId !== 'php') {
				vscode.window.showInformationMessage(
					'PHPDoc AI Generator can only be used with PHP files.',
				)
				return
			}

			const text = getText(editor)
			if (!text || !text.includes('function')) {
				vscode.window.showInformationMessage(
					'Please select a PHP function or method before generating PHPDoc.',
				)
				return
			}

			const phpDoc = await send2GPT(text)
			if (phpDoc && phpDoc !== false && phpDoc !== 'False') {
				await insertPHPDoc(phpDoc, editor)
			}
		},
	)

	context.subscriptions.push(disposable)

	let disposableKey = vscode.commands.registerCommand(
		'phpdoc-ai-generator.insertApiKey',
		async function () {
			const apiKey = await vscode.window.showInputBox({
				placeHolder: 'Enter your OpenAI API key here',
				prompt: 'Enter your OpenAI API key to use with PHPDoc AI Generator',
				ignoreFocusOut: true,
				password: true,
			})

			if (apiKey) {
				const config = vscode.workspace.getConfiguration('phpdoc-ai-generator')
				await config.update(
					'openaiApiKey',
					apiKey,
					vscode.ConfigurationTarget.Global,
				)
				vscode.window.showInformationMessage(
					'OpenAI API key saved successfully.',
				)
			}
		},
	)

	context.subscriptions.push(disposableKey)
}

function deactivate() {}

function getText(editor) {
	const selection = editor.selection
	return editor.document.getText(selection)
}

async function send2GPT(code) {
	const config = vscode.workspace.getConfiguration('phpdoc-ai-generator')
	const apiKey = config.get('openaiApiKey')
	const language = config.get('language') || 'English'
	const model = config.get('model') || 'gpt-3.5-turbo'

	if (!apiKey) {
		vscode.window.showInformationMessage(
			'Please configure your OpenAI API key in the PHPDoc AI Generator settings.',
		)
		return false
	}

	const openai = new OpenAI({ apiKey })

	const exampleDoc =
		language === 'English'
			? `/**
					* Calculates the sum of squares of an array
					*
					* Loops over each element, squares it and adds it to the total.
					* Returns the total.
					*
					* Can also be implemented using array_reduce().
					*
					* @param array $arr
					* @return int
					* @throws Exception If an element in the array is not an integer
					*/`
			: `/**
					* [Short description in ${language}]
					*
					* [Detailed description in ${language}]
					*
					* @param array $arr
					* @return int
					* @throws Exception [Exception description in ${language}]
					*/`

	try {
		const response = await openai.chat.completions.create({
			model: model,
			messages: [
				{
					role: 'user',
					content: `Return ONLY the PHPDoc comment (with maximum information and best documentation practices) for the function/method below.
										Write ALL text inside the PHPDoc comment in ${language} language.

										Function/method:
										\n\n${code}\n\n

										Use the snippet below as a reference format (but write content in ${language}):
										${exampleDoc}
										`,
				},
			],
		})

		if (
			response.choices &&
			response.choices.length > 0 &&
			response.choices[0].message.content.trim() !== ''
		) {
			return response.choices[0].message.content.trim()
		} else {
			vscode.window.showInformationMessage(
				'Could not generate PHPDoc for this function/method.',
			)
			return false
		}
	} catch (error) {
		console.error('Error sending request to OpenAI API:', error)
		vscode.window.showErrorMessage(
			'Error sending request to OpenAI API: ' + error.message,
		)
		return false
	}
}

async function insertPHPDoc(phpDoc, editor) {
	const selection = editor.selection
	const start = new vscode.Position(selection.start.line, 0)

	await editor.edit(editBuilder => {
		editBuilder.insert(start, phpDoc + '\n')
	})
}

module.exports = {
	activate,
	deactivate,
}
