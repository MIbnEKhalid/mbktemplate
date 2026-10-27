/**
 * mbktemplate — permission manifest.
 *
 * Declares this application's permission surface and role mapping.
 * App key resolution, permission prefixing, and catalog sync are
 * handled by mbkauthe's `definePermissions` and `syncAppPermissions`.
 *
 * Feature -> action mapping:
 *   items -> create, read, edit, delete items
 *   admin -> view, manage administrative dashboard & settings
 */
import { definePermissions, syncAppPermissions } from "mbkauthe";

const MANIFEST = {
  items: {
    create: "Create new items",
    read: "Read and list items",
    edit: "Edit existing items",
    delete: "Delete items",
  },
  admin: {
    view: "Access administrative area",
    manage: "Manage application settings and users",
  },
  storage: {
    view: "View and download bucket files",
    upload: "Upload bucket files",
    delete: "Delete bucket files",
  },
  admindb: {
    access: "Access database management console",
  },
};

const ROLES = {
  admin: {
    label: "Application Administrator",
    description: "Full administrative access to items, storage, and database management",
    permissions: ["items:*", "admin:*", "storage:*", "admindb:*"],
  },
  normaluser: {
    label: "Standard User",
    description: "Permission to read and create items, and view storage",
    permissions: ["items:read", "items:create", "storage:view"],
  },
};

export const Permissions = definePermissions(MANIFEST, {
  fallbackAppKey: "mbktemplate",
  roles: ROLES,
});

/**
 * Register this app's permissions & roles in the centralized mbkauthe catalog.
 * Idempotent, safe to run anytime via `npm run sync_permissions`.
 */
export async function syncTemplatePermissions() {
  try {
    const result = await syncAppPermissions(Permissions, { fallbackAppKey: "mbktemplate" });
    if (result) {
      console.log(`[mbktemplate] Permissions & roles synced (${result.synced} permissions, ${result.rolesSynced} roles)`);
    }
    return result;
  } catch (err) {
    console.warn("[mbktemplate] Permission catalog sync skipped:", err?.message || err);
    return null;
  }
}

export default Permissions;
