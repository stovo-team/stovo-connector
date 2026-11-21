# Stovo Connector

Local companion connector bridging **Stovo Messenger** & **Stovo Insight** with local AI coding agents (**Codex CLI**).

The connector runs locally on your workstation. Stovo Insight uses your linked Messenger connection to issue a short-lived, chat-scoped pairing credential. The connector makes outbound HTTPS requests to Insight, runs the local Codex `app-server`, and transmits response revisions through the linked account.

It does not sign in to Messenger directly, never creates a second Messenger identity, and exposes no inbound ports.

---

## Requirements

- **Node.js**: `22.0.0` or higher.
- **Codex CLI**: with local `app-server` stdio protocol support.
- **Platform**: macOS or Linux (Windows is not supported by this setup flow).
- **Stovo Insight connection**: with `read`, `process`, `codex`, and `reply` permissions enabled.
- **Managed Policy**: Installed `/etc/codex/requirements.toml` before starting.

---

## Quick Start

You can run the connector via `npx` or clone the repository directly:

### Option A: Using `npx`

```bash
# Initialize a private working directory
mkdir -p my-stovo-connector/private
cd my-stovo-connector

# Download the sample configuration
curl -fsSL https://raw.githubusercontent.com/stovo-team/stovo-connector/main/config.example.json -o config.json

# Edit config.json with your Insight origin, chat ID, and local repository path
# Then pair:
npx @stovo-team/stovo-connector pair ./config.json

# Start the connector:
npx @stovo-team/stovo-connector ./config.json
```

### Option B: Clone and Run

```bash
git clone https://github.com/stovo-team/stovo-connector.git
cd stovo-connector

# Create configuration and private directories
cp config.example.json config.json
mkdir -m 700 private

# Pair with Stovo Insight:
npm start -- pair ./config.json
# or
./bin/stovo-connector.mjs pair ./config.json

# Start the connector:
npm start -- ./config.json
```

---

## Guided Setup & Pairing

1. **Verify Insight MCP Session**:
   In your authenticated Stovo Insight MCP session, call `messenger_source_connections` and ensure the connection has `read`, `process`, `codex`, and `reply` enabled.

2. **Configure Local Workspace**:
   Configure `config.json`:
   - `relay.baseUrl`: HTTPS origin of Stovo Insight.
   - `chats[].id`: Exact Messenger chat ID.
   - `chats[].workspace`: Absolute local path to your project.
   - `codexHome`: Isolated private directory (outside workspace).
   - `stateFile`: Private state tracking file.

3. **Obtain One-Time Pairing Code**:
   In Insight MCP, execute:
   ```text
   pair_local_codex(connection_id, chat_id)
   ```
   *Note: Pairing codes are valid for 5 minutes and strictly scoped to that chat.*

4. **Pair Locally**:
   Run:
   ```bash
   npx @stovo-team/stovo-connector pair ./config.json
   ```
   Enter the code when prompted. The returned credential is saved privately with `0600` permissions in `private/insight-relay.json`. Never commit this file.

5. **Install Managed Codex Policy**:
   Install `requirements.example.toml` at `/etc/codex/requirements.toml` owned by `root`:
   ```bash
   sudo cp requirements.example.toml /etc/codex/requirements.toml
   sudo chmod 644 /etc/codex/requirements.toml
   ```

6. **Start Connector**:
   ```bash
   npx @stovo-team/stovo-connector ./config.json
   ```
   In your Messenger chat, invoke `@Codex <prompt>` or `/codex <command>`.

---

## Security Model & Approvals

- **Outbound Only**: The connector initiates outbound HTTPS long-polling connections to Insight; no incoming listening ports are opened.
- **Approval Checkpoints**: Every shell command, file change, or deployment/publish command requests explicit approval in the Messenger chat.
  - Approve: `/codex approve <CODE>`
  - Deny: `/codex deny <CODE>`
  - Cancel: `/codex cancel <CODE>`
- **Workspace Isolation**: Symlinks escaping the workspace and paths outside the configured workspace directory are denied.
- **Secret Redaction**: Common token formats (e.g. bearer tokens, API keys) are redacted from streamed outputs.
- **Loop Suppression**: Messages originating from the bridge account or bots are filtered to prevent recursive event loops.

---

## Development & Testing

Run the offline test suite:

```bash
npm test
```

All tests run completely offline using local mocks and fixtures.

---

## License

[Apache License 2.0](LICENSE) © 2026 Stovo Team
