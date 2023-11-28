import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "app/app";
import {
  BookDetails,
  bookLoader,
} from "components/organisms/book-details/book-details";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "books/:isbn",
        element: <BookDetails />,
        loader: bookLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
