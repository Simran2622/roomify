
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 4000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "designs.json");

fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]", "utf8");
}

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
}));
app.use(express.json({ limit: "15mb" }));

function readDesigns() {
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeDesigns(designs) {
  fs.writeFileSync(dataFile, JSON.stringify(designs, null, 2));
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/designs", (req, res) => {
  res.json(readDesigns());
});

app.get("/api/designs/:id", (req, res) => {
  const design = readDesigns().find(
    item => item.id === req.params.id
  );

  if (!design) {
    return res.status(404).json({ error: "Design not found" });
  }

  res.json(design);
});

app.post("/api/designs", (req, res) => {
  const design = req.body;

  if (!design?.id || !design?.name ||
      !Array.isArray(design.elements)) {
    return res.status(400).json({
      error: "A valid design is required"
    });
  }

  const designs = readDesigns();

  if (designs.some(item => item.id === design.id)) {
    return res.status(409).json({
      error: "Design already exists"
    });
  }

  designs.unshift(design);
  writeDesigns(designs);

  res.status(201).json(design);
});

app.put("/api/designs/:id", (req, res) => {
  const designs = readDesigns();
  const index = designs.findIndex(
    item => item.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({ error: "Design not found" });
  }

  designs[index] = {
    ...designs[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };

  writeDesigns(designs);
  res.json(designs[index]);
});

app.delete("/api/designs/:id", (req, res) => {
  const designs = readDesigns();
  const remaining = designs.filter(
    item => item.id !== req.params.id
  );

  if (remaining.length === designs.length) {
    return res.status(404).json({ error: "Design not found" });
  }

  writeDesigns(remaining);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Roomify API running at http://localhost:${PORT}`);
});
