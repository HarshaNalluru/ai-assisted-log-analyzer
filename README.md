# AMQP Log Analyzer

A web application for analyzing AMQP logs (e.g., from @azure/service-bus and @azure/event-hubs) using AI-powered insights. The app leverages Azure OpenAI to provide structured, chunks of summaries and details for uploaded log files.

## Features

- Upload and view raw log files
- AI-generated summary and detailed chunk insights for logs
- Interactive, expandable UI for exploring log chunks and their purposes
- Query panel for asking questions about the logs
- Dynamic, real-time rendering as logs are analyzed

## Usage

1. Install dependencies:
   ```cmd
   npm install
   ```
2. Set up your `.env` file in the project root with your OpenAI or Azure OpenAI credentials:
   ```env
   REACT_APP_AZURE_OPENAI_ENDPOINT=your-endpoint
   REACT_APP_AZURE_OPENAI_KEY=your-key
   ```
3. Start the development server:
   ```cmd
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) and upload a log file or use the sample.

## How It Works

- The log file is split into chunks and sent to the OpenAI API for analysis.
- Each chunk is summarized with its purpose and key events/errors in a structured manner.
- The UI updates dynamically as each chunk is processed, showing a tree of expandable insights.
- You can ask questions about the logs in natural language, and the system will provide relevant insights based on the queries.

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository and create a new branch for your feature or bugfix.
2. Make your changes in the `src/` directory, following the existing code style.
3. Add or update tests in `src/App.test.tsx` or create new test files as needed.
4. Run `npm test` to ensure all tests pass.
5. Submit a pull request with a clear description of your changes.

For major changes, please open an issue first to discuss what you would like to change.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
