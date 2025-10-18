import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

import Home from './pages/Home.jsx';
import Workspace from './pages/Workspace.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Report from './pages/Report.jsx';
import Dashboard from './pages/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "workspace",
            element: <Workspace />,
          },
          {
            path: "report/:reportId",
            element: <Report />,
          },
          {
            path: "dashboard", 
            element: <Dashboard />,
          },
        ]
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);