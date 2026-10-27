import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { Permissions } from "../src/permissions.js";

describe("MBKTemplate Application Tests", () => {
  test("Permissions manifest has required features and roles", () => {
    expect(Permissions).toBeDefined();
    expect(Permissions.items).toBeDefined();
    expect(Permissions.admin).toBeDefined();
  });

  test("GET / renders the landing page", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("MBKTemplate");
  });

  test("GET /api/health returns health status envelope", async () => {
    const res = await request(app)
      .get("/api/health")
      .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBeDefined();
    expect(res.body.uptime).toBeDefined();
  });

  test("GET /unknown-route returns 404 handler", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.status).toBe(404);
  });

  test("GET /api/unknown-endpoint returns JSON 404 envelope", async () => {
    const res = await request(app)
      .get("/api/unknown-endpoint")
      .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

    expect(res.status).toBe(404);
    expect(res.headers["content-type"]).toContain("application/json");
    expect(res.body.success).toBe(false);
  });

  test("Malicious scanner user-agents are rejected by bot protection", async () => {
    const res = await request(app)
      .get("/api/health")
      .set("User-Agent", "sqlmap/1.5.2#stable");

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("scanner");
  });
});
