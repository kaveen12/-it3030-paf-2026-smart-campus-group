import React from "react";

const STATUS_STYLES = {
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  PENDING:  "bg-yellow-50 text-yellow-700 border-yellow-200",
};

function BookingCard({ booking, onStatusChange }) {
  const [showRejectInput, setShowRejectInput] = React.useState(false);
  const [reason, setReason] = React.useState("");

  const statusClass =
    STATUS_STYLES[booking.status] ||
    "bg-slate-100 text-slate-600 border-slate-300";

  const isPending  = booking.status === "PENDING";
  const isApproved = booking.status === "APPROVED";
  const isRejected = booking.status === "REJECTED";

  function handleApprove() {
    setShowRejectInput(false);
    setReason("");
    onStatusChange(booking.id, "APPROVED", null);
  }

  function handleRejectConfirm() {
    if (!reason.trim()) return;
    onStatusChange(booking.id, "REJECTED", reason.trim());
    setShowRejectInput(false);
    setReason("");
  }

  return (
    <div className="w-full max-w-[360px] bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">

      {/* Header */}
      <div className="flex justify-between items-start p-5 gap-3">
        <div>
          <p className="text-[11px] text-slate-400 mb-1 tracking-wide">
            #{booking.bookingId}
          </p>

          <p className="text-[15px] font-semibold text-slate-900 leading-tight">
            {booking.purpose}
          </p>

          <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span className="text-[11px] text-slate-500">
              {booking.resourceCode}
            </span>
          </div>
        </div>

        <span
          className={`text-[11px] font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${statusClass}`}
        >
          {booking.status}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mx-5" />

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 p-5">
        {[
          ["User", booking.userId],
          ["Attendees", booking.attendees],
          ["Date", booking.date],
          ["Time", `${booking.startTime} – ${booking.endTime}`],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
              {label}
            </p>
            <p className="text-[13px] font-medium text-slate-800">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Rejection Reason */}
      {isRejected && booking.rejectionReason && (
        <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-[10px] font-semibold text-red-700 uppercase tracking-wider mb-1">
            Rejection reason
          </p>
          <p className="text-[12px] text-red-600">
            {booking.rejectionReason}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="p-5 border-t border-slate-100 flex flex-col gap-2">

        {/* Textarea */}
        {showRejectInput && (
          <textarea
            rows={2}
            className="w-full text-sm p-2.5 border border-red-200 rounded-lg bg-red-50 focus:outline-none"
            placeholder="Reason for rejection…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}

        {/* Buttons */}
        {isPending && (
          <div className="flex gap-2">

            {!showRejectInput && (
              <button
                onClick={handleApprove}
                className="flex-1 text-sm font-medium py-2 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
              >
                Approve
              </button>
            )}

            {!showRejectInput ? (
              <button
                onClick={() => setShowRejectInput(true)}
                className="flex-1 text-sm font-medium py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              >
                Reject
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowRejectInput(false);
                    setReason("");
                  }}
                  className="flex-1 text-sm py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-400"
                >
                  Cancel
                </button>

                <button
                  onClick={handleRejectConfirm}
                  disabled={!reason.trim()}
                  className={`flex-1 text-sm py-2 rounded-lg border border-red-200 text-red-700 
                  ${reason.trim() ? "bg-red-50 hover:bg-red-100" : "bg-red-50 opacity-50 cursor-not-allowed"}`}
                >
                  Confirm
                </button>
              </>
            )}
          </div>
        )}

        {/* Status Messages */}
        {isApproved && (
          <p className="text-center text-sm text-slate-400">
            ✓ This booking has been approved
          </p>
        )}

        {isRejected && (
          <p className="text-center text-sm text-red-300">
            ✗ This booking has been rejected
          </p>
        )}
      </div>
    </div>
  );
}

export default BookingCard;