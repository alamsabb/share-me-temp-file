import { createApp } from "./app";
import { CONFIG } from "./config/constants";
import { cleanupJob } from "./jobs/CleanupJob";
import { fileService } from "./services/FileService";
import { Logger } from "./utils/logger";

async function bootstrap(): Promise<void> {
  try {
    const app = createApp();

    app.listen(CONFIG.PORT, () => {
      Logger.info("Server started", {
        port: CONFIG.PORT,
        env: CONFIG.NODE_ENV,
      });
    });
    await fileService.ensureUploadDirectory();

    await cleanupJob.runStartupCleanup();

    cleanupJob.start();

    process.on("SIGTERM", () => {
      Logger.info("SIGTERM received, shutting down gracefully");
      cleanupJob.stop();
      process.exit(0);
    });

    process.on("SIGINT", () => {
      Logger.info("SIGINT received, shutting down gracefully");
      cleanupJob.stop();
      process.exit(0);
    });
  } catch (error) {
    Logger.error("Failed to start server", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    process.exit(1);
  }
}

bootstrap();
