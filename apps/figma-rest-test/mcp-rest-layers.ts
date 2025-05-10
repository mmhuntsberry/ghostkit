// File: apps/figma-rest-test/mcp_rest_layers.ts
// -------------------------------------------------------------
// Unified MCP+REST wrapper for Figma
// MCP server is now expected to run independently on port 3333
// This Express server proxies GETs and provides REST helpers
// -------------------------------------------------------------

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// -------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------
const FIGMA_API_TOKEN =
  process.env.FIGMA_API_KEY || process.env.FIGMA_API_TOKEN;

if (!FIGMA_API_TOKEN) {
  console.error("⚠️ Missing FIGMA_API_TOKEN in environment");
  process.exit(1);
}

const LOCAL_MCP_PORT = Number(process.env.MCP_PORT || 3333);
const APP_PORT = Number(process.env.APP_PORT || 4000);

// -------------------------------------------------------------
// EXPRESS app: proxy MCP and add REST helpers
// -------------------------------------------------------------
const app = express();
app.use(express.json());

// -------------------------------------------------------------
// GET /mcp/figma/file/:fileId → calls MCP via JSON-RPC
// -------------------------------------------------------------
app.get("/mcp/figma/file/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const upstreamUrl = `http://localhost:${LOCAL_MCP_PORT}/mcp`;

  try {
    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Figma-Token": FIGMA_API_TOKEN,
        Accept: "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "figma.file",
          arguments: { fileKey: fileId },
        },
      }),
    });

    const json = await response.json();

    if (json.error) {
      return res.status(500).json({ error: json.error.message });
    }

    res.json(json.result);
  } catch (err: any) {
    console.error("GET /mcp/figma/file/:fileId error:", err.message);
    res
      .status(500)
      .json({ error: "Proxy to MCP failed", details: err.message });
  }
});

// -------------------------------------------------------------
// REST helper: image export via Figma REST API
// -------------------------------------------------------------
app.get("/rest/images/:fileId/:nodeId", async (req, res) => {
  const { fileId, nodeId } = req.params;
  try {
    const metaRes = await fetch(
      `https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png`,
      {
        headers: { "X-Figma-Token": FIGMA_API_TOKEN },
      }
    );
    const meta = await metaRes.json();
    const url = meta.images?.[nodeId];
    if (!url) throw new Error("Image URL not found");
    const imgRes = await fetch(url);
    res.setHeader("Content-Type", "image/png");
    imgRes.body.pipe(res);
  } catch (err: any) {
    console.error("Image proxy error:", err.message);
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
    console.error("REST update error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// START the Express proxy server
// -------------------------------------------------------------
app.listen(APP_PORT, () => {
  console.log(`🚀 Proxy+REST server listening on http://localhost:${APP_PORT}`);
  console.log(`  • GET /mcp/figma/file/:fileId`);
  console.log(`  • GET /rest/images/:fileId/:nodeId`);
  console.log(`  • POST /rest/components/:componentId/description`);
});
