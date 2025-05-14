# RAG Project Frontend

A React-based frontend for the RAG (Retrieval-Augmented Generation) system. This application provides a user interface for searching academic papers and chatting with an AI assistant that has access to a research paper database.

## Features

- **Search Interface**: Search for academic papers with filtering options.
- **Chat Interface**: Chat with an AI assistant that can answer questions about research papers.
- **Responsive Design**: Works on desktop and mobile devices.
- **Material UI**: Modern UI components with a clean, professional look.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rag-project.git
   cd rag-project/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8000 # Adjust if your backend is on a different URL
   ```

### Running in Development Mode

```
npm start
```
or
```
yarn start
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Building for Production

```
npm run build
```
or
```
yarn build
```

This will create a `build` folder with optimized production files.

## Project Structure

- `src/components/`: React components
- `src/hooks/`: Custom React hooks
- `src/services/`: API and service functions
- `src/styles/`: CSS and styling files

## Main Components

- `Layout.jsx`: Main layout with responsive drawer
- `SearchUI.jsx`: Interface for searching papers
- `ChatUI.jsx`: Chat interface for interacting with the AI assistant

## Dependencies

- React
- React Router
- Material UI
- Axios
- React Markdown

## Backend Integration

This frontend is designed to work with the RAG project backend. Make sure the backend server is running before using the application. 