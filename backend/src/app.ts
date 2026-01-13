import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import roomRoutes from "./routes/roomRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { Logger } from "./utils/logger";
import { CONFIG } from "./config/constants";
import { originValidation } from "./middlewares/securityHeaders";

export function createApp(): Application {
  const app = express();

  // Trust proxy - required for Render.com to get real IP addresses
  app.set("trust proxy", 1);

  // Helmet.js security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // Strict CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, postman) in development
        if (!origin && CONFIG.NODE_ENV === "development") {
          return callback(null, true);
        }

        // Check if origin is in whitelist
        if (origin && CONFIG.ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          Logger.warn("CORS blocked request from origin", { origin });
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Origin validation middleware (additional layer of security)
  app.use(originValidation);

  // Body parsers
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // API routes
  app.use("/api", roomRoutes);

  // Error handler (must be last)
  app.use(errorHandler);

  Logger.info("Express app configured with security", {
    allowedOrigins: CONFIG.ALLOWED_ORIGINS,
  });

  return app;
}
