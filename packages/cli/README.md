# SkyFetch CLI

The official Command Line Interface for SkyFetch.

## Installation

### Local Development (Linking)

If you are developing SkyFetch locally, you can link this package to use the `skyfetch` command globally on your machine.

1.  Navigate to the CLI package directory:
    ```bash
    cd packages/cli
    ```

2.  Link the package:
    ```bash
    npm link
    ```

3.  Verify installation:
    ```bash
    skyfetch --version
    ```

### Project-Scoped Installation (Recommended for Testing)

If you prefer not to install globally, you can install the CLI directly into your target project as a dependency.

1.  In your target project's root directory, run:
    ```bash
    npm install D:/my/sky-fetch/packages/cli
    ```
    *(Adjust the path if your projects are in different locations)*

2.  Usage via `npx` or `npm exec`:
    ```bash
    npx skyfetch start
    ```

3.  Or verify version:
    ```bash
    npx skyfetch --version
    ```

### Usage in Another Project

Once linked, you can use `skyfetch` directly in your terminal from any directory.

#### Configuration

First, configure your API Endpoint and API Key.

```bash
skyfetch config set apiUrl http://localhost:3000
skyfetch config set apiKey sk_YOUR_API_KEY
```

> Note: If you are running the backend locally, ensure it is running on `http://localhost:3000`.

#### Start the Agent

To start capturing your shell history logs:

```bash
skyfetch start
```

This will automatically detect your shell (`bash`, `zsh`, `fish`), find the history file, and start streaming new commands to SkyFetch.

#### Unlinking (Cleanup)

To remove the global link:

```bash
# In packages/cli
npm unlink
```
