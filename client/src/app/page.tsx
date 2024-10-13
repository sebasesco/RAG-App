"use-client";

import SubmitQueryForm from "@/components/app/submitQueryForm";
import QueryListSidebar from "@/components/app/queryListSidebar";

export default function Home() {
  return (
    <>
      <SubmitQueryForm />
      <QueryListSidebar />
    </>
  );
}
