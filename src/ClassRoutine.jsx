import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default function ClassRoutine() {
  const userRole = localStorage.getItem("userRole") || "guest";
  const isAdmin = userRole === "admin";

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const classesList = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

  // Generating default routine
  const generateDefaultRoutine = (teacherData) => {
    const routine = {};
    teacherData.forEach((t) => {
      routine[t.id] = days.map((day) => ({
        day,
        s1: "Class 10",
        s2: "Class 9",
        s3: "Class 8",
        s4: "Class 7",
        s5: "Class 6",
      }));
    });
    return routine;
  };

  const [teachers, setTeachers] = useState([]);
  const [routines, setRoutines] = useState({});
  const [classRoutines, setClassRoutines] = useState({});
  const [viewMode, setViewMode] = useState("teacher"); // "teacher" or "class"
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const teacherRefs = useRef({});

  // 🟢 Load data from Firebase
  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        // Fetch teachers from 'profiles' collection first
        const profilesSnap = await getDocs(collection(db, "profiles"));
        const fetchedTeachers = [];
        profilesSnap.forEach((doc) => {
          fetchedTeachers.push({
            id: doc.id,
            name: doc.data().name || "Unnamed Teacher",
            subject: doc.data().subject || "General Subject",
          });
        });

        const docSnap = await getDoc(doc(db, "classRoutine", "main"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const savedTeachers = data.teachers || [];

          const mergedTeachersMap = new Map();

          // Add saved teachers first to keep manual edits
          savedTeachers.forEach((t) => mergedTeachersMap.set(t.id, t));

          // Add or update with fetched profiles
          fetchedTeachers.forEach((t) => {
            if (mergedTeachersMap.has(t.id)) {
              // Update name but keep existing subject if it was manually set
              const existing = mergedTeachersMap.get(t.id);
              mergedTeachersMap.set(t.id, { ...existing, name: t.name });
            } else {
              mergedTeachersMap.set(t.id, t);
            }
          });

          const finalTeachers = Array.from(mergedTeachersMap.values());
          setTeachers(finalTeachers);

          let currentRoutines = data.routines || {};

          // Ensure all teachers have a routine
          finalTeachers.forEach((t) => {
            if (!currentRoutines[t.id]) {
              currentRoutines[t.id] = days.map((day) => ({
                day,
                s1: "Class 10",
                s2: "Class 9",
                s3: "Class 8",
                s4: "Class 7",
                s5: "Class 6",
              }));
            }
          });

          setRoutines(currentRoutines);

          let currentClassRoutines = data.classRoutines || {};
          classesList.forEach((cls) => {
            if (!currentClassRoutines[cls]) {
              currentClassRoutines[cls] = days.map((day) => ({
                day,
                s1: "-",
                s2: "-",
                s3: "-",
                s4: "-",
                s5: "-",
              }));
            }
          });
          setClassRoutines(currentClassRoutines);
        } else {
          // If no data exists in firebase, set to default using fetched profiles
          setTeachers(fetchedTeachers);
          setRoutines(generateDefaultRoutine(fetchedTeachers));
          const defClassRoutines = {};
          classesList.forEach((cls) => {
            defClassRoutines[cls] = days.map((day) => ({
              day,
              s1: "-",
              s2: "-",
              s3: "-",
              s4: "-",
              s5: "-",
            }));
          });
          setClassRoutines(defClassRoutines);
        }
      } catch (error) {
        console.error("Error fetching routine:", error);
      }
      setLoading(false);
    };

    if (userRole !== "guest" && userRole !== "user") {
      fetchRoutine();
    }
  }, [userRole]);

  // Block Guest/User Access
  if (userRole === "guest" || userRole === "user") {
    return (
      <div style={{ padding: "100px", textAlign: "center", color: "#103741" }}>
        <h2>🚫 Access Denied</h2>
        <p>
          You must be logged in as a Teacher or Admin to view the Class Routine.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading Routine...
      </div>
    );
  }

  const handleTeacherChange = (id, field, value) => {
    setTeachers(
      teachers.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const handleRoutineChange = (teacherId, dayIndex, slot, value) => {
    setRoutines((prev) => ({
      ...prev,
      [teacherId]: prev[teacherId].map((r, i) =>
        i === dayIndex ? { ...r, [slot]: value } : r,
      ),
    }));
  };

  const handleClassRoutineChange = (className, dayIndex, slot, value) => {
    setClassRoutines((prev) => ({
      ...prev,
      [className]: prev[className].map((r, i) =>
        i === dayIndex ? { ...r, [slot]: value } : r,
      ),
    }));
  };

  const handleAddTeacher = () => {
    const newId = "manual_" + Date.now();
    const newTeacher = {
      id: newId,
      name: "New Teacher Name",
      subject: "Subject",
    };

    setTeachers([newTeacher, ...teachers]); // Add to the top

    setRoutines((prev) => ({
      ...prev,
      [newId]: days.map((day) => ({
        day,
        s1: "Class 10",
        s2: "Class 9",
        s3: "Class 8",
        s4: "Class 7",
        s5: "Class 6",
      })),
    }));
  };

  const handleRemoveTeacher = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this teacher and their routine?",
      )
    ) {
      setTeachers(teachers.filter((t) => t.id !== id));
      setRoutines((prev) => {
        const newRoutines = { ...prev };
        delete newRoutines[id];
        return newRoutines;
      });

      // Also permanently delete from 'profiles' if it's a fetched teacher
      if (id && !String(id).startsWith("manual_")) {
        try {
          await deleteDoc(doc(db, "profiles", id));
        } catch (error) {
          console.error("Error deleting teacher profile:", error);
        }
      }
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const foundTeacher = teachers.find((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (foundTeacher && teacherRefs.current[foundTeacher.id]) {
      teacherRefs.current[foundTeacher.id].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      alert("Teacher not found. Please try another name.");
    }
  };

  // 🟢 Save to Firebase Function
  const handleSaveToFirebase = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "classRoutine", "main"), {
        teachers,
        routines,
        classRoutines,
      });
      alert("Routine successfully saved to Firebase!");
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving routine:", error);
      alert("Failed to save routine. Check console for details.");
    }
    setIsSaving(false);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      handleSaveToFirebase();
    } else {
      setIsEditMode(true);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <h2 style={{ color: "#103741", margin: 0 }}>🗓️ Class Routine</h2>

        {/* Search Bar Container */}
        <div
          style={{ display: "flex", gap: "10px", flex: "1", maxWidth: "400px" }}
        >
          <input
            type="text"
            placeholder="Search teacher by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              flex: 1,
              padding: "10px 15px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              background: "#103741",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Search
          </button>
        </div>

        {/* 🟢 Only Admin Can Edit/Save */}
        {isAdmin && (
          <button
            onClick={toggleEditMode}
            disabled={isSaving}
            style={{
              padding: "10px 20px",
              background: isEditMode ? "#4CAF50" : "#FE5D37",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Admin Edit Mode"}
          </button>
        )}
      </div>

      <p style={{ color: "#666", marginBottom: "20px", fontSize: "16px" }}>
        Weekly schedule for our teachers and classes (10:00 AM to 4:00 PM).
      </p>

      {/* 🟢 View Mode Toggle */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          borderBottom: "2px solid #eee",
          paddingBottom: "10px",
        }}
      >
        <button
          onClick={() => setViewMode("teacher")}
          style={{
            padding: "10px 20px",
            background: viewMode === "teacher" ? "#103741" : "transparent",
            color: viewMode === "teacher" ? "white" : "#103741",
            border: viewMode === "teacher" ? "none" : "1px solid #103741",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          👨‍🏫 Teacher Base Routine
        </button>
        <button
          onClick={() => setViewMode("class")}
          style={{
            padding: "10px 20px",
            background: viewMode === "class" ? "#FE5D37" : "transparent",
            color: viewMode === "class" ? "white" : "#FE5D37",
            border: viewMode === "class" ? "none" : "1px solid #FE5D37",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🎒 Class Base Routine
        </button>
      </div>

      {viewMode === "teacher" ? (
        <>
          {/* 🟢 Add Teacher Button (Only visible to Admin in Edit Mode) */}
          {isAdmin && isEditMode && (
            <div style={{ marginBottom: "40px" }}>
              <button
                onClick={handleAddTeacher}
                style={{
                  padding: "12px 24px",
                  background: "#103741",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                ➕ Add New Teacher / Time Slot
              </button>
            </div>
          )}

          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              ref={(el) => (teacherRefs.current[teacher.id] = el)}
              style={{
                marginBottom: "50px",
                background: "#fff",
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                border: "1px solid #eee",
                scrollMarginTop: "20px",
              }}
            >
              <div
                style={{
                  borderBottom: "2px solid #FE5D37",
                  paddingBottom: "15px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <span style={{ fontSize: "24px" }}>👨‍🏫</span>
                  {isAdmin && isEditMode ? (
                    <>
                      <input
                        value={teacher.name}
                        onChange={(e) =>
                          handleTeacherChange(
                            teacher.id,
                            "name",
                            e.target.value,
                          )
                        }
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#103741",
                          padding: "5px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "18px",
                          color: "#888",
                          marginLeft: "10px",
                        }}
                      >
                        Subject:
                      </span>
                      <input
                        value={teacher.subject}
                        onChange={(e) =>
                          handleTeacherChange(
                            teacher.id,
                            "subject",
                            e.target.value,
                          )
                        }
                        style={{
                          fontSize: "16px",
                          color: "#555",
                          padding: "5px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      />
                    </>
                  ) : (
                    <h3
                      onClick={() => setSelectedTeacher(teacher)}
                      style={{
                        margin: 0,
                        color: "#103741",
                        fontSize: "24px",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      title="Click to view profile details"
                    >
                      {teacher.name}{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          color: "#888",
                          fontWeight: "normal",
                          textDecoration: "none",
                        }}
                      >
                        ({teacher.subject})
                      </span>
                    </h3>
                  )}
                </div>
                {isAdmin && isEditMode && (
                  <button
                    onClick={() => handleRemoveTeacher(teacher.id)}
                    style={{
                      padding: "8px 16px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "center",
                    minWidth: "800px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#F1F8FF", color: "#103741" }}>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "12%",
                        }}
                      >
                        Day / Time
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                        }}
                      >
                        10:00 - 11:00 AM
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                        }}
                      >
                        11:00 - 12:00 PM
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                        }}
                      >
                        12:00 - 01:00 PM
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                          background: "#FFF5F3",
                          color: "#FE5D37",
                        }}
                      >
                        01:00 - 02:00 PM
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                        }}
                      >
                        02:00 - 03:00 PM
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                        }}
                      >
                        03:00 - 04:00 PM
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {routines[teacher.id] &&
                      routines[teacher.id].map((row, idx) => (
                        <tr
                          key={idx}
                          style={{
                            background: idx % 2 === 0 ? "#fdfdfd" : "#fff",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <td
                            style={{
                              padding: "15px",
                              fontWeight: "bold",
                              border: "1px solid #ddd",
                              color: "#FE5D37",
                            }}
                          >
                            {row.day}
                          </td>

                          {[
                            { key: "s1", val: row.s1 },
                            { key: "s2", val: row.s2 },
                            { key: "s3", val: row.s3 },
                          ].map((slot) => (
                            <td
                              key={slot.key}
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {isAdmin && isEditMode ? (
                                <input
                                  value={slot.val}
                                  onChange={(e) =>
                                    handleRoutineChange(
                                      teacher.id,
                                      idx,
                                      slot.key,
                                      e.target.value,
                                    )
                                  }
                                  style={{
                                    width: "90%",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                  }}
                                />
                              ) : (
                                slot.val
                              )}
                            </td>
                          ))}

                          <td
                            style={{
                              padding: "15px",
                              border: "1px solid #ddd",
                              background: "#FFF5F3",
                              fontWeight: "bold",
                              color: "#555",
                            }}
                          >
                            Break
                          </td>

                          {[
                            { key: "s4", val: row.s4 },
                            { key: "s5", val: row.s5 },
                          ].map((slot) => (
                            <td
                              key={slot.key}
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {isAdmin && isEditMode ? (
                                <input
                                  value={slot.val}
                                  onChange={(e) =>
                                    handleRoutineChange(
                                      teacher.id,
                                      idx,
                                      slot.key,
                                      e.target.value,
                                    )
                                  }
                                  style={{
                                    width: "90%",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                  }}
                                />
                              ) : (
                                slot.val
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {classesList.map((cls) => (
            <div
              key={cls}
              style={{
                marginBottom: "50px",
                background: "#fff",
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                border: "1px solid #eee",
              }}
            >
              <div
                style={{
                  borderBottom: "2px solid #FE5D37",
                  paddingBottom: "15px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ margin: 0, color: "#103741", fontSize: "24px" }}>
                  🎒 {cls} Routine
                </h3>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "center",
                    minWidth: "800px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#F1F8FF", color: "#103741" }}>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "12%",
                        }}
                      >
                        Day / Time
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                        }}
                      >
                        10:00 - 11:00 AM
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                        }}
                      >
                        11:00 - 12:00 PM
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                        }}
                      >
                        12:00 - 01:00 PM
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                          background: "#FFF5F3",
                          color: "#FE5D37",
                        }}
                      >
                        01:00 - 02:00 PM
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                        }}
                      >
                        02:00 - 03:00 PM
                      </th>
                      <th
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          width: "14%",
                        }}
                      >
                        03:00 - 04:00 PM
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {classRoutines[cls] &&
                      classRoutines[cls].map((row, idx) => (
                        <tr
                          key={idx}
                          style={{
                            background: idx % 2 === 0 ? "#fdfdfd" : "#fff",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <td
                            style={{
                              padding: "15px",
                              fontWeight: "bold",
                              border: "1px solid #ddd",
                              color: "#FE5D37",
                            }}
                          >
                            {row.day}
                          </td>

                          {[
                            { key: "s1", val: row.s1 },
                            { key: "s2", val: row.s2 },
                            { key: "s3", val: row.s3 },
                          ].map((slot) => (
                            <td
                              key={slot.key}
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {isAdmin && isEditMode ? (
                                <input
                                  value={slot.val}
                                  onChange={(e) =>
                                    handleClassRoutineChange(
                                      cls,
                                      idx,
                                      slot.key,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Teacher/Subject"
                                  style={{
                                    width: "90%",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                  }}
                                />
                              ) : (
                                slot.val
                              )}
                            </td>
                          ))}

                          <td
                            style={{
                              padding: "15px",
                              border: "1px solid #ddd",
                              background: "#FFF5F3",
                              fontWeight: "bold",
                              color: "#555",
                            }}
                          >
                            Break
                          </td>

                          {[
                            { key: "s4", val: row.s4 },
                            { key: "s5", val: row.s5 },
                          ].map((slot) => (
                            <td
                              key={slot.key}
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {isAdmin && isEditMode ? (
                                <input
                                  value={slot.val}
                                  onChange={(e) =>
                                    handleClassRoutineChange(
                                      cls,
                                      idx,
                                      slot.key,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Teacher/Subject"
                                  style={{
                                    width: "90%",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                  }}
                                />
                              ) : (
                                slot.val
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Teacher Profile Modal (Simplified View) */}
      {selectedTeacher && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "90%",
              position: "relative",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <button
              onClick={() => setSelectedTeacher(null)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#888",
              }}
            >
              ✖
            </button>
            <div style={{ fontSize: "60px", marginBottom: "15px" }}>👨‍🏫</div>
            <h2 style={{ color: "#103741", margin: "0 0 10px 0" }}>
              {selectedTeacher.name}
            </h2>
            <p
              style={{
                color: "#FE5D37",
                fontSize: "18px",
                margin: "0 0 20px 0",
                fontWeight: "bold",
              }}
            >
              {selectedTeacher.subject}
            </p>
            <div
              style={{
                textAlign: "left",
                background: "#f9f9f9",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #eee",
              }}
            >
              <p style={{ margin: "10px 0", fontSize: "16px" }}>
                <strong>Routine ID:</strong> {selectedTeacher.id}
              </p>
            </div>
            <button
              onClick={() => setSelectedTeacher(null)}
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                background: "#103741",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                width: "100%",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
