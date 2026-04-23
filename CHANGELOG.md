# Changelog

All notable changes to DocBlock AI will be documented in this file.

## [1.2.2] - 2026-04-23

### Changed

- Description now generates 2–3 sentences with line wrapping at 80 characters

## [1.2.1] - 2026-04-23

### Added

- Support for documenting classes, interfaces, variables, constants, and properties in all 9 languages
- Anthropic Claude provider (Haiku 4.5 / Sonnet 4.6 / Opus 4.7) with `DocBlock AI: Set Claude API Key` command

## [1.2.0] - 2026-04-23

### Fixed

- Error "TextEditor#edit not possible on closed editors" when the file is closed during generation
- Generated comment incorrectly starting with `/ **` instead of `/**`

### Changed

- Shorter documentation output: one concise summary sentence instead of a two-paragraph description

## [1.1.0] - 2026-04-23

### Added

- Support for 9 programming languages: PHP, JavaScript, TypeScript, Python, Java, C#, Go, Ruby, Rust
- Correct documentation format per language: PHPDoc, JSDoc, TSDoc, Google docstring, Javadoc, XML doc, GoDoc, YARD, Rustdoc
- Two AI providers: OpenAI GPT and GitHub Copilot
- OpenAI model selection: GPT-3.5 Turbo, GPT-4, GPT-4 Turbo, GPT-4o
- Documentation text in 10 human languages
- Right-click context menu: "DocBlock AI: Generate Documentation"
- Progress notification with cancellation support
