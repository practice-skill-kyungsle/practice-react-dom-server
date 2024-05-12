import React from "react";
import "./App.css";
import { Link, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Server Side Rendering Test</h1>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "2em",
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>
        <Routes>
          <Route path="/" element={<div>Home</div>}></Route>
          <Route path="/about" element={<div>About</div>}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
