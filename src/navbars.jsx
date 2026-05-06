import { useState } from "react";
import "./navbars.css";
import { useNavigate } from "react-router-dom";

const items = [
  { id: 1, icon: "🏠", label: "Home", path: "/" },
  { id: 2, icon: "👤", label: "Profile", path: "/profile" },
  { id: 3, icon: "💬", label: "Message", path: "/counterCard" },
  { id: 4, icon: "📷", label: "Camera", path: "/updates" },
  { id: 5, icon: "⚙️", label: "Settings", path: "/show" },
  { id: 6, icon: "🔒", label: "Lock", path: "/productcard" },
  { id: 7, icon: "📁", label: "Files", path: "/generadata" },
];
export default function Navbars() {
  const [active, setActive] = useState(1);
  const navigate = useNavigate();

  return (
    // <div
    //   style={{
    //     minHeight: "100vh",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     background: "#06021b",
    //   }}
    // >
    //   <div className="navigation">
    //     {/* গোল indicator — active item এর নিচে যাবে */}

    //     <ul>
    //       <div
    //         className="indicator"
    //         style={{
    //           left: `${(active - 1) * 69}px`,
    //         }}
    //       />
    //       {items.map((item) => (
    //         <li
    //           key={item.id}
    //           className={active === item.id ? "active" : ""}
    //           onClick={() => {
    //             (setActive(item.id), navigate(item.path));
    //           }}
    //         >
    //           <span className="icon">{item.icon}</span>
    //           <span className="label">{item.label}</span>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#06021b",
        padding: "12px 13px",
        width: "100%",
      }}
    >
      <div className="navigation">
        <ul>
          <div
            className="indicator"
            style={{ left: `${(active - 1) * 69}px` }}
          />
          {items.map((items) => (
            <li
              key={items.id}
              className={active === items.id ? "active" : ""}
              onClick={() => {
                setActive(items.id);
                navigate(items.path);
              }}
            >
              <span className="icon">{items.icon}</span>
              <span className="label">{items.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
