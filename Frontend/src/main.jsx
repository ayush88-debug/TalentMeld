import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

import Home from './Pages/Home.jsx';
import Workspace from './Pages/Workspace.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Report from './Pages/Report.jsx';

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
          }
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