import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/layouts/AppLayout";
import NoMatch from "./pages/NoMatch";
import Error500 from "./pages/Error500";

/*
  The portfolio is a single scrolling page — every section is reachable by
  anchor, so there are no nested content routes. Only the error pages stand
  alone.
*/
export const router = createBrowserRouter([
  { path: "/", element: <AppLayout />, errorElement: <Error500 /> },
  { path: "/error", element: <Error500 /> },
  { path: "*", element: <NoMatch /> },
]);
