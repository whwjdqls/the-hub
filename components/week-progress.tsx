import { Avatar } from "@/components/avatar";
import { getComplianceStatus } from "@/lib/compliance";
import type { ProgressRow } from "@/lib/progress";

export function WeekProgress({ rows }: { rows: ProgressRow[] }) {
  if (!rows.length) {
    return (
      <div className="border-y border-[#e6e6e8] py-9 text-center text-[12px] text-[#717176]">
        가입한 멤버가 아직 없습니다.
      </div>
    );
  }

  return (
    <div className="border-y border-[#e6e6e8]">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="h-9 border-b border-[#e6e6e8] text-[10px] font-medium uppercase tracking-[0.11em] text-[#737378]">
            <th className="w-[38%] px-0 font-medium sm:w-[42%]">Member</th>
            <th className="w-[16%] px-0 font-medium">Note</th>
            <th className="w-[20%] px-0 font-medium">Comments</th>
            <th className="w-[26%] px-0 font-medium sm:w-[22%]">Monthly pass</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((progress, index) => {
            const member = progress.member;
            const noteDone = progress.note === "작성";
            const commentsDone = progress.comments === "완료";
            const compliance = getComplianceStatus(progress);

            return (
              <tr
                key={member.id}
                className={`h-[50px] text-[13px] ${
                  index < rows.length - 1 ? "border-b border-[#eeeeef]" : ""
                }`}
              >
                <td className="pr-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar member={member} size="sm" />
                    <span className="truncate font-medium text-[#28282b]">{member.name}</span>
                    <span className="hidden text-[11px] text-[#737378] lg:inline">{member.role}</span>
                  </div>
                </td>
                <td>
                  <span className={noteDone ? "font-medium text-[#2c2c2f]" : "text-[#737378]"}>
                    {progress.note}
                  </span>
                </td>
                <td>
                  <span
                    className={commentsDone ? "font-medium text-[#2c2c2f]" : "text-[#717176]"}
                  >
                    {progress.comments}
                  </span>
                </td>
                <td>
                  {compliance === "warning" && (
                    <span className="font-semibold text-[#d1242f]">경고!!</span>
                  )}
                  {compliance === "exempt" && (
                    <span className="text-[11px] font-medium text-[#303033]">패스 사용 · 면제</span>
                  )}
                  {compliance === "complete" && (
                    <span className="text-[11px] text-[#717176]">
                      {progress.passUsed ? "사용 완료" : "1회 남음"}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
