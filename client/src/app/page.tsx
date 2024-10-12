"use-client";

import SubmitQueryForm from "@/components/app/submitQueryForm";
import QueryListSidebar from "@/components/app/QueryListSidebar";

export default function Home() {
  return (
    <>
      <SubmitQueryForm />
      <QueryListSidebar />
    </>
  );
}
