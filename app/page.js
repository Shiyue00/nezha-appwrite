export default function Home() {
    return (
        <main style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'system-ui, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀 Nezha Agent</h1>
                <p style={{ opacity: 0.9 }}>Agent is running in background</p>
            </div>
        </main>
    )
}
