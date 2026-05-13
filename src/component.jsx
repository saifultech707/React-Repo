const Component = () => {
  return (
    <div>
      <h1>My Component</h1>
    </div>
  );
};

export default Component;
export const Props = (params) => {
  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e545",
        borderRadius: "12px",
        padding: "15px 20px",
        backgroundColor: "#000000",
      }}
    >
      <h1 style={{ color: "white", fontStyle: "italic" }}>{params.title}</h1>
      <p>{params.age}</p>
    </div>
  );
};
