# Instinct compatibility

This integration targets the personal assistant at [instinct.com](https://instinct.com/). The app exposes a standard remote MCP endpoint. Native custom MCP setup in Instinct has not been verified on an account.

| Connection setting | Value |
| --- | --- |
| Server URL | `https://YOUR-DEPLOYMENT/api/agent/mcp` |
| Transport | Streamable HTTP |
| Authentication | HTTP `Authorization: Bearer` with a Documenso API token for the intended team |

Use the connector's private credential field when it supports bearer authentication. Keep API tokens out of chat. Clients should accept `application/json` and `text/event-stream`.

`find_documents` searches titles in the connected team. `share_document` emails a signing or viewing invitation for a prepared draft. For a completed document, viewing emails a copy of the PDF and preserves the original recipient list. Ask a follow-up when a document title matches multiple results or the user has not supplied a recipient email address or access mode.

Example requests with a test document and an explicit recipient:

- “Send the Vendor Agreement document to alex@example.com for signing.”
- “Share the Vendor Agreement document with alex@example.com for viewing.”

Verify tool discovery in a client with custom remote MCP support before using an Instinct connector. An official Instinct setup path is still unconfirmed. [Instinct](https://instinct.com/) · [Third-party integration status](https://docs.simplified.com/setup/instinct)

## Open-source client option

LibreChat can connect to the same server through configuration. Put the following in `librechat.yaml` and set `SIGNBATON_API_TOKEN` in the LibreChat server environment. Use this shared team token only in a private or access-controlled client instance. The connector loads the tools at runtime through MCP. [LibreChat MCP configuration](https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/mcp_servers)

```yaml
mcpServers:
  signbaton:
    type: streamable-http
    url: https://YOUR-DEPLOYMENT/api/agent/mcp
    requiresOAuth: false
    headers:
      Authorization: 'Bearer ${SIGNBATON_API_TOKEN}'
```
