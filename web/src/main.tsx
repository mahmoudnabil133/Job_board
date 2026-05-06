import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { StrictMode } from 'react';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Login from './pages/Login.tsx';
import Layout from './layouts/Layout.tsx';
import Home from './pages/Home.tsx';
import Task from './pages/Task.tsx';
import Product from './pages/Products.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        index:true,
        element:<Home/>
      },
      {
        path: "/",
        element: <App />,
      },
      {
        path: "todo",
        element: <Task />,
      },
      {
        path: "products",
        element: <Product />,
      },
    ],
  },
  {
    path:'signup',
    element: <Login/>
  },
  {
    path:'login/:id',
    element: <Login/>
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  </StrictMode>,
);
