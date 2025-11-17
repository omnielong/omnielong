# Contributing to OmnieLong POS System

Thank you for your interest in contributing to OmnieLong POS! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Docker (optional, for containerized development)

### Initial Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/omnielong.git
   cd omnielong
   ```

3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Copy environment file:
   ```bash
   cp .env.example .env
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/description` - Documentation updates

### Creating a Branch

```bash
git checkout -b feature/my-new-feature develop
```

### Making Changes

1. Make your changes in your feature branch
2. Write or update tests
3. Ensure code passes linting and formatting:
   ```bash
   npm run lint
   npm run format
   ```

4. Run tests:
   ```bash
   npm test
   npm run test:e2e
   ```

5. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add loyalty card points calculation
fix: resolve checkout validation error
docs: update API integration guide
test: add unit tests for Cart component
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript typing for props
- Implement error boundaries where appropriate

### Styling

- Use Tailwind CSS utility classes
- Follow existing design patterns
- Ensure responsive design (mobile, tablet, desktop)
- Test on different screen sizes

### File Organization

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── store/          # State management
├── services/       # API and external services
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── validation/     # Zod schemas
└── locales/        # i18n translations
```

## Testing

### Unit Tests

Write unit tests for:
- Utility functions
- State management logic
- Component logic
- Validation schemas

```bash
npm test
```

### E2E Tests

Write E2E tests for:
- Critical user flows
- Authentication
- Checkout process
- Admin operations

```bash
npm run test:e2e
```

### Test Coverage

Maintain minimum 60% code coverage:

```bash
npm run test:coverage
```

## Pull Request Process

1. **Update Documentation**: Update README.md or other docs if needed

2. **Pass All Checks**: Ensure CI/CD pipeline passes:
   - ✅ Linting
   - ✅ Unit tests
   - ✅ E2E tests
   - ✅ Build successful

3. **Write Clear Description**: Describe what and why
   - What changes were made
   - Why these changes are necessary
   - Related issue numbers (#123)

4. **Request Review**: Tag appropriate reviewers

5. **Address Feedback**: Respond to review comments

6. **Squash Commits**: Keep git history clean

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

## Reporting Bugs

### Before Submitting

- Check existing issues
- Check FAQ and documentation
- Try to reproduce in latest version

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information
```

## Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution**
How would you like this to work

**Describe alternatives**
Other solutions you've considered

**Additional context**
Mockups, examples, etc.
```

## Development Tips

### Performance

- Use React.memo for expensive components
- Implement proper list virtualization for long lists
- Lazy load routes and components
- Monitor bundle size

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios (WCAG AA)

### Security

- Never commit secrets or API keys
- Sanitize user inputs
- Use environment variables
- Follow OWASP security guidelines

## Questions?

- Open a discussion on GitHub
- Check existing documentation
- Ask in pull request comments

Thank you for contributing! 🎉
