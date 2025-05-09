
# CodePlay

A minimal deployment-ready application configured with GitHub Actions.

## Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch. The deployment workflow is defined in `.github/workflows/deploy.yml`.

### How It Works

1. When code is pushed to the main branch, GitHub Actions will automatically:
   - Set up a Node.js environment
   - Install dependencies
   - Build the application
   - Deploy the built files to GitHub Pages

### Manual Deployment

You can also trigger a manual deployment by:

1. Going to the "Actions" tab in your GitHub repository
2. Selecting the "Deploy CodePlay" workflow
3. Clicking "Run workflow"

## Customizing Deployment

To deploy to a different platform:

1. Edit the `.github/workflows/deploy.yml` file
2. Modify the deployment step to use your preferred hosting provider
3. Add any necessary secrets in your GitHub repository settings

## Local Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
