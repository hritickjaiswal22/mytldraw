import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "@/pages/home";
import Editor from "@/pages/editor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:code" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
