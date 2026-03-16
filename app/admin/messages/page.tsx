"use client";

import React from "react";
import { 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  User, 
  Mail,
  Search,
  RefreshCw,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/utils/trpc";

export default function MessagesAdminPage() {
  const utils = trpc.useUtils();
  const { data: messages, isLoading, isError, refetch } = trpc.message.getAll.useQuery();

  const markAsReadMutation = trpc.message.markAsRead.useMutation({
    onSuccess: () => utils.message.getAll.invalidate(),
  });

  const deleteMutation = trpc.message.delete.useMutation({
    onSuccess: () => utils.message.getAll.invalidate(),
  });

  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredMessages = messages?.filter((msg: any) => 
    msg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <RefreshCw className="animate-spin text-[#43D9AD]" size={40} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)", 
            fontFamily: "'Outfit', sans-serif", 
            fontWeight: 800, 
            color: "#FFFFFF", 
            letterSpacing: "-0.02em",
            margin: 0
          }}>
            Inquiry <span style={{ color: "#43D9AD" }}>Terminal</span>
          </h1>
          <p style={{ color: "#607B96", fontFamily: "'Fira Code', monospace", fontSize: "0.875rem", marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "6px", height: "6px", backgroundColor: "#43D9AD", borderRadius: "50%" }} />
            {"// active_communications: " + (messages?.length || 0)}
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ 
            position: "relative",
            display: "flex",
            alignItems: "center"
          }}>
            <Search size={16} style={{ position: "absolute", left: "12px", color: "#607B96" }} />
            <input 
              type="text" 
              placeholder="Filter messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: "rgba(1, 22, 39, 0.5)",
                border: "1px solid rgba(30, 45, 61, 0.5)",
                borderRadius: "12px",
                padding: "10px 12px 10px 36px",
                color: "#FFFFFF",
                fontSize: "0.875rem",
                outline: "none",
                width: "250px",
                transition: "all 0.3s ease",
              }}
            />
          </div>
          <button 
            onClick={() => refetch()}
            style={{
              padding: "10px",
              borderRadius: "12px",
              backgroundColor: "rgba(30, 45, 61, 0.5)",
              border: "1px solid rgba(30, 45, 61, 0.5)",
              color: "#43D9AD",
              cursor: "pointer"
            }}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {isError && (
        <div style={{ padding: "1.5rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "1rem", color: "#ef4444" }}>
          Failed to synchronize with central communications hub.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
        <AnimatePresence mode="popLayout">
          {filteredMessages?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                padding: "5rem", 
                textAlign: "center", 
                background: "rgba(1, 18, 33, 0.3)", 
                borderRadius: "2rem",
                border: "1px dashed #1E2D3D",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem"
              }}
            >
              <div style={{ color: "#1E2D3D" }}><Inbox size={64} /></div>
              <p style={{ color: "#607B96", fontSize: "1.125rem" }}>No transmission logs found.</p>
            </motion.div>
          ) : (
            filteredMessages?.map((message: any) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: message.read ? "rgba(1, 18, 33, 0.4)" : "rgba(30, 45, 61, 0.2)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "1.5rem",
                  border: `1px solid ${message.read ? "rgba(30, 45, 61, 0.3)" : "rgba(67, 217, 173, 0.2)"}`,
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  position: "relative",
                  boxShadow: message.read ? "none" : "0 8px 32px rgba(67, 217, 173, 0.05)",
                  transition: "all 0.3s ease"
                }}
              >
                {!message.read && (
                  <div style={{ 
                    position: "absolute", 
                    top: "1.5rem", 
                    right: "1.5rem",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#43D9AD",
                    borderRadius: "50%",
                    boxShadow: "0 0 10px #43D9AD"
                  }} />
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ 
                      width: "48px", 
                      height: "48px", 
                      borderRadius: "1rem", 
                      background: "rgba(1, 22, 39, 0.8)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: message.read ? "#607B96" : "#43D9AD",
                      border: "1px solid rgba(30, 45, 61, 0.8)"
                    }}>
                      <User size={24} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, color: "#FFFFFF", fontSize: "1.25rem", fontWeight: 600 }}>{message.senderName}</h3>
                      <p style={{ margin: "0.25rem 0 0 0", color: "#607B96", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Mail size={14} /> {message.senderEmail}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", color: "#607B96", fontSize: "0.75rem", fontFamily: "'Fira Code', monospace" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Clock size={14} />
                      {formatDate(message.time)}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  color: "#E5E7EB", 
                  fontSize: "1rem", 
                  lineHeight: "1.7", 
                  padding: "1.25rem", 
                  background: "rgba(1, 10, 20, 0.4)", 
                  borderRadius: "1rem",
                  border: "1px solid rgba(30, 45, 61, 0.4)",
                  whiteSpace: "pre-wrap"
                }}>
                  {message.message}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button
                    onClick={() => markAsReadMutation.mutate({ id: message.id, read: !message.read })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 1.25rem",
                      background: "transparent",
                      border: "1px solid rgba(30, 45, 61, 0.6)",
                      borderRadius: "0.75rem",
                      color: message.read ? "#607B96" : "#43D9AD",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {message.read ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                    {message.read ? "Mark Unread" : "Mark as Read"}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Permanently purge this transmission log?")) {
                        deleteMutation.mutate(message.id);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 1.25rem",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "0.75rem",
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <Trash2 size={16} />
                    Purge
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
