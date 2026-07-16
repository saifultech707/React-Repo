import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";

export default function Classes() {
  const [applications, setApplications] = useState([]);
  const [allClasses, setAllClasses] = useState({
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
  });
  const [selectedClass, setSelectedClass] = useState(6);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false); // ✅ নতুন state
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "applications"), (snapshot) => {
      const apps = snapshot.docs
        .map((d) => ({ ...d.data(), id: d.id }))
        .filter((app) => app.status === "pending");
      setApplications(apps);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "students"), (snapshot) => {
      const newClasses = { 6: [], 7: [], 8: [], 9: [], 10: [] };
      snapshot.docs.forEach((d) => {
        const st = { ...d.data(), id: d.id };
        const cls = parseInt(st.class);
        if (cls >= 6 && cls <= 10) newClasses[cls].push(st);
      });
      setAllClasses(newClasses);
    });
    return unsub;
  }, []);

  const approveApplication = async (app) => {
    try {
      const rawClass = app.applyClass || "";
      const digits = rawClass.replace(/\D/g, "");
      const classNumber = parseInt(digits);
      if (!classNumber || classNumber < 6 || classNumber > 10) {
        alert(`"${rawClass}" class এখনো support করা হয় না`);
        return;
      }
      await addDoc(collection(db, "students"), {
        name: app.studentName,
        roll: "101",
        class: classNumber,
        address: app.address || "",
        phone: app.phone || "",
        email: app.email || "",
        parentName: app.parentName || "",
        dob: app.dob || "",
        image: app.image || "https://i.pravatar.cc/150",
        status: "approved",
        results: [{ subject: "Bangla", mark: 0, grade: "N/A" }],
      });
      await updateDoc(doc(db, "applications", app.id), { status: "approved" });
      setSelectedApp(null);
      alert("Student Approved!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const downloadPDF = (student, isApplication = false) => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      const name = isApplication ? student.studentName : student.name;
      const cls = isApplication ? student.applyClass : `Class ${student.class}`;

      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, 210, 40, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Student Profile", 105, 18, { align: "center" });
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text("School Management System", 105, 30, { align: "center" });
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(name, 105, 58, { align: "center" });
      pdf.setFillColor(37, 99, 235);
      pdf.roundedRect(80, 63, 50, 10, 3, 3, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text(cls, 105, 70, { align: "center" });
      pdf.setDrawColor(240, 240, 240);
      pdf.line(20, 80, 190, 80);

      const fields = isApplication
        ? [
            ["Student Name", student.studentName || "—"],
            ["Apply For", student.applyClass || "—"],
            ["Parent / Guardian", student.parentName || "—"],
            ["Phone", student.phone || "—"],
            ["Email", student.email || "—"],
            ["Date of Birth", student.dob || "—"],
            ["Address", student.address || "—"],
            ["Status", "Pending Approval"],
          ]
        : [
            ["Student Name", student.name || "—"],
            ["Class", `Class ${student.class}`],
            ["Roll Number", student.roll || "—"],
            ["Parent / Guardian", student.parentName || "—"],
            ["Phone", student.phone || "—"],
            ["Email", student.email || "—"],
            ["Date of Birth", student.dob || "—"],
            ["Address", student.address || "—"],
          ];

      let y = 92;
      fields.forEach(([label, value], i) => {
        if (i % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(20, y - 6, 170, 12, "F");
        }
        pdf.setTextColor(120, 120, 120);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.text(label, 25, y);
        pdf.setTextColor(15, 23, 42);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(String(value), 100, y);
        y += 14;
      });

      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 280, 210, 17, "F");
      pdf.setTextColor(180, 180, 180);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Generated on ${new Date().toLocaleDateString("en-BD")}  |  School Management System`,
        105,
        290,
        { align: "center" },
      );
      pdf.save(`${name}_Profile.pdf`);
    };
    document.head.appendChild(script);
  };

  const pendingByClass = {};
  applications.forEach((app) => {
    const rawClass = app.applyClass || "Other";
    if (!pendingByClass[rawClass]) pendingByClass[rawClass] = [];
    pendingByClass[rawClass].push(app);
  });

  // =============================================
  // ✅ ADMIN PANEL — আলাদা Full Page UI
  // =============================================
  if (showAdminPanel) {
    return (
      <div
        className="mobile-padding"
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#f8fafc",
          fontFamily: "Poppins",
        }}
      >
        {/* Top Bar */}
        <div style={adminTopBarStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setShowAdminPanel(false)}
              style={backBtnStyle}
            >
              ← Back
            </button>
            <h2 style={{ margin: 0, color: "white", fontSize: "18px" }}>
              Admin — Pending Admissions
            </h2>
          </div>
          <span style={totalBadgeStyle}>{applications.length} Pending</span>
        </div>

        <div
          className="mobile-padding"
          style={{
            padding: "24px",
            maxWidth: "900px",
            margin: "0 auto",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          {applications.length === 0 && (
            <div style={emptyBoxStyle}>
              <p style={{ fontSize: "40px", margin: 0 }}>🎉</p>
              <p style={{ color: "#999", margin: "8px 0 0" }}>
                No pending applications
              </p>
            </div>
          )}

          {/* ক্লাস ভিত্তিক গ্রুপ */}
          {Object.entries(pendingByClass).map(([className, apps]) => (
            <div key={className} style={classGroupCardStyle}>
              {/* Class Header */}
              <div style={classGroupHeaderStyle}>
                <span style={{ fontSize: "16px", fontWeight: "700" }}>
                  {className}
                </span>
                <span style={countBadgeStyle}>{apps.length} pending</span>
              </div>

              {/* Applications */}
              {apps.map((app) => (
                <div key={app.id} style={adminListItemStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <img
                      src={app.image || `https://i.pravatar.cc/150?u=${app.id}`}
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #fff3f0",
                      }}
                      onError={(e) => {
                        e.target.src = "https://i.pravatar.cc/150";
                      }}
                    />
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "700",
                          color: "#0F172A",
                          fontSize: "15px",
                        }}
                      >
                        {app.studentName}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                        📞 {app.phone || "N/A"} &nbsp;·&nbsp; 🎂{" "}
                        {app.dob || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => setSelectedApp(app)}
                      style={detailsBtnStyle}
                    >
                      👁 Details
                    </button>
                    <button
                      onClick={() => downloadPDF(app, true)}
                      style={downloadBtnStyle}
                    >
                      ⬇ PDF
                    </button>
                    <button
                      onClick={() => approveApplication(app)}
                      style={approveBtnStyle}
                    >
                      ✓ Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Application Details Modal */}
        {selectedApp && (
          <div style={modalBgStyle} onClick={() => setSelectedApp(null)}>
            <div
              className="mobile-padding-inner"
              style={{ ...modalStyle, boxSizing: "border-box" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={modalHeaderStyle}>
                <h3 style={{ margin: 0, color: "#0F172A" }}>
                  Application Details
                </h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  style={closeXBtnStyle}
                >
                  ✕
                </button>
              </div>
              <div style={avatarRowStyle}>
                <img
                  src={selectedApp.image || "https://i.pravatar.cc/150"}
                  style={avatarStyle}
                  onError={(e) => {
                    e.target.src = "https://i.pravatar.cc/150";
                  }}
                />
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#0F172A",
                    }}
                  >
                    {selectedApp.studentName}
                  </p>
                  <span style={classBadgeStyle}>{selectedApp.applyClass}</span>
                </div>
              </div>
              {[
                ["Parent / Guardian", selectedApp.parentName],
                ["Phone", selectedApp.phone],
                ["Email", selectedApp.email],
                ["Date of Birth", selectedApp.dob],
                ["Address", selectedApp.address],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} style={detailRowStyle}>
                    <span
                      style={{
                        color: "#999",
                        fontSize: "13px",
                        minWidth: "130px",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        color: "#0F172A",
                        fontSize: "14px",
                        fontWeight: "500",
                        flex: 1,
                        textAlign: "right",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ) : null,
              )}
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  onClick={() => approveApplication(selectedApp)}
                  style={{ ...approveBtnStyle, flex: 2, padding: "12px" }}
                >
                  ✓ Approve Student
                </button>
                <button
                  onClick={() => downloadPDF(selectedApp, true)}
                  style={{ ...downloadBtnStyle, flex: 1, padding: "12px" }}
                >
                  ⬇ PDF
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  style={{ ...closeBtnStyle, flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =============================================
  // ✅ MAIN PAGE — Student List
  // =============================================
  return (
    <div
      className="mobile-padding"
      style={{
        width: "100%",
        padding: "20px",
        fontFamily: "Poppins",
        boxSizing: "border-box",
      }}
    >
      {/* Admin Button — শুধু admin দেখবে */}
      {userRole === "admin" && (
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto 20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => setShowAdminPanel(true)}
            style={adminOpenBtnStyle}
          >
            🛡 Admin Panel
            {applications.length > 0 && (
              <span style={notifBadgeStyle}>{applications.length}</span>
            )}
          </button>
        </div>
      )}

      {/* Class Tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {[6, 7, 8, 9, 10].map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            style={tabStyle(selectedClass === cls)}
          >
            Cls {cls}
            <span style={tabCountStyle}>{allClasses[cls]?.length || 0}</span>
          </button>
        ))}
      </div>

      <p
        style={{
          textAlign: "center",
          color: "#999",
          fontSize: "14px",
          marginBottom: "12px",
        }}
      >
        Class {selectedClass} — {allClasses[selectedClass]?.length || 0}{" "}
        students
      </p>

      {/* Student List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {allClasses[selectedClass]?.length === 0 && (
          <p style={{ textAlign: "center", color: "#ccc" }}>
            No students in this class
          </p>
        )}
        {allClasses[selectedClass]?.map((st, index) => (
          <div key={st.id || index} style={listItemStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={st.image || "https://i.pravatar.cc/150"}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.src = "https://i.pravatar.cc/150";
                }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: "600", color: "#103741" }}>
                  {st.name}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                  {st.address || "No address"}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "#666" }}>
                Roll: {st.roll}
              </span>
              <button
                onClick={() => setSelectedStudent(st)}
                style={detailsBtnStyle}
              >
                👁 Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div style={modalBgStyle} onClick={() => setSelectedStudent(null)}>
          <div
            className="mobile-padding-inner"
            style={{
              ...modalStyle,
              maxWidth: "520px",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, color: "#0F172A" }}>Student Profile</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                style={closeXBtnStyle}
              >
                ✕
              </button>
            </div>
            <div style={avatarRowStyle}>
              <img
                src={selectedStudent.image || "https://i.pravatar.cc/150"}
                style={{ ...avatarStyle, width: "70px", height: "70px" }}
                onError={(e) => {
                  e.target.src = "https://i.pravatar.cc/150";
                }}
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#0F172A",
                  }}
                >
                  {selectedStudent.name}
                </p>
                <span style={classBadgeStyle}>
                  Class {selectedStudent.class}
                </span>
                <span
                  style={{
                    ...classBadgeStyle,
                    background: "#f0fdf4",
                    color: "#16a34a",
                    marginLeft: "6px",
                  }}
                >
                  Roll: {selectedStudent.roll}
                </span>
              </div>
            </div>
            {[
              ["Parent / Guardian", selectedStudent.parentName],
              ["Phone", selectedStudent.phone],
              ["Email", selectedStudent.email],
              ["Date of Birth", selectedStudent.dob],
              ["Address", selectedStudent.address],
            ].map(([label, value]) =>
              value ? (
                <div key={label} style={detailRowStyle}>
                  <span
                    style={{
                      color: "#999",
                      fontSize: "13px",
                      minWidth: "130px",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      color: "#0F172A",
                      fontSize: "14px",
                      fontWeight: "500",
                      flex: 1,
                      textAlign: "right",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ) : null,
            )}
            {selectedStudent.results?.length > 0 && (
              <div style={{ marginTop: "16px", overflowX: "auto" }}>
                <p
                  style={{
                    fontWeight: "700",
                    color: "#0F172A",
                    marginBottom: "8px",
                  }}
                >
                  Academic Results
                </p>
                <table
                  style={{
                    width: "100%",
                    minWidth: "300px",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#fff3f0" }}>
                      <th style={thStyle}>Subject</th>
                      <th style={thStyle}>Marks</th>
                      <th style={thStyle}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.results.map((res, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={tdStyle}>{res.subject}</td>
                        <td style={tdStyle}>{res.mark}</td>
                        <td
                          style={{
                            ...tdStyle,
                            color: "#10b981",
                            fontWeight: "700",
                          }}
                        >
                          {res.grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={() => downloadPDF(selectedStudent, false)}
                style={{
                  ...downloadBtnStyle,
                  flex: 2,
                  padding: "12px",
                  fontSize: "14px",
                }}
              >
                ⬇ Download PDF
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{ ...closeBtnStyle, flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const adminOpenBtnStyle = {
  background: "#0F172A",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "30px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  position: "relative",
};
const notifBadgeStyle = {
  background: "#2563EB",
  color: "white",
  borderRadius: "999px",
  padding: "2px 8px",
  fontSize: "11px",
  fontWeight: "700",
};
const adminTopBarStyle = {
  background: "#0F172A",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "10px",
};
const backBtnStyle = {
  background: "rgba(255,255,255,0.15)",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};
const totalBadgeStyle = {
  background: "#2563EB",
  color: "white",
  padding: "6px 16px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "700",
};
const emptyBoxStyle = {
  textAlign: "center",
  padding: "60px",
  background: "white",
  borderRadius: "16px",
  border: "1px solid #eee",
};
const classGroupCardStyle = {
  background: "white",
  borderRadius: "14px",
  border: "1px solid #eee",
  marginBottom: "20px",
  overflow: "hidden",
};
const classGroupHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 20px",
  background: "#fff3f0",
  borderBottom: "1px solid #ffe4dc",
  flexWrap: "wrap",
  gap: "10px",
};
const countBadgeStyle = {
  background: "#2563EB",
  color: "white",
  borderRadius: "999px",
  padding: "3px 12px",
  fontSize: "12px",
  fontWeight: "700",
};
const adminListItemStyle = {
  padding: "14px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #f5f5f5",
  flexWrap: "wrap",
  gap: "10px",
};
const listItemStyle = {
  background: "white",
  padding: "14px 18px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #eee",
  marginBottom: "4px",
  flexWrap: "wrap",
  gap: "10px",
};
const detailsBtnStyle = {
  background: "#e0f2fe",
  color: "#0369a1",
  border: "none",
  padding: "7px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px",
};
const downloadBtnStyle = {
  background: "#f0fdf4",
  color: "#16a34a",
  border: "none",
  padding: "7px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px",
};
const approveBtnStyle = {
  background: "#10b981",
  color: "white",
  border: "none",
  padding: "7px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px",
};
const modalBgStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "460px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  maxHeight: "90vh",
  overflowY: "auto",
};
const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};
const avatarRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "20px",
  paddingBottom: "16px",
  borderBottom: "1px solid #f0f0f0",
  flexWrap: "wrap",
};
const avatarStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  objectFit: "cover",
};
const closeXBtnStyle = {
  background: "#f0f0f0",
  border: "none",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  cursor: "pointer",
  fontSize: "16px",
};
const closeBtnStyle = {
  background: "#eee",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};
const detailRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "9px 0",
  borderBottom: "1px solid #f5f5f5",
  flexWrap: "wrap",
  gap: "5px",
};
const classBadgeStyle = {
  background: "#EFF6FF",
  color: "#2563EB",
  fontSize: "12px",
  padding: "3px 10px",
  borderRadius: "20px",
  fontWeight: "600",
  display: "inline-block",
  marginTop: "4px",
};
const tabStyle = (active) => ({
  padding: "8px 16px",
  borderRadius: "20px",
  border: "none",
  background: active ? "#2563EB" : "#eee",
  color: active ? "white" : "#333",
  cursor: "pointer",
  fontWeight: active ? "600" : "400",
  display: "flex",
  alignItems: "center",
  gap: "6px",
});
const tabCountStyle = {
  background: "rgba(0,0,0,0.1)",
  borderRadius: "999px",
  padding: "1px 7px",
  fontSize: "11px",
};
const thStyle = {
  padding: "8px 12px",
  textAlign: "left",
  color: "#2563EB",
  fontWeight: "600",
  fontSize: "13px",
};
const tdStyle = {
  padding: "8px 12px",
  color: "#333",
  fontSize: "13px",
};
