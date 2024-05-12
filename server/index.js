// npm run ssr 명령어가 처음 nodejs로 실행하는 게 바로 server폴더의 index.js 파일입니다.

require("ignore-styles");

require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

require("./server.js");
