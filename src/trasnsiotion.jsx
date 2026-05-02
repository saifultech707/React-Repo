import "./App.css";
export default function Transsition() {
  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#0a0a1a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* ১. ডানে সরানো */}
      <div
        className="box box1"
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateX(400px)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      />

      {/* ২. ঘোরানো */}
      <div
        className="box box2"
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "rotate(180deg)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      />

      {/* ৩. X অক্ষে ঘোরানো */}
      <div
        className="box box3"
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "rotateX(360deg)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      />

      {/* ৪. Y অক্ষে ঘোরানো */}
      <div
        className="box box4"
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "rotateY(360deg)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      />

      {/* ৫. বড় করা */}
      <div
        className="box box5"
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      />

      {/* ৬. X এ বড় করা */}
      <div
        className="box box6"
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scaleX(1.5)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      />
    </div>
  );
}
