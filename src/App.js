import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SitePrincipalContent from "./siteprincipal/App";
import "./shared/styles/Fonts.css";

function App() {
  return (
    <Router>
      <SitePrincipalContent />
    </Router>
  );
}

export default App;
