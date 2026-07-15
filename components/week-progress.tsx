import { Avatar } from "@/components/avatar";
import { getMember, weeklyProgress } from "@/lib/data";

export function WeekProgress() {
  return (
    <div className="border-y border-[#e6e6e8]">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="h-9 border-b border-[#e6e6e8] text-[10px] font-medium uppercase tracking-[0.11em] text-[#737378]">
            <th className="w-[50%] px-0 font-medium sm:w-[52%]">Member</th>
            <th className="w-[24%] px-0 font-medium">Note</th>
            <th className="w-[26%] px-0 font-medium sm:w-[24%]">Comments</th>
          </tr>
        </thead>
        <tbody>
          {weeklyProgress.map((progress, index) => {
            const member = getMember(progress.memberId);
            const noteDone = progress.note === "작성";
            const commentsDone = progress.comments === "완료";

            return (
              <tr
                key={progress.memberId}
                className={`h-[50px] text-[13px] ${
                  index < weeklyProgress.length - 1 ? "border-b border-[#eeeeef]" : ""
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
