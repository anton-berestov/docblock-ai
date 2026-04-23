# Changelog

All notable changes to DocBlock AI will be documented in this file.

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
