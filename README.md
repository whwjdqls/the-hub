# HUB

5명 이하의 작은 팀을 위한 주간 독서 기록 트래커입니다. Next.js App Router와 Tailwind CSS로 만들었으며, 얇은 선과 흑백 텍스트를 중심으로 한 개발자 도구 스타일의 인터페이스를 사용합니다.

## 주요 화면

- `/` — Week 24 멤버별 진행률과 이번 주 독서 기록
- `/timeline` — 주차별 독서 기록 아카이브
- `/notes/[slug]` — 독서 기록 본문과 GitHub Issues 스타일 댓글 토론

## 로컬 실행

이 저장소에는 프로젝트 전용 Conda 환경을 사용할 수 있습니다.

```bash
conda create -p ./.conda-env -c conda-forge nodejs=22
conda activate ./.conda-env
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 검증

```bash
npm run lint
npm run typecheck
npm run build
```
