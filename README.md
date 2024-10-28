# Contacts App

A contact management application built with React and TypeScript, featuring Google Maps integration and Material-UI components.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd contacts-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Google Maps API key:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
Uses Jest and React Testing Library for running tests.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

## Project Structure

```
contacts-app/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   └── index.tsx
├── public/
├── package.json
└── tsconfig.json
```

## Technologies Used

- React 18
- TypeScript
- Material-UI (MUI)
- Google Maps JavaScript API
- React Router DOM
- Axios
- Jest & React Testing Library
- ESLint & Prettier

## Development

- The project uses TypeScript for type safety
- ESLint and Prettier are configured for code consistency
- Testing is set up with Jest and React Testing Library
- Routing is handled by React Router DOM v6
- HTTP requests are managed with Axios

## Browser Support

The application supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

For detailed browser support information, check the `browserslist` configuration in `package.json`.