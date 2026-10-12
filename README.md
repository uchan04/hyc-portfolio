# 황유찬 포트폴리오

[HYC Design System v1.1](https://www.figma.com/design/cLHLldal05OeGNKlrqF0aW/HYC-Design-System) 로 만든 한 장짜리 포트폴리오입니다.
빌드 단계가 없습니다. 파일 3개와 이미지 자리만 있습니다.

```
index.html   내용 전부
tokens.css   HYC_DESIGN.md 부록을 그대로 옮긴 토큰
styles.css   역할 13가지 · 격자 · 구성 요소
app.js       모드 전환 · 떠 있는 내비게이션 · 모바일 메뉴 · 현재 섹션 표시
```

## 보는 법

```sh
python3 -m http.server 8000
# http://localhost:8000
```

## 고치는 법

- **색·간격·모서리를 바꿀 때**는 `tokens.css` 만 고칩니다. 화면에는 의미 토큰만 씁니다.
- **글자 크기를 바꿀 때**는 `styles.css` 의 역할 13가지(`.t-*`) 안에서만 고칩니다. 역할 밖의 크기를 새로 만들지 않습니다.
- **섹션을 반전할 때**는 `<section>` 에 `data-theme="dark"` 를 붙입니다. 안의 모든 것이 통째로 반전됩니다.
  페이지 전체가 Dark일 때는 이 섹션이 반대로 Light가 되어, 밝은 면과 어두운 면이 교차하는 리듬이 유지됩니다.

## 이미지 넣기

현재 모든 이미지는 자리 표시(`bg/muted` + Aperture 아이콘)입니다. 사진은 흑백·밝은 톤·피사체 하나로 찍고,
`.media` 안의 `<svg class="media__aperture">` 를 `<img>` 로 바꿉니다. 프레임이 비율을 잡아 줍니다.

| 자리 | 비율 | 이름 |
|---|---|---|
| Section Tile · Work 01 모꼬지 | 1040×520 | `stepping-stones` |
| Section Tile · Work 02 Welliverse | 1040×520 | `morning-water` |
| Section Tile · Work 03 약·음식 상성 체커 | 1040×520 | `grapefruit-pills` |
| Section Tile · Work 04 이리온 | 1040×520 | `hero-desk` |
| About 프로필 | 1:1 | `books` |

작업물 화면이 시안이나 목업이면 왼쪽 위 `가상 화면` Media Tag를 그대로 둡니다. 실제 서비스 화면이면 지웁니다.

## 지킨 규칙

- 색상(Hue)을 쓰지 않습니다 — 잉크(`#111111`)와 종이(`#FFFFFF`) 사이 명도만
- 카드를 가로로 나열하지 않습니다 — 작업은 Section Tile 하나에 하나씩, 목록은 List Row로 세로로 쌓습니다
- 제목에 밑줄을 넣지 않습니다 — 섹션은 면과 여백으로 나누고, 강조는 SemiBold만 씁니다
- 그림자를 쓰지 않습니다 — 경계는 헤어라인, 위계는 면의 명도, 떠 있는 바는 Frosted
- 한 화면에 Primary 버튼 1개, 잉크 강조 1곳
- 그리드를 벗어나는 요소는 1개(히어로의 열린 원 — The Drop)
- 한글 줄바꿈은 단어 단위(`word-break: keep-all`), 누름은 `scale(0.97)`

## 배포

`main` 에 올리면 GitHub Pages가 그대로 띄웁니다. 빌드가 없어 워크플로도 없습니다.
