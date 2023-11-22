# Publishing guide

1. Make sure the GitHub actions has a NPM_TOKEN secret.
2. Execute:

   ```shell
   git tag -s -m <message> <version with v prefix>
   git push origin <version with v prefix>
   ```

3. Wait for CI. The CI will automatically bump the `package.json` and retag the commit.
