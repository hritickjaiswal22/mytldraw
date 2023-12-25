import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import Home from "@/pages/home";
import Editor from "@/pages/editor";
import StyledLoader from "@/components/styledLoader";
import { useEffect } from "react";

const UserProtectedRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location || !location.state || !location.state.username) navigate("/");
  }, []);

  if (!location || !location.state || !location.state.username)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <StyledLoader />
      </div>
    );

  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<UserProtectedRoute />}>
          <Route path="/:roomId" element={<Editor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
