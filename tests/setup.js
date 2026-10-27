/**
 * Global test setup for MBKTemplate — runs before test suites.
 */
import { vi } from "vitest";

process.env.NODE_ENV = "test";
process.env.SESSION_SECRET = "test-session-secret-template";
process.env.MAIN_SECRET_TOKEN = "12345";
process.env.DB_TYPE = "sqlite";
process.env.SQLITE_PATH = ":memory:";

// Mock sessPerm for deterministic testing
vi.mock("mbkauthe", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    sessPerm: (permission) => (req, res, next) => {
      // In test mode, allow or check user session
      if (req.headers["x-test-auth-role"]) {
        req.session = req.session || {};
        req.session.user = {
          user_id: 1,
          username: "testuser",
          role: req.headers["x-test-auth-role"],
          allowed_apps: ["mbktemplate"]
        };
      }
      next();
    },
    validateSessionAndRole: (role = "Any") => (req, res, next) => {
      if (!req.session?.user && !req.headers["x-test-auth-role"]) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    },
  };
});
