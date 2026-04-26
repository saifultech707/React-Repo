export default function DashboardPage() {
  return (
    <div style={{ 
      flex: 1, 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #fff7ed 100%)',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <p style={{ marginTop: '50px', fontSize: '16px', color: '#555' }}>Hi jui!</p>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center', maxWidth: '600px', lineHeight: '1.2', marginTop: '10px' }}>
        What startup are you validating today?
      </h1>
      <p style={{ color: '#666', marginTop: '20px', fontSize: '16px' }}>
        We'll generate the full app structure for you — you can refine it after seeing the preview.
      </p>

      <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '100%', maxWidth: '700px', marginTop: '40px' }}>
        <input 
          type="text" 
          placeholder="Describe tewwwwwwwwwwwwwwwwwwwwwwwwwhe app you want to create..." 
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', padding: '10px 5px', marginBottom: '15px' }} 
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>📱 Mobile App</button>
            <button style={{ background: 'white', color: '#555', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>🌐 Website</button>
            <button style={{ background: 'white', color: '#555', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>💻 Web App</button>
          </div>
          <button style={{ background: '#bae6fd', color: '#0284c7', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>↑</button>
        </div>
      </div>

      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <p style={{ color: '#555', marginBottom: '15px' }}>Not sure where to start? Try one of these:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '600px' }}>
          <Chip icon="📄" text="Reporting Dashboard" />
          <Chip icon="🌱" text="Plant E-Commerce Website" />
          <Chip icon="🚀" text="Onboarding Portal" />
          <Chip icon="📍" text="Restaurant Finder" />
          <Chip icon="🤝" text="Networking App" />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '30px', right: '30px', background: 'white', padding: '12px 20px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
        <span style={{ fontSize: '16px' }}>⏳</span>
        <span style={{ fontWeight: '500', color: '#333' }}>Updating <strong>2</strong> Projects</span>
        <span style={{ marginLeft: '10px' }}>︿</span>
      </div>
    </div>
  );
}

function Chip({ icon, text }) {
  return (
    <button style={{ 
      background: 'white', 
      border: '1px solid #ddd', 
      padding: '8px 16px', 
      borderRadius: '20px', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      color: '#555'
    }}>
      <span>{icon}</span>
      <span>{text}</span>
    </button>
  );
}
