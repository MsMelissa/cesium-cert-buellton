# Cesium Dev Certification: Instigating Community Engagement in City Planning

A cutting-edge full-stack JavaScript application built with [CesiumJS](https://cesium.com/platform/cesiumjs/). This project leverages real-time data from NREL, OpenWeatherMap, and OpenAI to empower city planners and community stakeholders with actionable solar and urban planning insights.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Overview

**Cesium Dev Certification: Instigating Community Engagement in City Planning** is an advanced JavaScript project that demonstrates modern web development practices through:

- **Interactive 3D Visualization:** Renders a detailed 3D city model using CesiumJS.
- **Dynamic UI and Analysis:** Provides real-time solar potential analysis with contextual building data.
- **API Integration:** Seamlessly fetches data from NREL and OpenWeatherMap while leveraging OpenAI for natural language generation.
- **Modular Architecture:** Features a clean separation between a dynamically generated front-end (`main.js`) and back-end API services (powered by Node.js/Express).

This repository is targeted at JavaScript developers and urban planners interested in integrating geospatial visualization with AI-driven analytics.

## Features

- **Cesium 3D Viewer:** High-performance, interactive geospatial rendering.
- **Dynamic UI Controls:** Filter buildings by status, season, orientation, and level.
- **Real-Time Analysis:** Solar potential calculations and energy cost estimates.
- **LLM Integration:** Uses OpenAI's API to generate contextual highlights and cautions for urban planning.
- **Responsive Design:** Modern UI with adaptive styling and dynamic content rendering.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/MsMelissa/cesium-cert-buellton.git
cd cesium-cert-buellton
npm install
```
## Usage

1. **Configure Environment Variables:**  
   Create a `.env` file in the root directory (this file is ignored by Git) with the following content:
   ```dotenv
   OPENAI_API_KEY=your_openai_api_key_here
   NREL_API_KEY=your_nrel_api_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

2. **Start the Server:**
Run the Node.js server:
```bash
npm start
```
3. **View the Application:**
Open your browser and navigate to http://localhost:3000 to access the application.

## Project Structure

```graphql
cesium-cert-buellton/
├── index.html          # Minimal HTML shell that bootstraps the front-end.
├── main.js             # Main JavaScript file: dynamically creates UI, initializes Cesium, and handles analysis.
├── server.js           # Node.js/Express server: serves static files and provides API endpoints.
├── package.json        # Project metadata and dependency configuration.
├── package-lock.json   # Exact versions of installed dependencies.
├── .env                # Environment variables (ignored by Git).
├── .gitignore          # Specifies files/folders to ignore (e.g., node_modules, .env).
└── templates/
    └── bucket.css      # Custom CSS for additional styling.
```

## Environmental Variables
The project requires the following environment variables (set in your .env file or via your hosting platform such as Railway):
    OPENAI_API_KEY: Your API key for OpenAI to generate LLM text.
    NREL_API_KEY: Your API key for fetching solar energy data from NREL.
    OPENWEATHER_API_KEY: Your API key for weather data from OpenWeatherMap.

## API Endpoints
The back-end server provides these endpoints:
- GET /api/config:
  Returns safe-to-share configuration data, such as:
  ```json
    {
  "NREL_API_KEY": "your_nrel_api_key",
  "OPENWEATHER_API_KEY": "your_openweather_api_key"
    }
    ```
- POST /api/generateLLMText:
Accepts a JSON payload with a prompt field and returns generated text from OpenAI.
Example payload:
  ```json
  {
  "prompt": "Provide a city planner’s highlights for the property located at ['YOUR_CITY']..."
  }
  ```

## Contributing
Contributions are welcome! Please follow these guidelines:

    Fork the repository and create a new branch for your feature or fix.
    Ensure your code adheres to the established coding style (ESLint is used for linting).
    Include tests for any new features or significant changes.
    Submit a pull request with a clear description of your changes.

For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the ISC License. See the LICENSE file for details.

*This project demonstrates advanced JavaScript and CesiumJS integration for real-world urban planning challenges. It serves as both a learning tool and a practical reference for developers in the geospatial and AI domains.*
