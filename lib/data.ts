export type Member = {
  id: "minjun" | "seoyeon" | "jiho" | "yujin" | "dohyeon";
  name: string;
  initial: string;
  role: string;
};

export type MemberProgress = {
  memberId: Member["id"];
  note: "작성" | "대기";
  comments: "완료" | "진행중";
};

export type Comment = {
  id: string;
  authorId: Member["id"];
  relativeTime: string;
  content: string;
};

export type ContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "heading"; content: string }
  | { type: "quote"; content: string };

export type Note = {
  slug: string;
  week: 24 | 23 | 22;
  title: string;
  summary: string;
  authorId: Member["id"];
  shortDate: string;
  longDate: string;
  readTime: string;
  book: string;
  bookAuthor: string;
  body: ContentBlock[];
  comments: Comment[];
};

export const members: Member[] = [
  { id: "minjun", name: "김민준", initial: "민", role: "Product" },
  { id: "seoyeon", name: "이서연", initial: "서", role: "Design" },
  { id: "jiho", name: "박지호", initial: "지", role: "Engineering" },
  { id: "yujin", name: "최유진", initial: "유", role: "Operations" },
  { id: "dohyeon", name: "윤도현", initial: "도", role: "Engineering" },
];

export const weeklyProgress: MemberProgress[] = [
  { memberId: "minjun", note: "작성", comments: "완료" },
  { memberId: "seoyeon", note: "작성", comments: "진행중" },
  { memberId: "jiho", note: "대기", comments: "진행중" },
  { memberId: "yujin", note: "작성", comments: "완료" },
  { memberId: "dohyeon", note: "작성", comments: "완료" },
];

export const notes: Note[] = [
  {
    slug: "strategy-is-choice",
    week: 24,
    title: "좋은 전략은 무엇을 하지 않을지 정하는 일이다",
    summary: "문제를 진단하고 선택을 집중시키는 전략의 세 가지 구조",
    authorId: "minjun",
    shortDate: "6월 13일",
    longDate: "2026년 6월 13일",
    readTime: "6분 읽기",
    book: "Good Strategy/Bad Strategy",
    bookAuthor: "Richard Rumelt",
    body: [
      {
        type: "paragraph",
        content:
          "전략은 목표의 목록이 아니라, 가장 중요한 문제를 진단하고 자원을 집중시키는 선택에 가깝다. 이번 주에 특히 남은 것은 ‘무엇을 할 것인가’보다 ‘무엇을 하지 않을 것인가’를 먼저 합의해야 한다는 점이었다.",
      },
      {
        type: "heading",
        content: "야심과 전략을 구분하기",
      },
      {
        type: "paragraph",
        content:
          "성장, 리더십, 고객 중심 같은 말은 방향을 보여주지만 그 자체로 전략이 되지는 않는다. 좋은 전략에는 현재 상황에 대한 솔직한 진단과, 진단에서 자연스럽게 이어지는 일관된 행동이 있다. 그래서 읽는 내내 우리 팀의 분기 계획에서 실제 진단은 무엇이었는지 되돌아봤다.",
      },
      {
        type: "quote",
        content:
          "선택에는 반드시 포기가 따른다. 모든 것을 중요하다고 부르는 순간, 전략은 우선순위 목록으로 되돌아간다.",
      },
      {
        type: "paragraph",
        content:
          "우리는 보통 해야 할 일을 추가하는 데 익숙하다. 반대로 하지 않을 일을 명시하는 순간 논의는 훨씬 선명해진다. 제한된 시간과 집중력을 어디에 쓰는지 합의할 수 있기 때문이다.",
      },
      {
        type: "heading",
        content: "다음 주에 적용해 볼 것",
      },
      {
        type: "paragraph",
        content:
          "다음 스프린트 문서에는 목표와 함께 ‘이번에는 풀지 않는 문제’를 한 줄로 적어보려 한다. 결정 이후 새 요청이 들어왔을 때도 이 문장이 판단의 기준이 될 수 있는지 확인해 보고 싶다.",
      },
    ],
    comments: [
      {
        id: "c-1",
        authorId: "seoyeon",
        relativeTime: "2시간 전",
        content:
          "‘하지 않을 일’을 스프린트 계획에도 명시하면 좋겠어요. 지금은 목표만 남아서 우선순위가 다시 넓어지는 경우가 많았습니다.",
      },
      {
        id: "c-2",
        authorId: "jiho",
        relativeTime: "1시간 전",
        content:
          "진단 → 방향 → 행동이라는 구조가 회고 문서에도 그대로 적용될 수 있을 것 같아요. 다음 회고 템플릿에서 한번 실험해 봐도 좋겠습니다.",
      },
      {
        id: "c-3",
        authorId: "minjun",
        relativeTime: "18분 전",
        content:
          "좋아요. 다음 주에는 실제 프로젝트 하나를 이 구조로 정리해서 공유해볼게요.",
      },
    ],
  },
  {
    slug: "density-of-feedback",
    week: 24,
    title: "팀의 속도보다 중요한 것은 피드백의 밀도",
    summary: "함께 읽은 소프트웨어 장인정신에서 남은 문장들",
    authorId: "seoyeon",
    shortDate: "6월 12일",
    longDate: "2026년 6월 12일",
    readTime: "4분 읽기",
    book: "Software Craftsmanship",
    bookAuthor: "Pete McBreen",
    body: [
      {
        type: "paragraph",
        content:
          "빠르게 움직이는 팀은 일을 빨리 끝내는 팀이라기보다, 작은 단위로 결과를 보여주고 다음 판단에 필요한 피드백을 자주 얻는 팀에 가깝다. 속도는 결과이고, 그 결과를 만드는 것은 피드백의 밀도였다.",
      },
      { type: "heading", content: "완료보다 노출을 앞당기기" },
      {
        type: "paragraph",
        content:
          "완성도를 높인 뒤 공유하면 반응은 늦고 수정 비용은 커진다. 반대로 의도가 보이는 가장 작은 형태를 먼저 공유하면 동료가 결정에 참여할 수 있다. 작업물을 평가받는 것이 아니라 함께 방향을 찾는 과정이 된다.",
      },
      {
        type: "quote",
        content: "피드백이 없는 속도는 같은 방향으로 더 멀리 틀릴 가능성을 키운다.",
      },
      {
        type: "paragraph",
        content:
          "다음 주부터 디자인 리뷰의 기준을 ‘얼마나 완성됐는가’에서 ‘지금 어떤 결정을 함께 내려야 하는가’로 바꿔보려 한다.",
      },
    ],
    comments: [
      {
        id: "c-4",
        authorId: "dohyeon",
        relativeTime: "어제",
        content: "PR 크기를 줄이는 이유와 정확히 닿아 있네요. 리뷰 요청에도 결정이 필요한 지점을 적어보겠습니다.",
      },
      {
        id: "c-5",
        authorId: "yujin",
        relativeTime: "6시간 전",
        content: "‘평가가 아니라 방향을 찾는 과정’이라는 표현이 좋았습니다. 운영 문서 리뷰에도 적용할 수 있겠어요.",
      },
    ],
  },
  {
    slug: "systems-for-small-habits",
    week: 24,
    title: "작은 습관을 시스템으로 만드는 방법",
    summary: "의지 대신 환경을 설계한다는 것에 대하여",
    authorId: "yujin",
    shortDate: "6월 10일",
    longDate: "2026년 6월 10일",
    readTime: "5분 읽기",
    book: "Atomic Habits",
    bookAuthor: "James Clear",
    body: [
      {
        type: "paragraph",
        content:
          "좋은 습관은 강한 의지에서 시작되지 않는다. 행동을 시작하기 쉬운 환경, 반복을 눈으로 확인할 수 있는 장치, 실패해도 다음 날 바로 돌아올 수 있는 규칙이 함께 있을 때 오래 남는다.",
      },
      { type: "heading", content: "행동의 마찰을 줄이는 일" },
      {
        type: "paragraph",
        content:
          "거창한 목표 대신 첫 행동을 아주 작게 만들면 시작에 드는 협상 비용이 줄어든다. 독서 역시 한 시간 읽기보다 책을 펼쳐 한 문단에 표시하는 일을 기본 단위로 두는 편이 지속 가능했다.",
      },
      {
        type: "quote",
        content: "반복되는 결과를 바꾸고 싶다면, 먼저 그 결과를 만드는 시스템을 살펴봐야 한다.",
      },
      {
        type: "paragraph",
        content:
          "이 기록을 매주 같은 요일에 쓰는 것도 작은 시스템이다. 일정에 시간을 먼저 남기고, 읽는 동안 표시한 문장 세 개에서 글을 시작해 보려 한다.",
      },
    ],
    comments: [
      {
        id: "c-6",
        authorId: "seoyeon",
        relativeTime: "2일 전",
        content: "기록을 잘 쓰는 것보다 정해진 시간에 문서를 여는 것을 목표로 삼아봐야겠어요.",
      },
      {
        id: "c-7",
        authorId: "minjun",
        relativeTime: "어제",
        content: "우리 주간 기록 자체가 좋은 환경 설계의 예인 것 같습니다.",
      },
      {
        id: "c-8",
        authorId: "dohyeon",
        relativeTime: "8시간 전",
        content: "실패해도 이틀 연속 거르지만 않는다는 규칙이 특히 실용적이었어요.",
      },
      {
        id: "c-9",
        authorId: "yujin",
        relativeTime: "3시간 전",
        content: "다음 주에 각자 하나씩 작은 시스템을 정해서 결과를 나눠보면 좋겠습니다.",
      },
    ],
  },
  {
    slug: "clear-writing-simple-products",
    week: 24,
    title: "명확한 글쓰기가 제품을 더 단순하게 만든다",
    summary: "생각을 문장으로 검증하는 팀의 작업 방식",
    authorId: "dohyeon",
    shortDate: "6월 9일",
    longDate: "2026년 6월 9일",
    readTime: "4분 읽기",
    book: "On Writing Well",
    bookAuthor: "William Zinsser",
    body: [
      {
        type: "paragraph",
        content:
          "복잡한 문장은 종종 복잡한 생각을 가린다. 제품의 동작을 짧은 문장으로 설명할 수 없을 때 문제는 대개 문장보다 제품의 결정 구조에 있었다.",
      },
      { type: "heading", content: "삭제가 만드는 명료함" },
      {
        type: "paragraph",
        content:
          "문장에서 불필요한 말을 덜어내듯 기능에서도 사용자의 다음 행동에 필요하지 않은 선택을 덜어낼 수 있다. 좋은 글쓰기와 좋은 인터페이스가 같은 편집 감각을 요구한다는 생각이 들었다.",
      },
      {
        type: "quote",
        content: "명료한 문장은 독자의 시간을 존중하고, 단순한 제품은 사용자의 판단을 존중한다.",
      },
      {
        type: "paragraph",
        content:
          "앞으로 기능을 구현하기 전에 한 문단짜리 설명을 먼저 적어보려 한다. 문장 안에서 예외가 계속 늘어난다면 설계를 다시 볼 신호로 삼을 수 있다.",
      },
    ],
    comments: [
      {
        id: "c-10",
        authorId: "jiho",
        relativeTime: "3일 전",
        content: "구현 전에 README의 사용 예시부터 쓴다는 방식과도 연결되는 것 같아요.",
      },
    ],
  },
  {
    slug: "meetings-as-designed-systems",
    week: 23,
    title: "회의도 설계된 시스템이어야 한다",
    summary: "좋은 회의는 시작 전에 이미 절반이 결정된다",
    authorId: "jiho",
    shortDate: "6월 5일",
    longDate: "2026년 6월 5일",
    readTime: "3분 읽기",
    book: "High Output Management",
    bookAuthor: "Andrew S. Grove",
    body: [
      {
        type: "paragraph",
        content:
          "회의의 품질은 참석자의 집중력보다 구조에 더 많이 좌우된다. 결정할 것, 필요한 정보, 결정 이후의 책임이 시작 전에 보이면 회의는 짧고 선명해진다.",
      },
      { type: "quote", content: "의제가 없는 회의는 목적지가 없는 이동과 비슷하다." },
      {
        type: "paragraph",
        content: "정기 회의를 관성적으로 유지하기보다 각 회의가 만드는 산출물을 먼저 정의해 보려 한다.",
      },
    ],
    comments: [
      {
        id: "c-11",
        authorId: "yujin",
        relativeTime: "1주 전",
        content: "다음 운영 회의부터 결정 로그를 산출물로 남겨볼게요.",
      },
    ],
  },
  {
    slug: "work-is-a-series-of-bets",
    week: 23,
    title: "우리가 하는 일은 결국 일련의 베팅이다",
    summary: "확신 대신 가설과 비용으로 계획을 바라보는 법",
    authorId: "minjun",
    shortDate: "6월 3일",
    longDate: "2026년 6월 3일",
    readTime: "5분 읽기",
    book: "Shape Up",
    bookAuthor: "Ryan Singer",
    body: [
      {
        type: "paragraph",
        content:
          "계획은 미래를 맞히는 문서가 아니라 제한된 시간 안에서 어떤 가능성에 베팅할지 정하는 문서다. 이 관점은 실패를 예측 오류가 아니라 학습 비용으로 보게 한다.",
      },
      { type: "heading", content: "시간을 고정하고 범위를 조정하기" },
      {
        type: "paragraph",
        content: "베팅의 비용을 먼저 정하면 핵심을 지키기 위해 무엇을 덜어낼지 더 자주 논의하게 된다.",
      },
    ],
    comments: [],
  },
  {
    slug: "trust-needs-context",
    week: 22,
    title: "자율성에는 충분한 맥락이 필요하다",
    summary: "통제 없이도 같은 방향으로 움직이는 팀의 조건",
    authorId: "seoyeon",
    shortDate: "5월 29일",
    longDate: "2026년 5월 29일",
    readTime: "4분 읽기",
    book: "No Rules Rules",
    bookAuthor: "Reed Hastings, Erin Meyer",
    body: [
      {
        type: "paragraph",
        content:
          "자율성은 설명을 줄이는 방식이 아니라 더 좋은 맥락을 제공하는 방식으로 작동한다. 무엇을 결정했는지뿐 아니라 어떤 제약과 정보 속에서 결정했는지를 나눌 때 동료는 다음 결정을 스스로 내릴 수 있다.",
      },
      { type: "quote", content: "통제를 줄이려면 먼저 맥락의 밀도를 높여야 한다." },
    ],
    comments: [
      {
        id: "c-12",
        authorId: "minjun",
        relativeTime: "2주 전",
        content: "의사결정 문서에 배경과 제약을 더 충실히 남겨야겠네요.",
      },
    ],
  },
  {
    slug: "defaults-shape-behavior",
    week: 22,
    title: "기본값은 생각보다 강하게 행동을 만든다",
    summary: "좋은 선택을 가장 쉬운 선택으로 만드는 제품 설계",
    authorId: "dohyeon",
    shortDate: "5월 27일",
    longDate: "2026년 5월 27일",
    readTime: "3분 읽기",
    book: "Nudge",
    bookAuthor: "Richard H. Thaler",
    body: [
      {
        type: "paragraph",
        content:
          "사용자는 매 순간 모든 선택지를 비교하지 않는다. 기본값은 제품이 권하는 행동이자 사용자가 지불해야 하는 판단 비용을 결정한다.",
      },
      {
        type: "paragraph",
        content: "설정 화면을 볼 때 옵션의 수보다 어떤 선택이 기본으로 놓였는지부터 검토해 보려 한다.",
      },
    ],
    comments: [],
  },
];

export const currentNotes = notes.filter((note) => note.week === 24);

export function getMember(id: Member["id"]) {
  const member = members.find((item) => item.id === id);
  if (!member) throw new Error(`Unknown member: ${id}`);
  return member;
}
export function getNote(slug: string) {
  return notes.find((note) => note.slug === slug);
}
