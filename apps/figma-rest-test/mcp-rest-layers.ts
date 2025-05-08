// apps/figma-rest-test/mcp_rest_layers.ts
// -------------------------------------------------------------
// Unified MCP+REST wrapper for Figma:
// 1. Boots the community MCP server (read-only, LLM-friendly JSON)
// 2. Proxies GET /mcp/* and /figma/* to the upstream MCP server
// 3. Exposes essential REST helpers (images, writes) that MCP lacks
// -------------------------------------------------------------

import express from "express";
import { spawn } from "child_process";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// -------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------
const FIGMA_API_TOKEN = process.env.FIGMA_API_KEY;
if (!FIGMA_API_TOKEN) {
  console.error("⚠️ Missing FIGMA_API_TOKEN in environment");
  process.exit(1);
}
const LOCAL_MCP_PORT = Number(process.env.MCP_PORT || 3333);
const APP_PORT = Number(process.env.APP_PORT || 4000);

// -------------------------------------------------------------
// 1. SPAWN the figma-developer-mcp server
// -------------------------------------------------------------
const mcpProcess = spawn(
  "npx",
  [
    "figma-developer-mcp",
    `--figma-api-key=${FIGMA_API_TOKEN}`,
    `--port=${LOCAL_MCP_PORT}`,
    `--cache-root=./tmp/mcp-cache`,
    "--docs",
  ],
  { stdio: "inherit", shell: true }
);
process.on("exit", () => mcpProcess.kill());

// -------------------------------------------------------------
// 2. EXPRESS app: proxy MCP and add REST helpers
// -------------------------------------------------------------
const app = express();
app.use(express.json());

// Helper: forward any GET to underlying MCP server
async function forwardMcp(req: express.Request, res: express.Response) {
  try {
    // Strip `/mcp` prefix so upstream sees native routes
    let upstreamPath = req.originalUrl;
    if (upstreamPath.startsWith("/mcp")) {
      upstreamPath = upstreamPath.replace(/^\/mcp/, "");
    }
    const url = `http://localhost:${LOCAL_MCP_PORT}${upstreamPath}`;
    const upstream = await fetch(url, {
      headers: { "X-Figma-Token": FIGMA_API_TOKEN, Accept: "application/json" },
    });
    res.status(upstream.status);
    upstream.body.pipe(res);
  } catch (err) {
    console.error("MCP proxy error", err);
    res.status(500).json({ error: "MCP proxy failure" });
  }
}

// Proxy GET for both /mcp/* and native /figma/* routes
app.get(["/mcp/*", "/figma/*"], forwardMcp);

// -------------------------------------------------------------
// REST helper: image export via Figma REST API
// -------------------------------------------------------------
app.get("/rest/images/:fileId/:nodeId", async (req, res) => {
  const { fileId, nodeId } = req.params;
  try {
    const metaRes = await fetch(
      `https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png`,
      { headers: { "X-Figma-Token": FIGMA_API_TOKEN } }
    );
    const meta = await metaRes.json();
    const url = meta.images?.[nodeId];
    if (!url) throw new Error("Image URL not found");
    const imgRes = await fetch(url);
    res.setHeader("Content-Type", "image/png");
    imgRes.body.pipe(res);
  } catch (err: any) {
    console.error("Image proxy error", err.message);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// REST helper: update component description
// -------------------------------------------------------------
app.post("/rest/components/:componentId/description", async (req, res) => {
  const { componentId } = req.params;
  const { text } = req.body as { text: string };
  try {
    const updateRes = await fetch(
      `https://api.figma.com/v1/components/${componentId}`,
      {
        method: "PUT",
        headers: {
          "X-Figma-Token": FIGMA_API_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: text }),
      }
    );
    const body = await updateRes.json();
    res.status(updateRes.status).json(body);
  } catch (err: any) {
    console.error("REST update error", err.message);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// START the unified server
// -------------------------------------------------------------
app.listen(APP_PORT, () => {
  console.log(
    `🚀 Unified MCP+REST server listening on http://localhost:${APP_PORT}`
  );
  console.log(`  • Proxy JSON: GET /mcp/figma/file/:fileId`);
  console.log(`  • Native JSON: GET /figma/file/:fileId`);
  console.log(`  • Image export: GET /rest/images/:fileId/:nodeId`);
  console.log(
    `  • Write helper: POST /rest/components/:componentId/description`
  );
});
