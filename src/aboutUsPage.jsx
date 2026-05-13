

export default function AboutUsPage() {
  // ১০ জন শিক্ষকের ডামি ডাটা
  const teachers = [
    { name: "Ms. Fatema Khatun", sub: "English", edu: "M.A in English, DU", img: "https://i.pravatar.cc/150?u=f1", gender: "mam" },
    { name: "Ms. Sadia Islam", sub: "Science", edu: "M.Sc in Biology, RU", img: "https://i.pravatar.cc/150?u=f2", gender: "mam" },
    { name: "Ms. Rokeya Begum", sub: "Arts", edu: "B.FA, Charukola", img: "https://i.pravatar.cc/150?u=f3", gender: "mam" },
    { name: "Ms. Tania Akter", sub: "Bangla", edu: "M.A in Bangla", img: "https://i.pravatar.cc/150?u=f4", gender: "mam" },
    { name: "Ms. Nasrin Jahan", sub: "Religion", edu: "B.A in Islamic Studies", img: "https://i.pravatar.cc/150?u=f5", gender: "mam" },
    { name: "Mr. Rafiqul Islam", sub: "Mathematics", edu: "M.Sc in Math, BUET", img: "https://i.pravatar.cc/150?u=m1", gender: "sir" },
    { name: "Mr. Ahsan Habib", sub: "Physics", edu: "M.Sc in Physics", img: "https://i.pravatar.cc/150?u=m2", gender: "sir" },
    { name: "Mr. Kamal Hossain", sub: "History", edu: "M.A in History", img: "https://i.pravatar.cc/150?u=m3", gender: "sir" },
    { name: "Mr. Jashim Uddin", sub: "Geography", edu: "B.Sc in Geography", img: "https://i.pravatar.cc/150?u=m4", gender: "sir" },
    { name: "Mr. Sumon Ahmed", sub: "Physical Edu", edu: "B.P.Ed", img: "https://i.pravatar.cc/150?u=m5", gender: "sir" },
  ];

  // সেরা ১০ ছাত্রের ডাটা
  const topStudents = Array.from({ length: 10 }, (_, i) => ({
    name: `Student Name ${i + 1}`,
    pos: i + 1,
    marks: 600 - i * 5,
    year: "2025"
  }));

  return (
    <div style={{ padding: "40px", background: "#fff" }}>
      {/* ১. হেড টিচার সেকশন */}
      <div style={{ textAlign: "center", marginBottom: "60px", background: "#FFF5F3", padding: "40px", borderRadius: "20px" }}>
        <img src="https://i.pravatar.cc/150?u=head" style={{ width: "150px", height: "150px", borderRadius: "50%", border: "5px solid #FE5D37" }} alt="Head Teacher" />
        <h2 style={{ color: "#103741", marginTop: "15px" }}>Mr. Abdur Rahman</h2>
        <p style={{ color: "#FE5D37", fontWeight: "bold" }}>Head Teacher</p>
        <p style={{ maxWidth: "600px", margin: "10px auto", color: "#666" }}>
          "আমাদের লক্ষ্য শিক্ষার্থীদের নৈতিক ও মানসম্মত শিক্ষায় গড়ে তোলা।"
        </p>
      </div>

      {/* ২. শিক্ষকদের তালিকা (Grid) */}
      <h2 style={{ color: "#103741", borderLeft: "5px solid #FE5D37", paddingLeft: "15px", marginBottom: "30px" }}>Our Expert Teachers</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "25px", marginBottom: "60px" }}>
        {teachers.map((t, i) => (
          <div key={i} style={{ background: "#f9f9f9", padding: "20px", borderRadius: "15px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
            <img src={t.img} style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px" }} alt={t.name} />
            <h4 style={{ margin: "5px 0", color: "#103741" }}>{t.name}</h4>
            <p style={{ margin: "0", color: "#FE5D37", fontSize: "14px", fontWeight: "bold" }}>{t.sub}</p>
            <p style={{ margin: "5px 0", color: "#888", fontSize: "12px" }}>{t.edu}</p>
          </div>
        ))}
      </div>

      {/* ৩. অ্যাচিভমেন্ট সেকশন (Class 5 Result) */}
      <div style={{ background: "#103741", color: "#white", padding: "40px", borderRadius: "20px", marginBottom: "60px" }}>
        <h2 style={{ color: "#fff" }}>School Achievements (Class 5)</h2>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
            <div style={statBox}><h3>100%</h3><p>Passing Rate</p></div>
            <div style={statBox}><h3>45</h3><p>GPA 5.00 (2025)</p></div>
            <div style={statBox}><h3>12</h3><p>Scholarships</p></div>
        </div>
      </div>

      {/* ৪. সেরা ১০ ছাত্রের তালিকা */}
      <h2 style={{ color: "#103741", marginBottom: "20px" }}>Top 10 Students (Class 5 - 2025)</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#FE5D37", color: "white", textAlign: "left" }}>
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
  );
}

const statBox = { flex: 1, background: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: "10px", textAlign: "center", color: "white" };
const tdStyle = { padding: "15px" };