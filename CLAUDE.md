# hyc-portfolio — 작업 규칙

## 1. 디자인을 바꾸면 Figma도 같은 작업 안에서 바꾼다

- Figma 파일: **HYC Design System** — fileKey `cLHLldal05OeGNKlrqF0aW`
- 섹션: **09 Portfolio** (`77:390`)
  - 화면: **Web / Portfolio · Desktop 1440** (`77:392`) — 화면 높이 900 기준, 섹션마다 한 화면
  - 전용 컴포넌트: **Portfolio / Components** (`77:393`)
- 사이트의 배치·색·글자·간격·문구·섹션 순서·컴포넌트를 바꾸면, 커밋 전에 Figma의 같은 노드도 바꾸고 스크린샷으로 대조한다.
- 사용자가 "Figma 바꿨어"라고 하면 Figma를 읽어 코드에 반영한다(방향만 반대, 규칙은 같음).
- Figma에 없는 것: 스크롤 모션, 한 화면씩 멈추기, 숫자 카운트업, 로고 흩어짐 — 코드에만 있다. Figma에는 정지 상태만 둔다.
- 노드 ID는 레이어를 다시 만들면 바뀐다. 못 찾으면 아래 이름으로 찾는다.

## 2. 사이트 ↔ Figma 대응표

| 사이트 (index.html) | Figma 노드 | 비고 |
|---|---|---|
| `header.nav` | Navigation `78:418` | 첫 화면 위에서는 Dark |
| `section.intro` | Intro `78:440` | 로고 획 7개 = `.intro__stroke` 7개, 레이어 이름에 흩어지는 방향 |
| `section.hero` | Hero `78:453` | The Drop 열린 원 포함 |
| Work 01~04 `section` | Work Tile 인스턴스 `79:432` `79:481` `79:523` `79:565` | 메인 컴포넌트 Work Tile `77:395` (글 5칸 · 화면 7칸) |
| `#result` | Result `79:607` | Stat 컴포넌트 세트 `77:479` (Highlight 1개) |
| `#experience` | Experience `80:573` | Experience Row `77:442` |
| `#skills` | Skills `80:610` | Skill Row `77:448` |
| `#about` | About `80:760` | 사진 4칸 · 글 7칸 |
| `footer` | Footer `80:780` | |
| `tokens.css` `--hyc-*` | 변수 컬렉션 Color · Primitives · Spacing · Shape · Typography | 이름이 같다 (`--hyc-color-bg-canvas` = `bg/canvas`) |
| `styles.css` `.t-*` | 텍스트 스타일 13가지 역할 | Display / Heading / Body / Label |
| 섹션 `data-theme="dark"` | 프레임 Color 모드 Dark | |

## 3. 브랜치와 배포

- `dev`에서 작업하고, `main`에 합쳐 푸시하면 GitHub Pages(https://uchan04.github.io/hyc-portfolio/)에 나간다.
- CSS·JS를 바꾸면 `index.html`의 `?v=` 숫자를 하나 올린다(브라우저 캐시 방지).
- 디자인 기준은 HYC_DESIGN.md(DESIGN.md)와 Figma 03 Foundations · 08 Don't.

## 4. 알려진 차이 (정리 대기)

- 아이브로: 사이트는 CSS `text-transform: uppercase`, Figma는 Label/Eyebrow 스타일 원래 표기.
- Figma는 한글을 글자 단위로 줄바꿈한다. 사이트는 `word-break: keep-all`(단어 단위).
