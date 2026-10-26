import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../server/app.js";

function makeTestApp() {
  const designs = new Map();

  const pool = {
    async query(sql, params = []) {
      if (sql.includes("SELECT 1")) {
        return { rows: [{ "?column?": 1 }], rowCount: 1 };
      }

      if (sql.startsWith("SELECT data FROM designs WHERE id")) {
        const data = designs.get(params[0]);
        return {
          rows: data ? [{ data: structuredClone(data) }] : [],
          rowCount: data ? 1 : 0
        };
      }

      if (sql.startsWith("SELECT data FROM designs ORDER")) {
        return {
          rows: [...designs.values()]
            .map(data => ({ data: structuredClone(data) })),
          rowCount: designs.size
        };
      }

      if (sql.startsWith("INSERT INTO designs")) {
        const [id, json] = params;
        if (designs.has(id)) return { rows: [], rowCount: 0 };
        const data = JSON.parse(json);
        designs.set(id, data);
        return { rows: [{ data: structuredClone(data) }], rowCount: 1 };
      }

      if (sql.startsWith("UPDATE designs")) {
        const [id, json] = params;
        if (!designs.has(id)) return { rows: [], rowCount: 0 };
        const data = JSON.parse(json);
        designs.set(id, data);
        return { rows: [{ data: structuredClone(data) }], rowCount: 1 };
      }

      if (sql.startsWith("DELETE FROM designs")) {
        const existed = designs.delete(params[0]);
        return { rows: [], rowCount: existed ? 1 : 0 };
      }

      throw new Error(`Unexpected SQL in test: ${sql}`);
    }
  };

  return createApp(pool);
}

describe("Roomify API", () => {
  let app;

  afterEach(() => {
    app = undefined;
  });

  it("checks API and database health", async () => {
    app = makeTestApp();
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.database).toBe("connected");
  });

  it("creates and lists a design", async () => {
    app = makeTestApp();
    const design = { id: "test-1", name: "Test Room", elements: [] };

    const created = await request(app).post("/api/designs").send(design);
    expect(created.status).toBe(201);

    const list = await request(app).get("/api/designs");
    expect(list.body).toEqual([design]);
  });

  it("gets a design by ID", async () => {
    app = makeTestApp();
    await request(app)
      .post("/api/designs")
      .send({ id: "test-2", name: "Bedroom", elements: [] });

    const response = await request(app).get("/api/designs/test-2");
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Bedroom");
  });

  it("updates a design", async () => {
    app = makeTestApp();
    await request(app)
      .post("/api/designs")
      .send({ id: "test-3", name: "Old Name", elements: [] });

    const response = await request(app)
      .put("/api/designs/test-3")
      .send({ name: "Updated Name" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Name");
  });

  it("deletes a design", async () => {
    app = makeTestApp();
    await request(app)
      .post("/api/designs")
      .send({ id: "test-4", name: "Delete Me", elements: [] });

    const deleted = await request(app).delete("/api/designs/test-4");
    expect(deleted.status).toBe(204);

    const missing = await request(app).get("/api/designs/test-4");
    expect(missing.status).toBe(404);
  });

  it("rejects invalid designs", async () => {
    app = makeTestApp();
    const response = await request(app)
      .post("/api/designs")
      .send({ id: "invalid", name: "", elements: [] });

    expect(response.status).toBe(400);
  });

  it("returns 409 for duplicate design IDs", async () => {
    app = makeTestApp();
    const design = { id: "duplicate", name: "Room", elements: [] };

    await request(app).post("/api/designs").send(design);
    const duplicate = await request(app).post("/api/designs").send(design);

    expect(duplicate.status).toBe(409);
  });

  it("returns 404 for missing designs", async () => {
    app = makeTestApp();
    const response = await request(app).get("/api/designs/missing");
    expect(response.status).toBe(404);
  });
});
