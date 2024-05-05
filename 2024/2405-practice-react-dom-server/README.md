# ⭐ express로 react dom server 제작하여 활용해보기

react와 express를 합치면 react에서도 SSR을 구현할 수 있다고 한다.

강남언니팀의 Carter님께서 알려주셨으며 부끄럽게도 나는 React와 Next의 활용법과 유래에 대해서 무지했던 것 같다.

NextJS 자체는 express로 구현되어 있으며, 아마 이 곳에서 구현한 느낌으로 제작되어 있을 것 같다. 즉, NextJS는 ReactJS에서 SSR을 사용자가 조금 더 편리하게 해주는 도구일 뿐이다.

아래의 사이트에서 많은 부분 참고했다

https://mycodings.fly.dev/blog/2023-07-09-howto-react-server-side-rendering-with-express

## 공부한 것

### ignore-styles package 의 필요 이유

React와 같은 프레임워크에서 서버 사이드 렌더링을 구현할 때, 클라이언트 사이드에서만 필요한 스타일시트나 이미지와 같은 정적 자원들이 문제를 일으킬 수 있습니다. ignore-styles를 사용함으로써 이러한 자원들을 서버에서 무시하고, 오직 JavaScript 코드만 실행하여 초기 HTML을 생성할 수 있게 됩니다.

### StaticRouter

react-router-dom의 StaticRouter는 주로 **서버 측 렌더링 환경에서 사용**됩니다. 클라이언트 사이드에서 사용하는 BrowserRouter와 달리, StaticRouter는 서버에서 요청을 처리할 때 사용됩니다. 이 컴포넌트는 서버에서 한 번의 요청으로 페이지를 렌더링 할 때 사용되며, 브라우저의 URL이 변경될 때마다 새로운 페이지를 로드하는 대신 서버에 새로운 요청을 보내어 페이지를 렌더링합니다.


### createRoot와 hydrateRoot

React에서 createRoot와 hydrateRoot는 React 애플리케이션을 초기화하고 서버 측 렌더링 결과를 클라이언트에 반영하는 데 사용됩니다. 이 두 메서드는 React 18에서 소개되었으며, 이전에는 render 함수가 사용되었습니다.

React18에서 SSR 방식이 도입되면서 기존의 render는 createRoot가 그 역할을 맡게 되었으며 이 것은 CSR에서 사용됩니다. hydrateRoot라는 새로운 개념이 생겨나며, 하나의 태그만이 아닌 서버에서 구성한 완전한 html 뼈대에 js 파일의 결과만 붙여넣을 수 있게 되었습니다. 이 것이 react에서 SSR을 지원한 것입니다.

#### [createRoot](https://react.dev/reference/react-dom/client/createRoot)

`root = createRoot(domNode, options?)`

공식문서에 따르면 메서드의 원형은 위와 같으며 domNode는 `A DOM element` 라고 서술되어 있습니다. 즉 root 대상으로 선정할 엘리먼트를 '하나' 선택하여 매개변수로 넘기는 것입니다. **createRoot는 React root를 제작하는 행위**이며, 이는 리액트 컴포넌트 트리를 마운트하기 위한 대상을 뜻합니다.

`root.render(reactNode)` 메서드를 통해 JSX 파일 확장자로 작성된 **React Node들을, React root 내부에 붙여줄 수 있습니다.** 이 때 단 하나의 엘리먼트로 이루어진 React root에 reactNode들을 붙여주는 행위임을 알 수 있습니다. 

즉, createRoot를 사용하여 React root를 제작하고, render 메서드를 통해 React Node들을 붙여주는 행위는 CSR이라고 볼 수 있습니다.


#### [hydarateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

`hydrateRoot(domNode, reactNode, options?)`

`react-dom/server` 를 통해 미리 제작되어진 HTML DOM 노드들에 React Component들을 붙여줄 수 있는 메서드입니다. 미리 제작되어진 HTML Node 들에 JS 코드들(React Component)을 입혀주는 행위이기 때문에 hydration, 즉 '수화'라고 불리는 것입니다. 

'수화'란 서버로부터 전송받은 HTML에 이벤트 리스너를 연결하여 동적인 웹을 만드는 과정을 의미합니다. **💫 이 방법은 서버에서 렌더링된 마크업과 정확히 일치하는 구조에서 사용되어야 합니다.💫**

이 방식으로 SSR과 CSR이 원만한 합의를 이루게 하여, 초기 로드 시간 단축 및 SEO 향상을 시킵니다. React가 무적의 길로 향하고 있는 이유입니다.

### 결론적으로 알게된 것

- React는 무조건 `index.html`에 div tag 달랑 하나 있는 상태에서 시작한다
  - 태그를 브라우저 DOM에 바로 올려 div tag 하나 있는 상태에서 웹구성을 시작하면 CSR이다
  - 태그를 express 서버에서 html DOM을 '완전히'  구성하여 브라우저에 올려주면 SSR이다
- SSR을 구성하는 과정은 아래와 같다.
  - `react-router-dom/server` 내부의 `StaticRouter` 라는 JSX 문법을 사용해 JSX로 제작한 앱 전체를 감싼다. 그럼 내가 제작한 전체 리액트 컴포넌트를 서버측에서 렌더링을 할 수 있다.
  - 서버측에서 렌더링한 결과를 `react-dom/server` 에서 `renderToString` 메서드를 활용해 HTML DOM 문자열로 만든다. 이 결과물은 당연하게도 내가 제작한 리액트 컴포넌트 마크업과 동일하다.
  - 그 결과물을 가져와서 `index.html` 파일 자체를 바꾸어준다. root tag 문자열을 결과물의 문자열로 바꾸어버리면 된다. (생각보다 와일드하다)
  - 바뀐 `index.html` 을 client에 보내주면 SSR 완성이다.