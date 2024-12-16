# Contributing to HeliosIQ

Thank you for considering contributing to **HeliosIQ**! We welcome contributions of all kinds, including bug fixes, features, documentation improvements, and more. By contributing, you help make **HeliosIQ** better for everyone.

Before you begin, please review the following guidelines to ensure a smooth contribution process.

## How to Contribute

### 1. Fork the Repository

Start by forking the **HeliosIQ** repository to your own GitHub account. This allows you to freely make changes without affecting the original project.

### 2. Clone Your Fork

Clone the forked repository to your local machine to begin making changes:

```bash
git clone https://github.com/your-username/HeliosIQ.git
cd HeliosIQ
```

### 3. Create a New Branch

Before making any changes, create a new branch. Name the branch according to the issue you are working on or the feature you are adding. This helps keep your work organized.

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes

Now, make the necessary changes. This could include:

- Fixing bugs
- Implementing new features
- Improving documentation
- Refactoring code

### 5. Commit Your Changes

After making changes, commit them with a clear and descriptive message:

``` bash
git add .
git commit -m "Add feature: Your feature description"
```

### 6. Push Your Changes

Push your changes to your forked repository on GitHub:

``` bash
git push origin feature/your-feature-name
```

### 7. Open a Pull Request (PR)

Once you've pushed your changes, open a **Pull Request** (PR) to the main **HeliosIQ** repository. The PR should describe what you've changed and why.

### 8. Follow Code Review Feedback

Once your PR is open, the maintainers of **HeliosIQ** will review your changes. They may suggest improvements or request changes. Please make these adjustments promptly.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to creating a welcoming and inclusive environment for all contributors.

---

## Development Environment Setup

To contribute to **HeliosIQ**, you'll need to set up your local development environment. Follow these steps:

1. **Clone the repository** if you haven’t already:

``` bash
git clone https://github.com/your-username/HeliosIQ.git
cd HeliosIQ
```

2. **Install dependencies** for both the project and infrastructure components:
    - Use `npm` or `yarn` for JavaScript dependencies.
    - Terraform should be installed for infrastructure-related changes.

``` bash
npm install
```

3. **Set up your AWS credentials** if you're working with AWS resources:

``` bash
aws configure
```

4. **Deploy locally** using Docker and Kubernetes:

``` bash
docker-compose up
```

---

## Testing

Before submitting your PR, please ensure all tests pass:

- Unit tests should be written for any new features or bug fixes.
- Run tests locally using:

``` bash
npm test
```

---

## Documentation

If you are adding or modifying features, please ensure that you also update the documentation as needed.

- For API changes, update the `docs/api.md` file.
- For general changes, update the `README.md` or create new documentation as required.

---

## Issue Reporting

If you find a bug or have a feature request, please open an issue before submitting a PR. This helps ensure that your changes align with the project’s goals.

- **Bug Report**: Use the "Bug Report" template in the issues section to describe any problems.
- **Feature Requests**: Use the "Feature Request" template to suggest new ideas or enhancements.

---

## License

By contributing to **HeliosIQ**, you agree that your contributions will be licensed under the **MIT License** (as described in the repository's `LICENSE` file).

---

We appreciate your contributions and look forward to improving **HeliosIQ** together!
