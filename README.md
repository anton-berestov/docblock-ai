# PHPDoc AI Generator

A Visual Studio Code extension that automatically generates PHPDoc comments for your PHP functions and methods using OpenAI GPT models. Supports multiple documentation languages.

## Features

- **Automatic PHPDoc Generation** — Select any PHP function or method and generate a complete PHPDoc comment in seconds.
- **Multi-language Support** — Choose the language for generated comments: English, Russian, Spanish, Italian, French, German, Portuguese, Polish, Chinese, or Japanese.
- **Model Selection** — Choose which OpenAI model to use (GPT-3.5 Turbo, GPT-4, GPT-4 Turbo, GPT-4o).
- **Secure API Key Storage** — Your OpenAI API key is stored securely in VS Code's global settings.

## Requirements

- Visual Studio Code 1.84.0 or higher
- A valid OpenAI API key

## Getting Started

### 1. Install the Extension

Install **PHPDoc AI Generator** from the VS Code Marketplace.

### 2. Set Your OpenAI API Key

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P` on Mac) and run:

```
PHPDoc AI Generator: Set OpenAI API Key
```

Enter your OpenAI API key when prompted.

### 3. Generate PHPDoc

1. Open a PHP file in the editor.
2. Select a function or method (highlight its entire body or just the signature).
3. Open the Command Palette and run:

```
Generate PHPDoc
```

The PHPDoc comment will be inserted automatically above the selected function.

## Extension Settings

| Setting | Default | Description |
|---|---|---|
| `phpdoc-ai-generator.openaiApiKey` | `""` | Your OpenAI API key |
| `phpdoc-ai-generator.language` | `"English"` | Language for generated PHPDoc comments |
| `phpdoc-ai-generator.model` | `"gpt-3.5-turbo"` | OpenAI model to use |

### Changing the Documentation Language

1. Open VS Code Settings (`Ctrl+,` / `Cmd+,`).
2. Search for **PHPDoc AI Generator**.
3. Select the desired language from the **Language** dropdown.

Supported languages: English, Russian, Spanish, Italian, French, German, Portuguese, Polish, Chinese, Japanese.

## Known Issues

- The extension only works with PHP files.
- The selected text must contain at least one `function` keyword.
- PHPDoc quality depends on how much context is selected and the capability of the chosen GPT model.

## Release Notes

### 1.0.0

- Multi-language support for generated comments
- Model selection (GPT-3.5 Turbo, GPT-4, GPT-4 Turbo, GPT-4o)
- Full English UI
- Secure API key input (password field)

## Feedback & Issues

Found a bug or have a feature request? Please open an issue on the GitHub repository.
