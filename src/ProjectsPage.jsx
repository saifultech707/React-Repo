export default function ProjectsPage() {
  return (
    <div style={{ 
      flex: 1, 
      background: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #fce7f3 100%)',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <p style={{ marginTop: '50px', fontSize: '16px', color: '#555' }}>Hi jui!</p>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center', maxWidth: '600px', lineHeight: '1.2', marginTop: '10px' }}>
        My Projects
      </h1>
      <p style={{ color: '#666', marginTop: '20px', fontSize: '16px' }}>
        Manage and view all your projects here.
      </p>

      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
        width: '100%', 
        maxWidth: '700px', 
        marginTop: '40px',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '10px' }}>No Projects Yet</h2>
        <p style={{ color: '#666', textAlign: 'center' }}>Create your first project to get started!</p>
        <button style={{ 
          background: '#3b82f6', 
          color: 'white', 
          border: 'none', 
          padding: '12px 24px', 
          borderRadius: '8px', 
          cursor: 'pointer', 
          marginTop: '20px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          + New Project
        </button>
      </div>
    </div>
  );
}
