# HUB

5명 이하의 작은 팀을 위한 주간 독서 기록 트래커입니다. Next.js App Router, Tailwind CSS, Supabase Auth/Postgres로 구성되어 있습니다.

## 주요 화면

- `/` — 멤버별 주간 진행률, 미이행 경고, 월간 패스와 이번 주 독서 기록
- `/timeline` — 주차별 독서 기록 아카이브
- `/notes/new` — 기존 책을 선택하거나 새 책을 등록해 독서 기록 작성
- `/notes/[id]` — 독서 기록 본문과 GitHub Issues 스타일 댓글 토론
- `/books` — 멤버별 읽는 중, 완료, 읽을 예정 책장
- `/auth/login`, `/auth/signup` — 이메일/비밀번호 로그인과 회원가입

샘플 멤버와 샘플 기록은 포함하지 않습니다. 가입한 멤버, 책, 기록, 댓글, 주간 상태와 패스가 모두 Supabase 데이터로 표시됩니다. 한 번 등록한 책은 여러 독서 기록에서 다시 선택할 수 있습니다.

## 운영 주차

- 첫 운영 주는 기본적으로 2026년 7월 13일에 시작하는 `Week 1`입니다.
- `HUB_START_DATE`를 다른 월요일(`YYYY-MM-DD`)로 지정하면 그 날짜부터 Week 1이 됩니다.
- 캘린더 ISO 주차가 아니라 워크스페이스를 시작한 주부터 1, 2, 3 순서로 증가합니다.

## 월간 패스 규칙

- 멤버마다 달력 월 기준으로 매월 패스 1개가 주어집니다.
- 독서 기록 또는 댓글이 미완료이고 패스를 쓰지 않았다면 진행표에 빨간색 `경고!!`가 표시됩니다.
- 패스를 사용하면 사용한 주의 미이행만 면제되며, 사용한 패스는 취소하거나 같은 달에 다시 사용할 수 없습니다.
- 독서 기록을 작성하면 `Note`, 댓글을 작성하면 `Comments`가 자동으로 완료됩니다.
- 본인의 월간 패스 사용은 DB에 즉시 저장됩니다.

## 로컬 실행

이 저장소에는 프로젝트 전용 Conda 환경을 사용할 수 있습니다.

```bash
conda create -p ./.conda-env -c conda-forge nodejs=22
conda activate ./.conda-env
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

환경변수가 없으면 샘플 대신 비어 있는 초기 화면이 표시됩니다.

## Supabase 연결

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 아래 파일을 순서대로 한 번씩 실행합니다.
   - `supabase/migrations/20260715000000_initial_schema.sql`
   - `supabase/migrations/20260715010000_add_books.sql`
3. `.env.example`을 `.env.local`로 복사하고 프로젝트 URL, Publishable Key, 팀 초대 코드를 입력합니다.
4. Authentication → URL Configuration에 아래 주소를 등록합니다.
   - 로컬 Site URL: `http://localhost:3000`
   - 로컬 Redirect URL: `http://localhost:3000/auth/callback`
   - 배포 후 Redirect URL: `https://<your-domain>/auth/callback`

```bash
cp .env.example .env.local
npm run dev
```

마이그레이션은 프로필을 자동 생성하고, 워크스페이스 인원을 최대 5명으로 제한하며, 책과 기록을 포함한 모든 테이블에 Row Level Security를 적용합니다.
`HUB_INVITE_CODE`는 팀원에게만 공유할 충분히 긴 임의 문자열로 설정하세요. 서버에서만 검사되며 브라우저 번들에는 포함되지 않습니다.

## Vercel 배포

1. 이 GitHub 저장소를 Vercel 프로젝트로 Import합니다.
2. Framework Preset은 Next.js, Build Command는 `npm run build`를 사용합니다.
3. Production/Preview/Development 환경에 다음 값을 등록합니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (`https://<your-domain>`)
   - `HUB_INVITE_CODE` (팀원 전용 비공개 초대 코드)
   - `HUB_START_DATE` (`2026-07-13`, 다른 날부터 시작할 때만 변경)
4. Supabase의 Site URL과 Redirect URL을 실제 Vercel 도메인으로 갱신합니다.
5. `main` 브랜치를 푸시하면 Production 배포가 생성됩니다.

별도 `vercel.json`은 필요하지 않습니다. Vercel이 Next.js 앱을 자동으로 감지합니다.

## 검증

```bash
npm run lint
npm run typecheck
npm run build
```
