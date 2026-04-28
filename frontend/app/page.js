'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

// UID autorizado — só você acessa
const ADMIN_EMAIL = 'tecnicorikardo@gmail.com';

const s = {
  container: { maxWidth: 900, margin: '0 auto', padding: '24px 16px' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, borderBottom: '1px solid #1e293b', paddingBottom: 20 },
  logo: { fontSize: 28 },
  title: { fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0 },
  subtitle: { fontSize: 13, color: '#64748b', margin: 0 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: (active) => ({ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: active ? '#6366f1' : '#1e293b', color: active ? '#fff' : '#94a3b8', transition: 'all .2s' }),
  card: { background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  input: { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', outline: 'none' },
  textarea: { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', outline: 'none', resize: 'vertical', minHeight: 120, fontFamily: 'inherit' },
  btn: (color) => ({ padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, background: color || '#6366f1', color: '#fff', transition: 'opacity .2s' }),
  badge: (color) => ({ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: color || '#1e293b', color: '#fff', marginBottom: 8 }),
  toast: (show) => ({ position: 'fixed', bottom: 24, right: 24, background: '#22c55e', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, opacity: show ? 1 : 0, transition: 'opacity .3s', pointerEvents: 'none' }),
  loginBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 24 },
};

// Caminho no Firestore do projeto agentai-5585e
const CONFIG_PATH = 'admin/agentia_config';

export default function Home() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState('prompt');
  const [prompt, setPrompt] = useState('');
  const [numero, setNumero] = useState('');
  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u && u.email === ADMIN_EMAIL) loadData();
    });
    return unsub;
  }, []);

  async function login() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      alert('Erro no login: ' + e.message);
    }
  }

  async function logout() {
    await signOut(auth);
    setPrompt(''); setNumero(''); setTopicos([]);
  }

  async function loadData() {
    setLoading(true);
    try {
      const cfgDoc = await getDoc(doc(db, CONFIG_PATH));
      if (cfgDoc.exists()) {
        const d = cfgDoc.data();
        setPrompt(d.systemPrompt || '');
        setNumero(d.studyNumero || '');
        setTopicos(d.topicos || []);
      }
    } catch (e) {
      console.error('Erro ao carregar:', e.message);
    }
    setLoading(false);
  }

  async function save() {
    setSaving(true);
    try {
      await setDoc(doc(db, CONFIG_PATH), {
        systemPrompt: prompt,
        studyNumero: numero,
        topicos,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      showToast();
    } catch (e) {
      alert('Erro ao salvar: ' + e.message);
    }
    setSaving(false);
  }

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  function updateTopico(i, field, value) {
    const t = [...topicos];
    t[i] = { ...t[i], [field]: value };
    setTopicos(t);
  }

  function addTopico() {
    setTopicos([...topicos, {
      num: String(topicos.length + 1).padStart(2, '0'),
      titulo: '', conceitos: ['', '', ''], revisao: ['', '', ''],
    }]);
  }

  function removeTopico(i) {
    if (!confirm('Remover este tópico?')) return;
    setTopicos(topicos.filter((_, idx) => idx !== i));
  }

  // Loading inicial
  if (authLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
      Carregando...
    </div>
  );

  // Tela de login
  if (!user || user.email !== ADMIN_EMAIL) return (
    <div style={{ ...s.container }}>
      <div style={s.loginBox}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🤖</div>
          <h1 style={{ color: '#f1f5f9', margin: '0 0 8px' }}>Agentia Admin</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Painel de configuração do Agente de IA</p>
        </div>
        {user && user.email !== ADMIN_EMAIL ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444' }}>Acesso negado para {user.email}</p>
            <button style={s.btn('#64748b')} onClick={logout}>Sair</button>
          </div>
        ) : (
          <button style={{ ...s.btn(), padding: '14px 32px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10 }} onClick={login}>
            <span>🔑</span> Entrar com Google
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={s.logo}>🤖</span>
          <div>
            <p style={s.title}>Agentia — Painel Admin</p>
            <p style={s.subtitle}>Configure o comportamento do agente de IA</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>{user.email}</span>
          <button style={s.btn('#334155')} onClick={logout}>Sair</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {[['prompt', '🧠 Prompt da IA'], ['topicos', '📚 Tópicos'], ['config', '⚙️ Config']].map(([id, label]) => (
          <button key={id} style={s.tab(tab === id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {loading ? <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>Carregando dados...</div> : <>

        {/* Tab: Prompt */}
        {tab === 'prompt' && (
          <div style={s.card}>
            <label style={s.label}>System Prompt — Personalidade do Agente</label>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Define como o agente se comporta em todas as conversas. Salve e o agente usa em até 5 minutos.
            </p>
            <textarea
              style={{ ...s.textarea, minHeight: 300 }}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ex: Você é um assistente de vendas da loja X. Responda sempre em português..."
            />
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button style={s.btn()} onClick={save} disabled={saving}>
                {saving ? 'Salvando...' : '💾 Salvar Prompt'}
              </button>
            </div>
          </div>
        )}

        {/* Tab: Tópicos */}
        {tab === 'topicos' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>{topicos.length} tópicos cadastrados</p>
              <button style={s.btn('#10b981')} onClick={addTopico}>+ Novo Tópico</button>
            </div>
            {topicos.map((t, i) => (
              <div key={i} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={s.badge('#6366f1')}>Tópico {t.num || String(i + 1).padStart(2, '0')}</span>
                  <button style={s.btn('#ef4444')} onClick={() => removeTopico(i)}>🗑 Remover</button>
                </div>
                <label style={s.label}>Título</label>
                <input style={{ ...s.input, marginBottom: 16 }} value={t.titulo || ''} onChange={e => updateTopico(i, 'titulo', e.target.value)} placeholder="Ex: Fundamentos de Hardware" />
                <label style={s.label}>Conceitos (um por linha)</label>
                <textarea style={{ ...s.textarea, marginBottom: 16 }} value={(t.conceitos || []).join('\n')} onChange={e => updateTopico(i, 'conceitos', e.target.value.split('\n'))} placeholder="Conceito 1&#10;Conceito 2&#10;Conceito 3" />
                <label style={s.label}>Perguntas de Revisão (uma por linha)</label>
                <textarea style={s.textarea} value={(t.revisao || []).join('\n')} onChange={e => updateTopico(i, 'revisao', e.target.value.split('\n'))} placeholder="Pergunta 1&#10;Pergunta 2&#10;Pergunta 3" />
              </div>
            ))}
            {topicos.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button style={s.btn()} onClick={save} disabled={saving}>{saving ? 'Salvando...' : '💾 Salvar Tópicos'}</button>
              </div>
            )}
          </>
        )}

        {/* Tab: Config */}
        {tab === 'config' && (
          <div style={s.card}>
            <label style={s.label}>Número do WhatsApp (recebe os estudos)</label>
            <input style={{ ...s.input, marginBottom: 24 }} value={numero} onChange={e => setNumero(e.target.value)} placeholder="Ex: 5521986925971" />
            <label style={s.label}>Informações do Sistema</label>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 16, fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
              <div>🤖 <strong style={{ color: '#94a3b8' }}>Agente:</strong> Agentia v2.0</div>
              <div>🧠 <strong style={{ color: '#94a3b8' }}>IA:</strong> Groq — Llama 3.3 70B</div>
              <div>📱 <strong style={{ color: '#94a3b8' }}>WhatsApp:</strong> Evolution API v2</div>
              <div>🗄️ <strong style={{ color: '#94a3b8' }}>Banco:</strong> Firebase Firestore</div>
              <div>🚀 <strong style={{ color: '#94a3b8' }}>Deploy:</strong> Railway</div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
                📅 <strong style={{ color: '#94a3b8' }}>Cronograma:</strong> Seg-Sáb | 08h · 10h · 14h · 20h
              </div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button style={s.btn()} onClick={save} disabled={saving}>{saving ? 'Salvando...' : '💾 Salvar'}</button>
            </div>
          </div>
        )}
      </>}

      <div style={s.toast(toast)}>✅ Salvo com sucesso!</div>
    </div>
  );
}
