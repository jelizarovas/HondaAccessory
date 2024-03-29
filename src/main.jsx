import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter as Router, Route } from "react-router-dom";
import TrimEdit from "./admin/TrimEdit.jsx";
import { ClientView } from "./ClientView.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Route exact path="/admin" component={TrimEdit} />
    <Route exact path="/" component={App} />
    <Route exact path="/c/" component={ClientView} />
  </Router>
  // <React.StrictMode>
  // </React.StrictMode>,
);
