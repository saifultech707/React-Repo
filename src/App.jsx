// import { useState } from "react"; 
// import Dashboard from "./dashboard";
// import DashboardPage from "./DashboardPage";
// import ProjectsPage from "./ProjectsPage";
// import UpdatesPage from "./UpdatesPage";

// function App() {
//   const [inputValue, setinputValue] = useState("");
//   const [nameList, setnameList] = useState(["zahan", "marin"]);
//   const [currentPage, setCurrentPage] = useState("dashboard");

//   const addname = () => {
//     if (inputValue.trim() !== "") {
//       setnameList([...nameList, inputValue]);
//       setinputValue("");
//     }
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h1>Name list builder</h1>
      
//       <input
//         type="text"
//         placeholder="enter a name"
//         value={inputValue}
//         onChange={(e) => setinputValue(e.target.value)}
//         style={{ padding: "8px", marginRight: "10px" }}
//       />

//       {/* ২. onClick প্রপার্টি বাটনের ভেতরে হবে এবং cursor: "pointer" কোটেশনে হবে */}
//       <button 
//         onClick={addname} 
//         style={{ padding: "8px 15px", cursor: "pointer" }}
//       >
//         Add Name
//       </button>

//       {/* ৩. marginTop এর 'T' বড় হাতের হবে (CamelCase) */}
//       <ul style={{ marginTop: "20px" }}>
//         {nameList.map((item, index) => (
//           <li key={index} style={{ marginBottom: "5px" }}>
//             {item}
//           </li>
//         ))}
//       </ul>
//       <Dashboard />
//     </div>
//   );
// }

// export default App;
import Dashboard from "./Dashboard"; // খেয়াল রাখবেন 'D' যেন বড় হাতের হয়

function App() {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Dashboard />
    </div>
  );
}

export default App;