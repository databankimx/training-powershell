---
applyTo: "**/*"
---

# GitHub Copilot Instructions - DataBank Development Standards

## Purpose
This file defines how GitHub Copilot should generate code for DataBank IMX development teams.
All generated code must align with internal standards for quality, maintainability, security, and consistency.

## Scope
This repository is a **PowerShell training repository**. It holds lesson content (Markdown and PowerShell scripts) and a Node.js/Electron lesson runner in `lesson-runner/`. Follow the **Common Standards** section, plus the **PowerShell Instructions** section for lesson and setup scripts and the **JavaScript Instructions** section for the lesson runner.

---

## Common Standards

### General Principles
- Prioritize **readability, maintainability, and clarity** over brevity.
- Follow **DataBank coding standards** at all times.
- Assume code will be **reviewed, tested, and deployed to client environments**.
- Avoid unsafe, experimental, or non-production-ready patterns.
- Do not introduce unnecessary dependencies or frameworks.
- Third-party packages **must** have licenses that allow closed-source commercial use.
- Prefer existing project patterns over introducing new architectural or library choices.

### Architecture and Design
- Prefer clear separation of concerns.
- Avoid tightly coupled designs.
- Design for reuse and extensibility.
- Keep controllers, endpoints, and entry points thin; place business logic in services or domain components.
- Match the structure and conventions already used by the repository unless the user explicitly requests a redesign.

### Error Handling and Security
- Validate all inputs.
- Avoid exposing sensitive information in exceptions, logs, API responses, or console output.
- Follow least-privilege principles.
- Do not generate insecure defaults, hardcoded secrets, or bypass validation/authentication/authorization checks.
- Exception and error messages must be clear, concise, grammatically correct, and end with a period.

### Comments and Documentation
- Write comments only when necessary.
- Use clear, concise US-English.
- Document complex logic, non-obvious decisions, and important operational behavior.
- Avoid comments that merely restate the code.

### Source Control and Workflow
- All code must be tracked in source control.
- Commit early and often.
- Use meaningful commit messages.
- Link commits to tasks, issues, bugs, or enhancements where appropriate.
- Use branches and pull requests for review; do not commit directly to protected mainline branches.

### Code Reviews and Quality Gates
- All code must be reviewed before merge or delivery.
- Address correctness, readability, performance, security, and maintainability.
- Where applicable, code must pass SonarQube or other required quality gates before merge.

### Testing and QA Expectations
- Follow a **test-driven mindset** where practical.
- Ensure new code is testable.
- Include unit tests and integration tests where appropriate.
- Consider edge cases, invalid inputs, failure scenarios, and regression risk.

### Prohibited Practices
- Do NOT generate hardcoded credentials, secrets, tokens, or connection strings.
- Do NOT introduce unapproved third-party libraries.
- Do NOT expose internal implementation details unnecessarily.
- Do NOT produce code that violates DataBank IP, security, or delivery policies.

---

## PowerShell Instructions

### General Style
- Target PowerShell 7. Do not rely on Windows PowerShell 5.1 behavior unless a lesson says so.
- Use approved verbs and `Verb-Noun` names for functions.
- Use full cmdlet names and parameter names instead of aliases (for example `Get-ChildItem`, not `ls` or `gci`).
- Use descriptive variable names in PascalCase or camelCase, matching the surrounding script.
- Prefer explicit, readable code over compact one-liners.

### Structure
- Keep scripts and functions small and single-purpose.
- Use `[CmdletBinding()]` and a `param()` block with typed, validated parameters for reusable scripts.
- Use `Join-Path` rather than string concatenation for paths.

### Error Handling
- Use `try`/`catch` with `-ErrorAction Stop` where failures must be handled.
- Do not swallow errors silently.
- Keep error messages clear, safe, and ending with a period.

### Output and Logging
- Use `Write-Output` for data, and `Write-Verbose`, `Write-Warning`, or `Write-Error` for diagnostics.
- Avoid `Write-Host` except for deliberate user-facing messages such as in `setup.ps1`.
- Never write secrets or tokens to the console or to files.

### Documentation
- Add comment-based help to reusable functions and scripts when behavior is not obvious.
- Keep inline comments minimal and purposeful.

### Testing
- Use **Pester** for PowerShell tests if tests are added.
- Do not introduce other PowerShell test frameworks.

## JavaScript Instructions (lesson-runner)

- The runner targets Node.js 24 or later and Electron. Use CommonJS or ES modules to match the existing files.
- Keep the main process, preload script, and renderer separated. Expose only what the renderer needs through the preload script.
- Unit tests **must** use the built-in `node:test` runner and `node:assert`, and be listed in the `test` script in `lesson-runner/package.json`.
- Keep dependencies minimal. Pin versions and confirm licenses allow closed-source commercial use.

### Lesson Content Conventions
- Each step folder contains `lesson.json`, `lesson.md`, and, for exercises, `starter.ps1`, `sample.txt`, `solution.ps1`, and optionally `expected-files.json`.
- Use hyphens, not em dashes. Use plain text symbols, not emojis.
- End each lesson with a horizontal rule.
- Lesson and exercise files are teaching material. Keep them simple and beginner friendly rather than fully production hardened.

---

## Copilot Behavior Guidelines

When generating code, Copilot should:
- Follow all applicable rules in this document automatically.
- Prefer existing project patterns over new ones.
- Match surrounding code style closely.
- Avoid speculative implementations.
- Ask for clarification through comments or generated TODO notes only when requirements are genuinely unclear.

---

## Definition of Done

Generated code is acceptable only if it:
- Runs successfully without warnings in the target project context.
- Passes required static analysis and quality gates where applicable.
- Follows the PowerShell and JavaScript standards in this file.
- Includes appropriate validation, error handling, and logging.
- Is readable, maintainable, and testable.
