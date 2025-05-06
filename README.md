# HomeServer Backend Management

A lightweight HTTP backend server built with Node.js to manage basic tasks on a Linux server. This project includes functionality for retrieving and managing video metadata, searching for movies, and scheduling periodic tasks using cron jobs.

---

## Features

- **Video Metadata Retrieval**: Extracts detailed metadata (e.g., resolution, codec, audio details) from video files using `ffprobe`.
- **Movie Search**: Provides a search API to filter movies by name.
- **Cron Job Integration**: Automates periodic tasks like refreshing video metadata.
- **Cross-Origin Support**: Allows requests from any origin with CORS headers.

---

## Project Structure

- `index.js`: Main server file.
- `mediastat.js`: Handles video metadata extraction.
- `jsonCreator.js`: Reads and writes JSON files.
- `cron.js`: Manages cron job scheduling.
- `index.html`: Frontend for searching movies.

---

## Technologies Used
- **Programming Language**: Node.js
---

## Prerequisites

- Node.js (v16 or later)
- `ffprobe` installed (via `ffprobe-static` dependency)
- `cron`

---

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/prax93/homeserver-mgmt-backend.git
    cd homeserver-mgmt-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables:
    - Copy `.env.example` to `.env` and update the values.
    Example `.env` file:
    ```plaintext
    SERVER_PORT=3000
    MEDIA_LOCATION=./videos
    CRON_ENABLED=true
    CRON_SCHEDULE='0 0 * * 7'
    ```

4. Start the development server:
    ```bash
    node --env-file ./.env index.js
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

## Cron Job

If `CRON_ENABLED` is set to `true`, a cron job will periodically refresh the video metadata based on the `CRON_SCHEDULE`environment variable.
If CRON_SCHEDULE is not defined the Cronjob runs every Sunday on 00:00

---

## Frontend

The project includes a simple HTML frontend (`index.html`) for searching movies. Open the file in a browser and use the search bar to query the backend.

---

## Development

### Debugging

The project includes a VS Code launch configuration (`.vscode/launch.json`) for debugging. To debug:

1. Open the project in VS Code.
2. Press `F5` to start debugging.

---

## Dependencies

- `cron`: For scheduling periodic tasks.
- `ffprobe`: For extracting video metadata.
- `ffprobe-static`: Provides a static binary of `ffprobe`.

---

## License

This project is licensed under the ISC License. See the `LICENSE` file for details.

---

## Author

Created by **prax93**.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## Issues

If you encounter any issues, please report them [here](https://github.com/prax93/homeserver-mgmt-backend/issues).