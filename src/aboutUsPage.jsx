import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AboutUsPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Auth State from localStorage
  const [userRole] = useState(
    localStorage.getItem("userRole") || "guest",
  ); // admin, teacher, guest

  // --- New states for SSC & Achievements ---
  const [sscData, setSscData] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);
  const [editingSscIndex, setEditingSscIndex] = useState(null);
  const [isEditingAch, setIsEditingAch] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [editingTopStudent, setEditingTopStudent] = useState(null);
  const [tempSscData, setTempSscData] = useState([]);
  const [tempAchievementsData, setTempAchievementsData] = useState([]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "profiles"));
      const profilesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTeachers(profilesList);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
    setLoading(false);
  };

  const fetchAboutUsData = async () => {
    try {
      const sscSnap = await getDoc(doc(db, "settings", "aboutUsSSC"));
      if (sscSnap.exists() && sscSnap.data().data) {
        setSscData(sscSnap.data().data);
      } else {
        const defSSC = Array.from({ length: 5 }, (_, i) => ({
          year: 2025 - i,
          passingRate: "100%",
          gpa5: "20",
          topStudents: Array.from({ length: 5 }, (_, j) => ({
            name: `Student ${j + 1}`,
            marks: 1100 - j * 10,
            roll: `100${j + 1}`,
            group: "Science",
            bangla: 80,
            english: 85,
            math: 90,
            physics: 88,
            chemistry: 82,
            biology: 90,
            religion: 95,
            bgs: 82,
            ict: 90,
          })),
        }));
        setSscData(defSSC);
      }

      const achSnap = await getDoc(doc(db, "settings", "aboutUsAch"));
      if (achSnap.exists() && achSnap.data().data) {
        setAchievementsData(achSnap.data().data);
      } else {
        const defAch = [
          {
            name: "Ayman Sadiq",
            image: "https://i.pravatar.cc/300?img=11",
            college: "Dhaka University (IBA)",
            profession: "Entrepreneur",
            jobTitle: "CEO at 10 Minute School",
          },
          {
            name: "Sumaiya Binte",
            image: "https://i.pravatar.cc/300?img=5",
            college: "BUET",
            profession: "Engineer",
            jobTitle: "Software Engineer at Google",
          },
        ];
        setAchievementsData(defAch);
      }
    } catch (error) {
      console.error("Error fetching about us data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProfiles();
      await fetchAboutUsData();
    };
    loadData();
  }, []);

  const handleSscChange = (yearIndex, field, value) => {
    const newData = [...tempSscData];
    newData[yearIndex][field] = value;
    setTempSscData(newData);
  };

  const handleTopStudentChange = (yearIndex, studentIndex, field, value) => {
    const newData = [...tempSscData];
    newData[yearIndex].topStudents[studentIndex][field] = value;
    setTempSscData(newData);
  };

  const handleAchChange = (index, field, value) => {
    const newData = [...tempAchievementsData];
    newData[index][field] = value;
    setTempAchievementsData(newData);
  };

  const addAchievement = () => {
    setTempAchievementsData([
      { name: "", image: "", college: "", profession: "", jobTitle: "" },
      ...tempAchievementsData,
    ]);
  };

  const removeAchievement = (index) => {
    const newData = tempAchievementsData.filter((_, i) => i !== index);
    setTempAchievementsData(newData);
  };

  const saveSscData = async () => {
    try {
      await setDoc(doc(db, "settings", "aboutUsSSC"), { data: tempSscData });
      setSscData(tempSscData);
      setEditingSscIndex(null);
      alert("SSC Data saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save SSC data");
    }
  };

  const saveAchievementsData = async () => {
    try {
      await setDoc(doc(db, "settings", "aboutUsAch"), {
        data: tempAchievementsData,
      });
      setAchievementsData(tempAchievementsData);
      setIsEditingAch(false);
      alert("Achievements saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save Achievements data");
    }
  };

  // সেরা ১০ ছাত্রের ডাটা
  const topStudents = Array.from({ length: 10 }, (_, i) => ({
    name: `Student Name ${i + 1}`,
    pos: i + 1,
    marks: 600 - i * 5,
    year: "2025",
  }));

  const getGPA = (marks) => {
    const m = Number(marks) || 0;
    if (m >= 80) return 5.0;
    if (m >= 70) return 4.0;
    if (m >= 60) return 3.5;
    if (m >= 50) return 3.0;
    if (m >= 40) return 2.0;
    if (m >= 33) return 1.0;
    return 0.0;
  };

  const calculateResult = (student) => {
    if (student.bangla === undefined && student.marks !== undefined) {
      return { cgpa: "N/A", totalMarks: student.marks };
    }

    const commonSubjects = [
      "bangla",
      "english",
      "math",
      "religion",
      "bgs",
      "ict",
    ];
    const groupSubjects = {
      Science: ["physics", "chemistry", "biology"],
      Arts: ["history", "civics", "economics"],
      Commerce: ["accounting", "finance", "businessEnt"],
    };

    const group = student.group || "Science";
    const studentSubjects = [
      ...commonSubjects,
      ...(groupSubjects[group] || []),
    ];

    let totalGPA = 0;
    let failed = false;
    let subjectCount = 0;
    let totalMarks = 0;

    studentSubjects.forEach((sub) => {
      const marks = student[sub];
      if (marks !== undefined && marks !== null && marks !== "") {
        const m = Number(marks);
        totalMarks += m;
        const gpa = getGPA(m);
        if (gpa === 0) failed = true;
        totalGPA += gpa;
        subjectCount++;
      }
    });

    if (failed || subjectCount === 0) return { cgpa: "0.00", totalMarks };
    const cgpa = (totalGPA / subjectCount).toFixed(2);
    return { cgpa, totalMarks };
  };

  return (
    <div
      className="mobile-padding"
      style={{
        padding: "5%",
        background: "#fff",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* ২. শিক্ষকদের তালিকা (Grid) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
          color: "#0F172A",
          borderLeft: "5px solid #2563EB",
            paddingLeft: "15px",
            margin: 0,
          }}
        >
          Our Expert Teachers
        </h2>
      </div>

      {loading ? (
        <p>Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <div>
          <p>No teachers found in database.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "25px",
            marginBottom: "60px",
          }}
        >
          {teachers.map((t) => (
            <div
              key={t.id}
              style={{
                background: "#f9f9f9",
                padding: "20px",
                borderRadius: "15px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                position: "relative",
              }}
            >
              <img
                src={t.picture || "https://i.pravatar.cc/150"}
                onClick={() => navigate(`/profile/${t.id}?view=true`)}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  marginBottom: "10px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                alt={t.name}
              />
          <h4 style={{ margin: "5px 0", color: "#0F172A" }}>
                {t.name || "Unnamed Teacher"}
              </h4>
              <p
                style={{
                  margin: "0",
              color: "#2563EB",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {t.email}
              </p>

              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => navigate(`/profile/${t.id}?view=true`)}
                  style={{
              background: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  View
                </button>
                {userRole === "admin" && (
                  <button
                    onClick={() => navigate(`/profile/${t.id}`)}
                    style={{
              background: "#0F172A",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ৩. অ্যাচিভমেন্ট সেকশন (Class 5 Result) */}
      <div
        style={{
      background: "#0F172A",
          color: "#white",
          padding: "40px",
          borderRadius: "20px",
          marginBottom: "60px",
        }}
      >
        <h2 style={{ color: "#fff" }}>School Achievements (Class 5)</h2>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={statBox}>
            <h3>100%</h3>
            <p>Passing Rate</p>
          </div>
          <div style={statBox}>
            <h3>45</h3>
            <p>GPA 5.00 (2025)</p>
          </div>
          <div style={statBox}>
            <h3>12</h3>
            <p>Scholarships</p>
          </div>
        </div>
      </div>

      {/* ৪. সেরা ১০ ছাত্রের তালিকা */}
      <h2 style={{ color: "#0F172A", marginBottom: "20px" }}>
        Top 10 Students (Class 5 - 2025)
      </h2>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "500px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#2563EB",
                color: "white",
                textAlign: "left",
              }}
            >
              <th style={tdStyle}>Rank</th>
              <th style={tdStyle}>Student Name</th>
              <th style={tdStyle}>Total Marks</th>
              <th style={tdStyle}>Year</th>
            </tr>
          </thead>
          <tbody>
            {topStudents.map((s, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>#{s.pos}</td>
                <td style={tdStyle}>{s.name}</td>
                <td style={tdStyle}>{s.marks}</td>
                <td style={tdStyle}>{s.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ৫. SSC Passing Data (Last 5 Years) */}
      <div style={{ marginTop: "60px", marginBottom: "60px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h2
            style={{
            color: "#0F172A",
            borderLeft: "5px solid #2563EB",
              paddingLeft: "15px",
              margin: 0,
            }}
          >
            SSC Passing Data (Last 5 Years)
          </h2>
        </div>

        <div>
          {sscData.map((yearData, i) => (
            <div
              key={i}
              style={{
                marginBottom: "40px",
                border: "1px solid #eee",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  background: "#0F172A",
                  color: "white",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: "15px",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "20px" }}>
                  📅 Year: {yearData.year}
                </h3>
            <h3 style={{ margin: 0, color: "#2563EB", fontSize: "20px" }}>
                  📈 Passing Rate: {yearData.passingRate}
                </h3>
                <h3 style={{ margin: 0, fontSize: "20px" }}>
                  🏆 GPA 5.00: {yearData.gpa5}
                </h3>
                {userRole === "admin" && editingSscIndex !== i && (
                  <button
                    onClick={() => {
                      setTempSscData(JSON.parse(JSON.stringify(sscData)));
                      setEditingSscIndex(i);
                    }}
                    style={adminBtnStyle}
                  >
                    ✏️ Edit Year
                  </button>
                )}
              </div>

              {editingSscIndex === i ? (
                <div style={{ padding: "20px", background: "#f8fafc" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      marginBottom: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: "1 1 150px" }}>
                      <label style={labelStyle}>Year</label>
                      <input
                        type="number"
                        value={tempSscData[i].year}
                        onChange={(e) =>
                          handleSscChange(i, "year", e.target.value)
                        }
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ flex: "1 1 150px" }}>
                      <label style={labelStyle}>Passing Rate</label>
                      <input
                        type="text"
                        value={tempSscData[i].passingRate}
                        onChange={(e) =>
                          handleSscChange(i, "passingRate", e.target.value)
                        }
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ flex: "1 1 150px" }}>
                      <label style={labelStyle}>GPA 5.00 Count</label>
                      <input
                        type="text"
                        value={tempSscData[i].gpa5}
                        onChange={(e) =>
                          handleSscChange(i, "gpa5", e.target.value)
                        }
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <h4 style={{ color: "#0F172A", marginBottom: "10px" }}>
                    Top 5 Students:
                  </h4>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {tempSscData[i].topStudents.map((student, studentIndex) => {
                      const { cgpa, totalMarks } = calculateResult(student);
                      return (
                        <div
                          key={studentIndex}
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            background: "#fff",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "bold",
                              width: "30px",
                            color: "#2563EB",
                            }}
                          >
                            #{studentIndex + 1}
                          </span>
                          <input
                            type="text"
                            placeholder="Name"
                            value={student.name}
                            onChange={(e) =>
                              handleTopStudentChange(
                                i,
                                studentIndex,
                                "name",
                                e.target.value,
                              )
                            }
                            style={{ ...inputStyle, flex: 2 }}
                          />
                          <input
                            type="text"
                            placeholder="Marks"
                            value={student.marks}
                            onChange={(e) =>
                              handleTopStudentChange(
                                i,
                                studentIndex,
                                "marks",
                                e.target.value,
                              )
                            }
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          <div
                            style={{
                              flex: 1,
                              fontSize: "13px",
                              color: "#555",
                              textAlign: "center",
                              minWidth: "120px",
                            }}
                          >
                            <strong>Marks:</strong> {totalMarks} <br />{" "}
                            <strong>CGPA:</strong> {cgpa}
                          </div>
                          <button
                            onClick={() =>
                              setEditingTopStudent({
                                yearIndex: i,
                                studentIndex,
                              })
                            }
                            style={{
                              ...adminBtnStyle,
                              padding: "8px 12px",
                              background: "#3b82f6",
                            }}
                          >
                            📝 Edit Details
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "20px" }}
                  >
                    <button onClick={saveSscData} style={saveBtnStyle}>
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSscIndex(null)}
                      style={cancelBtnStyle}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      minWidth: "400px",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                        <th style={tdStyle}>Rank</th>
                        <th style={tdStyle}>Roll</th>
                        <th style={tdStyle}>Student Name</th>
                        <th style={tdStyle}>Group</th>
                        <th style={tdStyle}>Total Marks</th>
                        <th style={tdStyle}>CGPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearData.topStudents.map((s, idx) => {
                        const { cgpa, totalMarks } = calculateResult(s);
                        return (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: "1px solid #eee",
                              background: idx % 2 === 0 ? "white" : "#fafafa",
                            }}
                          >
                            <td
                              style={{
                                ...tdStyle,
                                fontWeight: "bold",
                            color: "#2563EB",
                              }}
                            >
                              #{idx + 1}
                            </td>
                            <td style={{ ...tdStyle, color: "#555" }}>
                              {s.roll || "-"}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                fontWeight: "500",
                            color: "#0F172A",
                              }}
                            >
                              {s.name}
                            </td>
                            <td style={tdStyle}>{s.marks}</td>
                            <td style={{ ...tdStyle, color: "#555" }}>
                              {s.group || "Science"}
                            </td>
                            <td style={{ ...tdStyle, fontWeight: "bold" }}>
                              {totalMarks}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                fontWeight: "bold",
                                color: "#10b981",
                              }}
                            >
                              {cgpa}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ৬. Achievement Corner */}
      <div style={{ marginBottom: "60px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h2
            style={{
            color: "#0F172A",
            borderLeft: "5px solid #2563EB",
              paddingLeft: "15px",
              margin: 0,
            }}
          >
            Achievement Corner
          </h2>
          {userRole === "admin" && !isEditingAch && (
            <button
              onClick={() => {
                setTempAchievementsData(
                  JSON.parse(JSON.stringify(achievementsData)),
                );
                setIsEditingAch(true);
              }}
              style={adminBtnStyle}
            >
              ✏️ Edit Achievements
            </button>
          )}
          {userRole === "admin" && isEditingAch && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={addAchievement}
                style={{ ...adminBtnStyle, background: "#3b82f6" }}
              >
                + Add New
              </button>
              <button onClick={saveAchievementsData} style={saveBtnStyle}>
                Save
              </button>
              <button
                onClick={() => setIsEditingAch(false)}
                style={cancelBtnStyle}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditingAch ? (
          <div style={{ display: "grid", gap: "20px" }}>
            {tempAchievementsData.map((ach, index) => (
              <div
                key={index}
                style={{
                  background: "#f8fafc",
                  padding: "25px",
                  borderRadius: "10px",
                  position: "relative",
                  border: "1px solid #eee",
                }}
              >
                <button
                  onClick={() => removeAchievement(index)}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  🗑️ Delete
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    marginTop: "10px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Student Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={ach.name}
                      onChange={(e) =>
                        handleAchChange(index, "name", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Image URL</label>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={ach.image}
                      onChange={(e) =>
                        handleAchChange(index, "image", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>College / University</label>
                    <input
                      type="text"
                      placeholder="University"
                      value={ach.college}
                      onChange={(e) =>
                        handleAchChange(index, "college", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Profession</label>
                    <input
                      type="text"
                      placeholder="Profession"
                      value={ach.profession}
                      onChange={(e) =>
                        handleAchChange(index, "profession", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Job Title</label>
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={ach.jobTitle}
                      onChange={(e) =>
                        handleAchChange(index, "jobTitle", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >
            {achievementsData.length === 0 ? (
              <p style={{ color: "#666" }}>No achievements added yet.</p>
            ) : null}
            {achievementsData.map((ach, index) => (
              <div
                key={index}
                onClick={() => {
                  if (!isEditingAch) setSelectedAchievement(ach);
                }}
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s",
                  cursor: isEditingAch ? "default" : "pointer",
                }}
              >
                <img
                  src={ach.image || "https://i.pravatar.cc/300"}
                  style={{ width: "100%", height: "220px", objectFit: "cover" }}
                  alt={ach.name}
                />
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <h3
                    style={{
                      margin: "0 0 5px 0",
                  color: "#0F172A",
                      fontSize: "22px",
                    }}
                  >
                    {ach.name}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 15px 0",
                  color: "#2563EB",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {ach.profession}
                  </p>
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "10px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    <p style={{ margin: "0 0 8px 0" }}>
                      🎓 <strong>{ach.college}</strong>
                    </p>
                    <p style={{ margin: 0 }}>
                      💼 <strong>{ach.jobTitle}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievement Details Modal */}
      {selectedAchievement && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "500px",
              width: "90%",
              textAlign: "center",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAchievement(null)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "#eee",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
            <img
              src={selectedAchievement.image || "https://i.pravatar.cc/300"}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "20px",
            border: "4px solid #2563EB",
              }}
              alt={selectedAchievement.name}
            />
        <h2 style={{ color: "#0F172A", margin: "0 0 10px 0" }}>
              {selectedAchievement.name}
            </h2>
            <p
              style={{
            color: "#2563EB",
                fontWeight: "bold",
                fontSize: "18px",
                margin: "0 0 20px 0",
              }}
            >
              {selectedAchievement.profession}
            </p>
            <div
              style={{
                background: "#f8fafc",
                padding: "15px",
                borderRadius: "10px",
                textAlign: "left",
                fontSize: "16px",
                color: "#555",
              }}
            >
              <p style={{ margin: "10px 0" }}>
                🎓 <strong>College / University:</strong>{" "}
                {selectedAchievement.college}
              </p>
              <p style={{ margin: "10px 0" }}>
                💼 <strong>Job Title:</strong> {selectedAchievement.jobTitle}
              </p>
            </div>
            <button
              onClick={() => setSelectedAchievement(null)}
              style={{ ...saveBtnStyle, marginTop: "20px", width: "100%" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Top Student Details Modal */}
      {editingTopStudent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setEditingTopStudent(null)}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "650px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
          <h2 style={{ color: "#0F172A", marginTop: 0 }}>
              Edit Student Details
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label style={labelStyle}>Roll Number</label>
                <input
                  type="text"
                  value={
                    tempSscData[editingTopStudent.yearIndex].topStudents[
                      editingTopStudent.studentIndex
                    ].roll || ""
                  }
                  onChange={(e) =>
                    handleTopStudentChange(
                      editingTopStudent.yearIndex,
                      editingTopStudent.studentIndex,
                      "roll",
                      e.target.value,
                    )
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Group</label>
                <select
                  value={
                    tempSscData[editingTopStudent.yearIndex].topStudents[
                      editingTopStudent.studentIndex
                    ].group || "Science"
                  }
                  onChange={(e) =>
                    handleTopStudentChange(
                      editingTopStudent.yearIndex,
                      editingTopStudent.studentIndex,
                      "group",
                      e.target.value,
                    )
                  }
                  style={inputStyle}
                >
                  <option value="Science">Science</option>
                  <option value="Arts">Arts</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>
            </div>

            <h4
              style={{
              color: "#2563EB",
                borderBottom: "2px solid #eee",
                paddingBottom: "5px",
                marginBottom: "15px",
              }}
            >
              Subject Marks
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "15px",
              }}
            >
              {["bangla", "english", "math", "religion", "bgs", "ict"].map(
                (sub) => (
                  <div key={sub}>
                    <label
                      style={{ ...labelStyle, textTransform: "capitalize" }}
                    >
                      {sub}
                    </label>
                    <input
                      type="number"
                      value={
                        tempSscData[editingTopStudent.yearIndex].topStudents[
                          editingTopStudent.studentIndex
                        ][sub] || ""
                      }
                      onChange={(e) =>
                        handleTopStudentChange(
                          editingTopStudent.yearIndex,
                          editingTopStudent.studentIndex,
                          sub,
                          e.target.value,
                        )
                      }
                      style={inputStyle}
                    />
                  </div>
                ),
              )}

              {/* Group specific subjects */}
              {(tempSscData[editingTopStudent.yearIndex].topStudents[
                editingTopStudent.studentIndex
              ].group === "Science" ||
                !tempSscData[editingTopStudent.yearIndex].topStudents[
                  editingTopStudent.studentIndex
                ].group) &&
                ["physics", "chemistry", "biology"].map((sub) => (
                  <div key={sub}>
                    <label
                      style={{ ...labelStyle, textTransform: "capitalize" }}
                    >
                      {sub}
                    </label>
                    <input
                      type="number"
                      value={
                        tempSscData[editingTopStudent.yearIndex].topStudents[
                          editingTopStudent.studentIndex
                        ][sub] || ""
                      }
                      onChange={(e) =>
                        handleTopStudentChange(
                          editingTopStudent.yearIndex,
                          editingTopStudent.studentIndex,
                          sub,
                          e.target.value,
                        )
                      }
                      style={inputStyle}
                    />
                  </div>
                ))}
              {tempSscData[editingTopStudent.yearIndex].topStudents[
                editingTopStudent.studentIndex
              ].group === "Arts" &&
                ["history", "civics", "economics"].map((sub) => (
                  <div key={sub}>
                    <label
                      style={{ ...labelStyle, textTransform: "capitalize" }}
                    >
                      {sub}
                    </label>
                    <input
                      type="number"
                      value={
                        tempSscData[editingTopStudent.yearIndex].topStudents[
                          editingTopStudent.studentIndex
                        ][sub] || ""
                      }
                      onChange={(e) =>
                        handleTopStudentChange(
                          editingTopStudent.yearIndex,
                          editingTopStudent.studentIndex,
                          sub,
                          e.target.value,
                        )
                      }
                      style={inputStyle}
                    />
                  </div>
                ))}
              {tempSscData[editingTopStudent.yearIndex].topStudents[
                editingTopStudent.studentIndex
              ].group === "Commerce" &&
                ["accounting", "finance", "businessEnt"].map((sub) => (
                  <div key={sub}>
                    <label
                      style={{
                        ...labelStyle,
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sub === "businessEnt" ? "Bus. Ent." : sub}
                    </label>
                    <input
                      type="number"
                      value={
                        tempSscData[editingTopStudent.yearIndex].topStudents[
                          editingTopStudent.studentIndex
                        ][sub] || ""
                      }
                      onChange={(e) =>
                        handleTopStudentChange(
                          editingTopStudent.yearIndex,
                          editingTopStudent.studentIndex,
                          sub,
                          e.target.value,
                        )
                      }
                      style={inputStyle}
                    />
                  </div>
                ))}
            </div>

            <button
              onClick={() => setEditingTopStudent(null)}
              style={{
                ...saveBtnStyle,
                marginTop: "25px",
                width: "100%",
                padding: "12px",
                fontSize: "16px",
              }}
            >
              Save & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const statBox = {
  flex: 1,
  background: "rgba(255,255,255,0.1)",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  color: "white",
};
const tdStyle = { padding: "15px", border: "none" };
const adminBtnStyle = {
  background: "#2563EB",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};
const saveBtnStyle = {
  background: "#10b981",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};
const cancelBtnStyle = {
  background: "#ef4444",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};
const inputStyle = {
  padding: "10px 15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
  boxSizing: "border-box",
  fontSize: "14px",
  fontFamily: "inherit",
};
const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "bold",
  color: "#555",
  marginBottom: "5px",
};
