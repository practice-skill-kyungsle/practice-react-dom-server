import express from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import App from "../src/App";

const app = express();

const getHtml = (req, res) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Some Error Happended!");
    }
    const html = ReactDOMServer.renderToString(
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    );
    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    );
  });
};

app.get("/", getHtml);

app.use(express.static(path.resolve(__dirname, "..", "build")));

app.get("/", (req, res) => {
  return res.send("ExpressJS running successfully");
});

app.listen(3005, () => {
  console.log("App is launched! on port 3005");
});
