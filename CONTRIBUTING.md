# Contributing to Evalify

Thank you for your interest in contributing to Evalify! We welcome contributions from the open-source community to help improve this online exam management tool. This document outlines the process for contributing to the project, including how to set up your environment, follow coding standards, and submit pull requests.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Forking the Repository](#forking-the-repository)
3. [Setting Up Your Development Environment](#setting-up-your-development-environment)
4. [Working on a Feature Branch](#working-on-a-feature-branch)
5. [Coding Standards and Guidelines](#coding-standards-and-guidelines)
6. [Creating a Pull Request](#creating-a-pull-request)
7. [Code Review Process](#code-review-process)
8. [Reporting Issues](#reporting-issues)
9. [Roadmap and Progress](#roadmap-and-progress)
10. [Community Guidelines](#community-guidelines)

---

## Getting Started

Before you start contributing, please:

- Read the [README.md](https://github.com/evalify/evalify-frontend/blob/development/README.md) file to understand the project.
- Check the [Roadmap](#roadmap-and-progress) and [Issues](https://github.com/evalify/evalify-frontend/issues) page to see what tasks are available.
- Familiarize yourself with the [Code of Conduct](https://github.com/evalify/evalify-frontend/blob/development/CODE_OF_CONDUCT.md) to ensure a respectful and inclusive environment.

---

## Forking the Repository

1. Go to the [Evalify repository](https://github.com/evalify/evalify-frontend).
2. Click the "Fork" button in the top-right corner to create a copy of the repository under your GitHub account.
3. Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/evalify.git
   cd evalify
   ```
4. Add the original repository as a remote to sync updates:
   ```bash
   git remote add upstream https://github.com/evalify/evalify.git
   ```

---

## Setting Up Your Development Environment

Evalify is built with `Next.js`. Follow these steps to set up your local environment:

1. Install Node.js (version 16 or higher) and npm/yarn if you haven't already.
2. Install the project dependencies:
   ```bash
   cd evalify
   npm install
   # or
   yarn install
   ```
3. Request the `.env` file from the project maintainers. This file contains environment variables required for the project to run. You can message the developers via GitHub issues or other communication channels like WhatsApp or email.
4. Place the `.env` file in the root directory of the project.
5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
6. Open your browser and navigate to `http://localhost:3000` to verify the project is running correctly.

---

## Working on a Feature Branch

To maintain a linear Git history, we use `git rebase` instead of `git merge`. Follow these steps:

1. Sync your fork with the latest changes from the upstream repository:
   ```bash
   git fetch upstream
   git checkout main
   git rebase upstream/main
   ```
2. Create a new branch for your feature or bugfix. Use a descriptive name:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them with clear and concise messages:
   ```bash
   git add .
   git commit -m "Add: Description of your changes"
   ```
4. Push your branch to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Coding Standards and Guidelines

To maintain consistency across the codebase, please adhere to the following guidelines:

- Follow the existing code style and formatting (e.g., indentation, naming conventions).
- Write meaningful commit messages and comments.
- Include unit tests for new features or bug fixes.
- Ensure your code is linted and passes all existing tests:
  ```bash
  npm run lint
  npm run test
  # or
  yarn lint
  yarn test
  ```
- Document any new functionality or changes in the relevant documentation files.

---

## Creating a Pull Request

1. Go to your forked repository on GitHub.
2. Click the "Compare & Pull Request" button for your feature branch.
3. Fill out the pull request template:
   - Provide a clear title and description of your changes.
   - Reference any related issues using `#issue-number`.
   - Include screenshots or examples if applicable.
4. Submit the pull request and wait for feedback from the maintainers.

---

## Code Review Process

1. A maintainer will review your pull request and provide feedback.
2. If changes are requested, update your branch by rebasing on the latest `main` branch:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
3. Push your updated branch:
   ```bash
   git push origin feature/your-feature-name --force-with-lease
   ```
4. Once approved, your changes will be merged into the main branch, maintaining a linear history.

---

## Reporting Issues

If you encounter a bug or have a feature request:

1. Check the [Issues](https://github.com/evalify/evalify-frontend/issues) page to see if it has already been reported.
2. If not, create a new issue using the provided template.
3. Provide as much detail as possible, including steps to reproduce the issue, expected behavior, and actual behavior.

---

## Roadmap and Progress

You can track the project's progress and upcoming features on the [Evalify Roadmap](https://github.com/orgs/evalify/projects/2/views/3). Feel free to pick up tasks from the roadmap or suggest new ideas.

---

## Community Guidelines

We value a positive and inclusive community. Please:

- Be respectful and considerate of others.
- Avoid off-topic discussions in issues and pull requests.
- Follow the [Code of Conduct](https://github.com/evalify/evalify-frontend/blob/main/CODE_OF_CONDUCT.md).

---

Thank you for contributing to Evalify! Your efforts help make this project better for everyone.
