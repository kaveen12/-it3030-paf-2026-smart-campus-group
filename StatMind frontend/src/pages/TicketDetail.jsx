import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ticketAPI, commentAPI, activityLogAPI } from "../api/ticketService";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { Modal } from "../components/Modal";
import { CommentsSection } from "../components/CommentsSection";
import { ActivityLogTimeline } from "../components/ActivityLogTimeline";

const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("details");

  // Modal states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  // Form data
  const [assignData, setAssignData] = useState({
    assignedTechnicianId: "",
    assignedTechnicianName: "",
  });

  const [statusData, setStatusData] = useState({ status: "" });

  const [technicians, setTechnicians] = useState([]);

  const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    fetchTicketDetails();
    fetchTechnicians();
  }, [ticketId]);

  const fetchTechnicians = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/users");
      const data = await res.json();

      const techs = Array.isArray(data)
        ? data.filter((u) => u.role === "TECHNICIAN")
        : [];

      setTechnicians(techs);
    } catch (err) {
      console.log("Technicians load error:", err);
      setTechnicians([]);
    }
  };

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);

      const ticketData = await ticketAPI.getTicketById(ticketId);
      setTicket(ticketData);
      setStatusData({ status: ticketData?.status || "" });

      // comments
      try {
        const c = await commentAPI.getComments(ticketId);
        setComments(Array.isArray(c) ? c : []);
      } catch {
        setComments([]);
      }

      // logs
      try {
        const l = await activityLogAPI.getActivityLogs(ticketId);
        setLogs(Array.isArray(l) ? l : []);
      } catch {
        setLogs([]);
      }
    } catch (err) {
      setError("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- ACTIONS ----------------
  const handleAssignTechnician = async () => {
    if (!assignData.assignedTechnicianId) {
      return alert("Select technician");
    }

    try {
      await ticketAPI.assignTechnician(ticketId, assignData);
      setAssignModalOpen(false);
      fetchTicketDetails();
    } catch (err) {
      alert("Assign failed");
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusData.status) return alert("Select status");

    try {
      await ticketAPI.updateTicketStatus(ticketId, statusData);
      setStatusModalOpen(false);
      fetchTicketDetails();
    } catch {
      alert("Update failed");
    }
  };

  // ---------------- UI STATES ----------------
  if (loading) return <div>Loading...</div>;

  if (error || !ticket) {
    return (
      <div>
        <p>{error || "Ticket not found"}</p>
        <button onClick={() => navigate("/admin/tickets")}>Back</button>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Ticket Details</h1>

      <div className="flex gap-2 my-4">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {["details", "comments", "activity"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* DETAILS */}
      {activeTab === "details" && (
        <div>
          <p><b>Resource:</b> {ticket.resourceName}</p>
          <p><b>Location:</b> {ticket.location}</p>
          <p><b>Description:</b> {ticket.description}</p>

          <button onClick={() => setAssignModalOpen(true)}>
            Assign Technician
          </button>

          <button onClick={() => setStatusModalOpen(true)}>
            Update Status
          </button>
        </div>
      )}

      {/* COMMENTS */}
      {activeTab === "comments" && (
        <CommentsSection
          ticketId={ticketId}
          comments={comments}
          currentUserName="Admin"
          currentUserRole="ADMIN"
        />
      )}

      {/* ACTIVITY */}
      {activeTab === "activity" && (
        <ActivityLogTimeline logs={logs} />
      )}

      {/* ASSIGN MODAL */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Technician"
      >
        <select
          onChange={(e) => {
            const tech = technicians.find(
              (t) => String(t.id) === e.target.value
            );

            setAssignData({
              assignedTechnicianId: tech?.id || "",
              assignedTechnicianName: tech?.name || "",
            });
          }}
        >
          <option>Select</option>
          {technicians.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <button onClick={handleAssignTechnician}>Assign</button>
      </Modal>

      {/* STATUS MODAL */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Status"
      >
        <select
          value={statusData.status}
          onChange={(e) =>
            setStatusData({ status: e.target.value })
          }
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <button onClick={handleUpdateStatus}>Update</button>
      </Modal>
    </div>
  );
};

export default TicketDetail;