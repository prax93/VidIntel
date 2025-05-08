# VidIntel

A lightweight HTTP backend server built with Node.js to manage basic tasks on a Linux server. This project includes functionality for retrieving and managing video metadata, searching for movies, and scheduling periodic tasks using cron jobs.

---
## Features

- **Video Metadata Retrieval**: Extracts detailed metadata (e.g., resolution, codec, audio details) from video files using `ffprobe`.
- **Movie Search**: Provides a search API to filter movies by name.
- **Cron Job Integration**: Automates periodic tasks like refreshing video metadata.
- **Cross-Origin Support**: Allows requests from any origin with CORS headers.
---

## Project Structure
- `src/index.js`: Entry point of the server application.
- `src/mediastat.js`: Module for extracting video metadata using `ffprobe`.
- `src/jsonCreator.js`: Utility for managing JSON data storage and retrieval.
- `src/cron.js`: Scheduler for automating periodic tasks with cron jobs.
- `public/index.html`: Simple frontend interface for movie search functionality.
---

## Installation
1. Run Docker Container:
    ```bash
    docker run -d \
     --name vidintel \
     -p 3000:3000 \
     -p 80:80 \
     -e CRON_ENABLED="true" \
     -e CRON_SCHEDULE="35 11 * * *" \
     -e TZ="Europe/Zurich" \
     -v ~/Downloads:/movies:ro \
    prax93/vidintel:latest
    ```
---

## API Documentation

### Endpoints

#### `GET /?search=<query>`
- **Description**: Searches for movies by name.
- **Query Parameters**:
  - `search`: The search term to filter movies.
- **Response**: A JSON array of matching movies.

#### `GET /refresh`
- **Description**: Refreshes the video metadata by scanning the `MEDIA_LOCATION` directory and creates a new local JSON File.

---

## Node Dependencies

- `cron`: For scheduling periodic tasks.
- `ffprobe`: For extracting video metadata.
- `ffprobe-static`: Provides a static binary of `ffprobe`.

---

## Author

Created by **prax93**.

---
