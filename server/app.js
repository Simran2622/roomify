import express from "express";
import cors from "cors";

export function createApp(pool) {
  const app = express();

  const allowedOrigins = [
    "http://localhost:5173",
    "https://roomify-app-simran.netlify.app",
    process.env.CLIENT_ORIGIN
  ].filter(Boolean);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    }
  }));

  app.use(express.json({ limit: "15mb" }));

  function validDesign(design) {
    return Boolean(
      design &&
      typeof design === "object" &&
      !Array.isArray(design) &&
      typeof design.id === "string" &&
      design.id.trim() &&
      design.id.length <= 200 &&
      typeof design.name === "string" &&
      design.name.trim() &&
      design.name.length <= 200 &&
      Array.isArray(design.elements)
    );
  }

  app.get("/api/health", async (req, res, next) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok", database: "connected" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/designs", async (req, res, next) => {
    try {
      const result = await pool.query(
        "SELECT data FROM designs ORDER BY updated_at DESC"
      );
      res.json(result.rows.map(row => row.data));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/designs/:id", async (req, res, next) => {
    try {
      const result = await pool.query(
        "SELECT data FROM designs WHERE id = $1",
        [req.params.id]
      );

      if (!result.rowCount) {
        return res.status(404).json({ error: "Design not found" });
      }

      res.json(result.rows[0].data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/designs", async (req, res, next) => {
    try {
      const design = req.body;

      if (!validDesign(design)) {
        return res.status(400).json({
          error: "A valid design with id, name, and elements is required"
        });
      }

      const result = await pool.query(
        `INSERT INTO designs (id, data)
         VALUES ($1, $2::jsonb)
         ON CONFLICT (id) DO NOTHING
         RETURNING data`,
        [design.id, JSON.stringify(design)]
      );

      if (!result.rowCount) {
        return res.status(409).json({ error: "Design already exists" });
      }

      res.status(201).json(result.rows[0].data);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/designs/:id", async (req, res, next) => {
    try {
      const changes = req.body;

      if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
        return res.status(400).json({ error: "Invalid design data" });
      }

      const existing = await pool.query(
        "SELECT data FROM designs WHERE id = $1",
        [req.params.id]
      );

      if (!existing.rowCount) {
        return res.status(404).json({ error: "Design not found" });
      }

      const updated = {
        ...existing.rows[0].data,
        ...changes,
        id: req.params.id,
        updatedAt: new Date().toISOString()
      };

      if (!validDesign(updated)) {
        return res.status(400).json({ error: "Invalid design data" });
      }

      const result = await pool.query(
        `UPDATE designs SET data = $2::jsonb, updated_at = NOW()
         WHERE id = $1 RETURNING data`,
        [req.params.id, JSON.stringify(updated)]
      );

      res.json(result.rows[0].data);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/designs/:id", async (req, res, next) => {
    try {
      const result = await pool.query(
        "DELETE FROM designs WHERE id = $1",
        [req.params.id]
      );

      if (!result.rowCount) {
        return res.status(404).json({ error: "Design not found" });
      }

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  app.use((err, req, res, next) => {
    console.error("API error:", err.message);

    if (res.headersSent) return next(err);

    if (err.type === "entity.too.large") {
      return res.status(413).json({ error: "Request body is too large" });
    }

    if (err instanceof SyntaxError && err.status === 400) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    if (err.message === "Origin not allowed by CORS") {
      return res.status(403).json({ error: "Origin not allowed" });
    }

    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
