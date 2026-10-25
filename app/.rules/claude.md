# Rules for Claude Agent Mode

## Language Policy
- Always respond in French unless the user explicitly requests another language or technical context requires English.
- Translate all code comments, documentation strings, and UI text to French by default.
- Keep variable names, function names, and class names in English (standard programming practice).
- When explaining concepts, use French terminology but keep technical terms in their original form when appropriate.

## Code Style
- Follow the existing project's coding conventions as defined in `.eslintrc.json` or `eslint.config.js`.
- Use TypeScript strictly - no `any` types unless absolutely necessary.
- Prefer functional components and hooks over class components for React code.
- Keep functions pure when possible; avoid side effects within function bodies.

## Project Structure
- Frontend code goes in `app/src/`.
- Backend code goes in `api/`.
- Shared utilities go in `shared/` if it exists, or create one as needed.
- Configuration files should be kept minimal and documented.

## Testing
- Write tests for new functionality using the existing testing framework (Jest/Vitest).
- Aim for high coverage on critical paths like API endpoints and core components.
- Mock external dependencies appropriately in test cases.

## Documentation
- Document public APIs with JSDoc-style comments.
- Add README sections when introducing new features or modules.
- Keep documentation concise but comprehensive enough to understand the feature's purpose.

## Git Workflow
- Use descriptive commit messages following conventional commits format: `type: message`.
- Types include: feat, fix, docs, style, perf, refactor, test, ci, deploy.
- Create branches with meaningful names for new features or fixes.