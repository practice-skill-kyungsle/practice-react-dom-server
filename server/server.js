import express from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import App from "../src/App";

const app = express();

const getHtml = (req, res) => {
  // 빌드된 index.html 파일을 읽습니다.
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Some Error Happended!");
    }
    // React 컴포넌트를 문자열로 변환합니다. 이때 StaticRouter를 사용하여 라우팅 컨텍스트를 제공합니다.
    const html = ReactDOMServer.renderToString(
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    );
    // 읽은 HTML 파일의 <div id="root"></div> 부분을 서버사이드 렌더링 결과로 대체합니다.
    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    );
  });
};

// 루트 경로에 대한 GET 요청을 처리합니다. SSR 함수를 호출합니다.
app.get("/", getHtml);

// Express에 정적 파일 경로를 설정합니다. 이는 빌드된 클라이언트 사이드 애플리케이션을 제공하기 위함입니다.
app.use(express.static(path.resolve(__dirname, "..", "build")));

// 루트 경로에 대한 또 다른 GET 요청 핸들러입니다. 이 코드는 실제로는 도달할 수 없는 코드이며, 위의 app.get("/", getHtml); 에 의해 덮어씌워집니다.
app.get("/", (req, res) => {
  return res.send("ExpressJS running successfully");
});

// 3005 포트에서 애플리케이션을 시작합니다.
app.listen(3005, () => {
  console.log("App is launched! on port 3005");
});
