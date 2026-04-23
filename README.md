# DocBlock AI

Generate documentation comments for any function or method using **OpenAI GPT** or **GitHub Copilot** — directly from VS Code's context menu or command palette.

Supports **9 programming languages** and **10 human languages** for generated text.

## Features

- **Right-click → Generate Documentation** — select a function, right-click, done
- **Multi-language code support** — PHP, JavaScript, TypeScript, Python, Java, C#, Go, Ruby, Rust
- **Correct format per language** — PHPDoc, JSDoc, TSDoc, docstrings, Javadoc, XML comments, GoDoc, YARD, Rustdoc
- **Two AI providers** — OpenAI (GPT-3.5 / GPT-4 / GPT-4o) or GitHub Copilot (no extra API key needed)
- **Documentation language** — write comments in English, Russian, Spanish, and 7 more languages
- **Progress indicator** with cancellation support

## Requirements

- VS Code 1.90.0 or higher
- **OpenAI provider**: valid OpenAI API key
- **Copilot provider**: active GitHub Copilot subscription

## Getting Started

### 1. Install the Extension

Install **DocBlock AI** from the VS Code Marketplace.

### 2. Choose a Provider

Open VS Code Settings (`Ctrl+,` / `Cmd+,`), search for **DocBlock AI**, and set:

- **Provider**: `openai` or `copilot`

If you choose OpenAI, run the command to set your API key:

```
DocBlock AI: Set OpenAI API Key
```

### 3. Generate Documentation

1. Open any supported file (PHP, JS, TS, Python, etc.)
2. Select the function or method you want to document
3. Right-click → **DocBlock AI: Generate Documentation**

Or use the Command Palette (`Ctrl+Shift+P`):

```
DocBlock AI: Generate Documentation
```

## Extension Settings

| Setting                    | Default         | Description                                                      |
| -------------------------- | --------------- | ---------------------------------------------------------------- |
| `docblock-ai.provider`     | `openai`        | AI provider: `openai` or `copilot`                               |
| `docblock-ai.openaiApiKey` | `""`            | OpenAI API key (for OpenAI provider)                             |
| `docblock-ai.model`        | `gpt-3.5-turbo` | OpenAI model (`gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`, `gpt-4o`) |
| `docblock-ai.language`     | `English`       | Language for generated documentation text                        |

## Supported Programming Languages

| Language   | Format                    |
| ---------- | ------------------------- |
| PHP        | PHPDoc                    |
| JavaScript | JSDoc                     |
| TypeScript | TSDoc                     |
| Python     | Google-style docstring    |
| Java       | Javadoc                   |
| C#         | XML documentation comment |
| Go         | GoDoc comment             |
| Ruby       | YARD documentation        |
| Rust       | Rust doc comment          |

## Documentation Languages

English, Russian, Spanish, Italian, French, German, Portuguese, Polish, Chinese, Japanese.

## Known Issues

- The selected text must contain a recognizable function/method definition.
- Copilot provider availability depends on your GitHub Copilot subscription and the VS Code version.

## Release Notes

### 1.1.0

- Initial release
- Multi-language code support (9 languages)
- OpenAI and GitHub Copilot providers
- Documentation in 10 human languages
- Right-click context menu integration
- Progress indicator with cancellation
