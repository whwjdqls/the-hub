# HUB

5명 이하의 작은 팀을 위한 주간 독서 기록 트래커입니다. Next.js App Router와 Tailwind CSS로 만들었으며, Supabase Auth/Postgres를 연결하면 실제 멤버 상태와 월간 패스를 저장할 수 있습니다.

## 주요 화면

- `/` — 멤버별 주간 진행률, 미이행 경고, 월간 패스와 이번 주 독서 기록
- `/timeline` — 주차별 독서 기록 아카이브
- `/notes/[slug]` — 독서 기록 본문과 GitHub Issues 스타일 댓글 토론
- `/auth/login`, `/auth/signup` — 이메일/비밀번호 로그인과 회원가입

현재 화면의 독서 기록 본문과 기존 댓글은 디자인 확인용 샘플입니다. 인증, 멤버 목록, 주간 완료 상태, 월간 패스는 Supabase 연결 시 실제 데이터로 동작하며, 향후 기록 작성기를 연결할 수 있도록 `reading_notes`와 `comments` 테이블까지 마이그레이션에 포함되어 있습니다.

## 월간 패스 규칙

- 멤버마다 달력 월 기준으로 매월 패스 1개가 주어집니다.
- 독서 기록 또는 댓글이 미완료이고 패스를 쓰지 않았다면 진행표에 빨간색 `경고!!`가 표시됩니다.
- 패스를 사용하면 사용한 주의 미이행만 면제되며, 사용한 패스는 취소하거나 같은 달에 다시 사용할 수 없습니다.
- Supabase 연결 상태에서는 본인의 주간 완료 상태와 패스 사용이 DB에 즉시 저장됩니다.

## 로컬 실행

이 저장소에는 프로젝트 전용 Conda 환경을 사용할 수 있습니다.

```bash
conda create -p ./.conda-env -c conda-forge nodejs=22
conda activate ./.conda-env
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

환경변수가 없으면 샘플 멤버와 패스 상태를 사용하는 데모 모드로 실행됩니다.

## Supabase 연결

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase/migrations/20260715000000_initial_schema.sql`을 실행합니다.
3. `.env.example`을 `.env.local`로 복사하고 프로젝트 URL, Publishable Key, 팀 초대 코드를 입력합니다.
4. Authentication → URL Configuration에 아래 주소를 등록합니다.
   - 로컬 Site URL: `http://localhost:3000`
   - 로컬 Redirect URL: `http://localhost:3000/auth/callback`
   - 배포 후 Redirect URL: `https://<your-domain>/auth/callback`

```bash
cp .env.example .env.local
npm run dev
```

마이그레이션은 프로필을 자동 생성하고, 워크스페이스 인원을 최대 5명으로 제한하며, 모든 테이블에 Row Level Security를 적용합니다.
`HUB_INVITE_CODE`는 팀원에게만 공유할 충분히 긴 임의 문자열로 설정하세요. 서버에서만 검사되며 브라우저 번들에는 포함되지 않습니다.

## Vercel 배포

1. 이 GitHub 저장소를 Vercel 프로젝트로 Import합니다.
2. Framework Preset은 Next.js, Build Command는 `npm run build`를 사용합니다.
3. Production/Preview/Development 환경에 다음 값을 등록합니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (`https://<your-domain>`)
   - `HUB_INVITE_CODE` (팀원 전용 비공개 초대 코드)
4. Supabase의 Site URL과 Redirect URL을 실제 Vercel 도메인으로 갱신합니다.
5. `main` 브랜치를 푸시하면 Production 배포가 생성됩니다.

별도 `vercel.json`은 필요하지 않습니다. Vercel이 Next.js 앱을 자동으로 감지합니다.

## 검증

```bash
npm run lint
npm run typecheck
npm run build
```
