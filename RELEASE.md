# Publishing guide

1. Make sure the GitHub actions has a NPM_TOKEN secret.
2. Use workflow dispatch to release (Go to Actions Tab).
3. Wait for CI. The CI will automatically bump the `package.json` and tag the commit.
