"use client";

import { useState } from "react";

export default function ReportUser({setShowReportForm, reportedUser, reportedUserId, reporterId}) {
    const [reportReason, setReportReason] = useState("");
    const [reportExplanation, setReportExplanation] = useState("");
    const [reportError, setReportError] = useState(null);
    const [reportSuccess, setReportSuccess] = useState(null);
    const [reportSubmitting, setReportSubmitting] = useState(false);

    const handleReportSubmit = async () => {
      if (!reportReason) {
        setReportError("Please select a reason.");
        return;
      }

      setReportSubmitting(true);
      setReportError(null);
      setReportSuccess(null);


      try {
        const res = await fetch("/api/users/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reportedUser,
            reportedUserId,
            reporterId,
            reason: reportReason,
            explanation: reportExplanation,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setReportError(data.message || "Failed to report.");
        } else {
          setReportSuccess("Report submitted. We will look into this ASAP!");
        }
      } catch (err) {
        setReportError("Something went wrong.");
      } finally {
        setReportSubmitting(false);
      }
    }

    return (
      <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 text-black">
        <div className="bg-white rounded-xl p-6 w-11/12 md:w-[600px] shadow-xl">
          <h3 className="text-lg font-semibold mb-3">Report User</h3>

          <label className="block mb-2 font-semibold">Reason</label>
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          >
            <option value="">-- Select a reason --</option>
            <option value="Inappropriate Content">Inappropriate Content</option>
            <option value="Harassment or Abuse">Harassment or Abuse</option>
            <option value="Spam or Scam">Spam or Scam</option>
            <option value="Other">Other</option>
          </select>

          <label className="block mb-2 font-semibold">
            Explanation (optional but recommended)
          </label>
          <textarea
            className="w-full p-2 border rounded mb-3"
            rows="4"
            placeholder="Explain why you're reporting this user..."
            value={reportExplanation}
            onChange={(e) => setReportExplanation(e.target.value)}
          />

          {reportError && (
            <div className="text-sm md:text-md w-fit px-3 py-1 text-white bg-red-500 rounded mb-3">
              {reportError}
            </div>
          )}

          {reportSuccess && (
            <div className="text-sm md:text-md w-fit px-3 py-1 text-white bg-green-500 rounded mb-3">
              {reportSuccess}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setShowReportForm(false)}
              className="text-gray-600 hover:underline"
            >
              Close
            </button>
            <button
              onClick={handleReportSubmit}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              {reportSubmitting ? "Reporting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>
    );
}