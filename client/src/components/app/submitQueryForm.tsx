"use client";

import { useState } from "react";
import createApiClient from "@/lib/getApiClient";
import { useRouter } from "next/navigation";
import { getSessionId } from "@/lib/getUserId";

export default function SubmitQueryForm() {
  const api = createApiClient();
  const userId = getSessionId(); //Get the user session ID
  const originalPlaceHolder: string = "What is an option?";

  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Handle form submission
  const submitForm = () => {
    const queryToSubmit = query || originalPlaceHolder; //Use default placeholder if query is empty
    console.log(`Submitting query: ${queryToSubmit}`);
    
    const request = { queryText: queryToSubmit, userId: userId }; //Prepare request payload
    const response = api.submitQueryEndpointSubmitQueryPost({
      submitQueryRequest: request,
    });

    setIsSubmitting(true); //Set submitting state to true
    response.then((data) => {
      console.log(data);
      router.push(`/viewQuery?query_id=${data.queryId}`); //Redirect to the query view page
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-lg p-6 shadow-md">
        {/* Form Header */}
        <h1 className="text-xl font-bold text-center mb-4">Submit New Query</h1>
        <p className="text-gray-600 mb-4">
          Ask a question about options — a financial contract that gives you the right, but not the obligation, to buy or sell an asset (like a stock) at a specific price before a certain date.
        </p>

        {/* Textarea for query input */}
        <textarea
          placeholder={originalPlaceHolder}
          value={query}
          disabled={isSubmitting}
          onChange={(e) => setQuery(e.currentTarget.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md resize-none text-sm"
          rows={5}
        />

        {/* Submit Button */}
        <button
          onClick={submitForm}
          disabled={isSubmitting}
          className={`flex justify-center items-center w-full p-3 bg-blue-600 text-white rounded-md transition duration-200 ease-in-out ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {/* Loading Spinner when submitting */}
          {isSubmitting && (
            <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
          )}
          Submit
        </button>
      </div>
    </div>
  );
}