import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

// Global rate limiter - 100 requests per 15 minutes
const globalLimiter = new RateLimiterMemory({
  points: 100,
  duration: 900, // 15 minutes
});

// Room creation rate limiter - 5 per hour per IP
const roomCreationLimiter = new RateLimiterMemory({
  points: 5,
  duration: 3600, // 1 hour
});

// File upload rate limiter - 20 per hour per IP
const fileUploadLimiter = new RateLimiterMemory({
  points: 20,
  duration: 3600, // 1 hour
});

// Generic rate limit middleware (global)
export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ip = req.ip || "unknown";
    await globalLimiter.consume(ip);
    next();
  } catch (error) {
    res.status(429).json({
      error: "Too many requests. Please try again later.",
    });
  }
}

// Rate limiter for room creation
export async function roomCreationRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ip = req.ip || "unknown";
    await roomCreationLimiter.consume(ip);
    next();
  } catch (error) {
    res.status(429).json({
      error: "Too many rooms created. Please wait before creating more.",
    });
  }
}

// Rate limiter for file uploads
export async function fileUploadRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ip = req.ip || "unknown";
    await fileUploadLimiter.consume(ip);
    next();
  } catch (error) {
    res.status(429).json({
      error: "Too many file uploads. Please wait before uploading more.",
    });
  }
}
