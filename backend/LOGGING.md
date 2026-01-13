# Logging System

## Overview

This backend uses Winston for file-based logging. All application logs are automatically saved to files.

## Log Files

### Location

All log files are stored in the `logs/` directory at the project root:

- `logs/combined.log` - All logs (info, warn, error, debug)
- `logs/error.log` - Error logs only

### Log Rotation

- Maximum file size: 5MB
- Maximum files kept: 5
- Older files are automatically deleted when limits are reached

## Viewing Logs

### PowerShell Commands

View the last 20 lines of all logs:

```powershell
Get-Content logs\combined.log -Tail 20
```

View the last 20 lines of errors only:

```powershell
Get-Content logs\error.log -Tail 20
```

Follow logs in real-time:

```powershell
Get-Content logs\combined.log -Wait -Tail 10
```

Search for specific errors:

```powershell
Select-String -Path logs\error.log -Pattern "your search term"
```

### Linux/Mac Commands

View the last 20 lines of all logs:

```bash
tail -n 20 logs/combined.log
```

View the last 20 lines of errors only:

```bash
tail -n 20 logs/error.log
```

Follow logs in real-time:

```bash
tail -f logs/combined.log
```

Search for specific errors:

```bash
grep "your search term" logs/error.log
```

## Log Format

Logs are stored in JSON format with the following structure:

```json
{
  "level": "info",
  "message": "Server started",
  "timestamp": "2026-01-13 18:07:39",
  "service": "tempshare-backend",
  "port": 3000,
  "env": "development"
}
```

## Usage in Code

```typescript
import { Logger } from "./utils/logger";

// Information logs
Logger.info("Server started", { port: 3000 });

// Warning logs
Logger.warn("Rate limit approaching", { user: "123" });

// Error logs (automatically includes stack traces)
Logger.error("Database connection failed", {
  error: err.message,
  stack: err.stack,
});

// Debug logs
Logger.debug("Processing request", { requestId: "abc123" });
```

## Environment Differences

### Development

- Logs to both files AND console (with colors)
- Easier debugging experience

### Production

- Logs to files only (no console output)
- Better performance
- Complete audit trail

## Troubleshooting

If log files are not being created:

1. Ensure the application has write permissions
2. Check that the `logs/` directory exists (created automatically)
3. Review console output for Winston initialization errors

The `logs/` directory is automatically created when the application starts.
