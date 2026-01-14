import { Request, Response, NextFunction } from "express";
import { CONFIG } from "../config/constants";
import { Logger } from "../utils/logger";

/**
 * Origin validation middleware
 * Validates the Origin and Referer headers to ensure requests come from allowed sources
 */
export function originValidation(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req.get("origin");
  const referer = req.get("referer");
  console.log("Origin:", origin);
  console.log("Referer:", referer);
  console.log("Path:", req.path);
  console.log("IP:", req.ip);

  // Skip validation for health check endpoint (used by Render/monitoring)
  if (req.path === "/api/health") {
    console.log("Health check request - allowing request");
    return next();
  }

  // Skip validation for time endpoint (used for client sync)
  if (req.path === "/api/time") {
    return next();
  }

  // Handle requests with no origin
  if (!origin) {
    // Allow GET requests (downloads, page navigation)
    if (req.method === "GET") {
      return next();
    }

    // specific check for development
    if (CONFIG.NODE_ENV === "development") {
      return next();
    }

    // Block non-GET requests without origin in production
    Logger.warn(
      "Origin validation failed - Missing origin for non-GET request",
      {
        path: req.path,
        method: req.method,
        ip: req.ip,
      }
    );
    res.status(403).json({
      error: "Forbidden - Missing origin",
    });
    return;
  }

  // Validate origin header
  if (origin && !CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    Logger.warn("Origin validation failed", {
      origin,
      referer,
      path: req.path,
      ip: req.ip,
    });

    res.status(403).json({
      error: "Forbidden - Invalid origin",
    });
    return;
  }

  // Validate referer header (additional security layer)
  if (referer) {
    const refererOrigin = new URL(referer).origin;
    if (!CONFIG.ALLOWED_ORIGINS.includes(refererOrigin)) {
      Logger.warn("Referer validation failed", {
        referer,
        refererOrigin,
        path: req.path,
        ip: req.ip,
      });

      res.status(403).json({
        error: "Forbidden - Invalid referer",
      });
      return;
    }
  }

  next();
}
