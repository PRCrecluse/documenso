# SignBaton ChatGPT Action

This private Custom GPT Action searches existing SignBaton documents and shares one with a named recipient for signature or viewing. The GPT uses a bearer token belonging to one SignBaton team. Share this GPT only with people who should be able to act for that team.

## Set up a private GPT

1. Deploy SignBaton at an HTTPS origin reachable by ChatGPT and apply the database migration. Use a test team and a dedicated, expiring SignBaton API token from **Team Settings → API Tokens**. The token grants API access to its team. [Documenso API authentication](https://docs.documenso.com/docs/developers/getting-started/authentication)
2. In ChatGPT on the web, create a GPT and keep its visibility private. Copy [gpt-instructions.md](gpt-instructions.md) into **Instructions**. [Creating a GPT](https://help.openai.com/en/articles/8554397-creating-a-gpt)
3. Add an Action. Paste [openapi.json](openapi.json) into the **Schema** field after replacing the placeholder server URL with your SignBaton HTTPS origin. Set **Authentication** to **API Key**, select **Bearer**, and enter the SignBaton token in the editor. [GPT Action authentication](https://developers.openai.com/api/docs/actions/authentication)
4. In GPT Preview, ask it to find a test document. Use an inbox you control and inspect the document, email address, and sharing mode in ChatGPT's confirmation before approving it. [GPT Action production requirements](https://developers.openai.com/api/docs/actions/production)

> Share “Sample services agreement” with signer@example.com for signature.

> Send viewer@example.com a PDF copy of the completed “Sample onboarding guide”.

ChatGPT looks up the document by its full title and prompts before the share action. Sign and view invitations for drafts use the sole recipient already configured on the document. Signers need a signature field.

Viewing a completed document emails a copy to the specified address and preserves the original recipients. This uses the team's completed-document email settings and supports up to 10 PDFs totaling 10 MiB. Documents protected by recipient access authentication require their existing access flow. The recipient can save the attachment. A successful response means the invitation was queued or the mail transport accepted the copy.

## Per-user sign-in

The private GPT uses the builder's team credential for its calls. A connection in which each user links their own SignBaton account would need a SignBaton authorization server or OAuth provider and user-level permission checks. The ChatGPT remote MCP connection flow offers OAuth for authenticated use. [ChatGPT custom MCP connections](https://developers.openai.com/api/docs/guides/custom-mcp-server) · [Plugin authentication](https://developers.openai.com/plugins/build/auth)
