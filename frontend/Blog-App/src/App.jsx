import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "./Layout/Layout.jsx";
import { CreateBlog } from "./pages/ProtectedPages/CreateBlog.jsx";
import { EditBlog } from "./pages/ProtectedPages/EditBlog.jsx";
import { BlogDetails } from "./pages/ProtectedPages/BlogDetails.jsx";
import Error from "./pages/Error.jsx";
import "./App.css";
import Hero from "./pages/Hero.jsx";
import Profile from "./pages/Profile.jsx";
import { useAuthCheck } from "./hooks/useAuthCheck.js";

function App() {

  const isAuthenticated = useAuthCheck();
  // Define routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          path: "",
          element: <Hero />,
        },
        {
          path: "/create",
          element: isAuthenticated? <CreateBlog /> : <Navigate to="/" replace/>,
        },
        {
          path: "/edit/:id",
          element: isAuthenticated? <EditBlog />: <Navigate to="/" replace/>,
        },
        {
          path: "/blog/:id",
          element: isAuthenticated? <BlogDetails />: <Navigate to="/" replace/>,
        },

        {
          path: "/profile",
          element: isAuthenticated? <Profile />: <Navigate to="/" replace/>,
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
