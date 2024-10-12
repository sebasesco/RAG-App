"use client";

import { QueryModel } from "@/api-client";
import Link from "next/link";

export default function QueryListItem(props: QueryModel) {
  const shortId = props.queryId?.substring(0, 12);
  return (
    <Link href={`/viewQuery?query_id=${props.queryId}`}>
      <div className="text-slate-700 p-2 px-4 rounded-sm flex justify-between hover:bg-slate-100 cursor-pointer">
        <div className="truncate w-3/4">{props.queryText}</div>
        <div className="text-blue-500">{shortId}</div>
      </div>
    </Link>
  );
}