import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Signin from './components/Signin'
import Signup from './components/Signup'
import Profile from './components/Profile'
import Recovery from './components/Recovery'
import PageNotFound from './components/PageNotFound'
import Password from './components/Password'
import Reset from './components/Reset'
import { AuthorizeUser, RouteProvider } from './utilities/middleware/auth';
const router=createBrowserRouter([
  {
    path:'/',
    element:<Signin></Signin>
  },
  {
    path:'/signup',
    element:<Signup></Signup>
  },
  {
    path:'/profile',
    element:<AuthorizeUser><Profile></Profile></AuthorizeUser>
  },
  {
    path:'/recovery',
    element:<Recovery></Recovery>
  },
  {
    path:'/PageNotFound',
    element:<PageNotFound></PageNotFound>
  },
  {
    path:'/password',
    element:<RouteProvider><Password></Password></RouteProvider>
  },
  {
    path:'/Reset',
    element:<Reset></Reset>
  },
  
  
])

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
