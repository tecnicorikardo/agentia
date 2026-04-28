'use client';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const OWNER_UID = 'avQGpnMx29ZO7NtdRjvUHLEGhAL2';

const s = {
  container: { maxWidth: 900, margin: '0 auto', padding: '24px 16px' },
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, borderBottom: '1px solid #1e293b', paddingBottom: 20 },
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
  row: { display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 },
  badge: (color) => ({ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: color || '#1e293b', color: '#fff', marginBottom: 8 }),
  toast: (show) => ({ position: 'fixed', bottom: 24, right: 24, background: '#22c55e', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, opacity: show ? 1 : 0, transition: 'opacity .3s', pointerEvents: 'none' }),
};

export default function Home() {
  const [tab, setTab] = useState('prompt');
  const [prompt, setPrompt] = useState('');
  const [numero, setNumero] = useState('');
  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const cfgRef = doc(db, 'users', OWNER_UID, 'agent_context', 'config');
      const cfgDoc = await getDoc(cfgRef);
      if (cfgDoc.exists()) {
        const d = cfgDoc.data();
        setPrompt(d.systemPrompt || '');
        setNumero(d.studyNumero || '');
        setTopicos(d.topicos || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function save() {
    setSaving(true);
    try {
      const cfgRef = doc(db, 'users', OWNER_UID, 'agent_context', 'config');
      await setDoc(cfgRef, { systemPrompt: prompt, studyNumero: numero, topicos, updatedAt: new Date().toISOString() }, { merge: true });
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
    setTopicos([...topicos, { num: String(topicos.length + 1).padStart(2, '0'), titulo: '', conceitos: ['', '', ''], revisao: ['', '', ''], teste: [] }]);
  }

  function removeTopico(i) {
    if (!confirm('Remover este tópico?')) return;
    setTopicos(topicos.filter((_, idx) => idx !== i));
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>Carregando...</div>;

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.logo}>🤖</span>
        <div>
          <p style={s.title}>Agentia — Painel Admin</p>
          <p style={s.subtitle}>Configure o comportamento do agente de IA</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {[['prompt', '🧠 Prompt da IA'], ['topicos', '📚 Tópicos de Estudo'], ['config', '⚙️ Configurações']].map(([id, label]) => (
          <button key={id} style={s.tab(tab === id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {/* Tab: Prompt */}
      {tab === 'prompt' && (
        <div style={s.card}>
          <label style={s.label}>System Prompt — Personalidade do Agente</label>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
            Este texto define como o agente se comporta em todas as conversas. Altere para mudar a personalidade, o tom ou o foco do agente.
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
                <span style={s.badge('#6366f1')}>Tópico {t.num || String(i + 1).padStart(2, '0')}/19</span>
                <button style={s.btn('#ef4444')} onClick={() => removeTopico(i)}>🗑 Remover</button>
              </div>

              <label style={s.label}>Título</label>
              <input style={{ ...s.input, marginBottom: 16 }} value={t.titulo || ''} onChange={e => updateTopico(i, 'titulo', e.target.value)} placeholder="Ex: Fundamentos e Manutenção de Hardware" />

              <label style={s.label}>Conceitos Principais (um por linha)</label>
              <textarea
                style={{ ...s.textarea, marginBottom: 16 }}
                value={(t.conceitos || []).join('\n')}
                onChange={e => updateTopico(i, 'conceitos', e.target.value.split('\n'))}
                placeholder="Conceito 1&#10;Conceito 2&#10;Conceito 3"
              />

              <label style={s.label}>Perguntas de Revisão (uma por linha)</label>
              <textarea
                style={s.textarea}
                value={(t.revisao || []).join('\n')}
                onChange={e => updateTopico(i, 'revisao', e.target.value.split('\n'))}
                placeholder="Pergunta 1&#10;Pergunta 2&#10;Pergunta 3"
              />
            </div>
          ))}

          {topicos.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button style={s.btn()} onClick={save} disabled={saving}>
                {saving ? 'Salvando...' : '💾 Salvar Tópicos'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Tab: Configurações */}
      {tab === 'config' && (
        <div style={s.card}>
          <label style={s.label}>Número do WhatsApp (recebe os estudos)</label>
          <input
            style={{ ...s.input, marginBottom: 24 }}
            value={numero}
            onChange={e => setNumero(e.target.value)}
            placeholder="Ex: 5521986925971"
          />

          <label style={s.label}>Informações do Sistema</label>
          <div style={{ background: '#0f172a', borderRadius: 8, padding: 16, fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
            <div>🤖 <strong style={{ color: '#94a3b8' }}>Agente:</strong> Agentia v2.0</div>
            <div>🧠 <strong style={{ color: '#94a3b8' }}>IA:</strong> Groq — Llama 3.3 70B</div>
            <div>📱 <strong style={{ color: '#94a3b8' }}>WhatsApp:</strong> Evolution API v2</div>
            <div>🗄️ <strong style={{ color: '#94a3b8' }}>Banco:</strong> Firebase Firestore</div>
            <div>🚀 <strong style={{ color: '#94a3b8' }}>Deploy:</strong> Railway</div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
              📅 <strong style={{ color: '#94a3b8' }}>Cronograma:</strong> Seg-Sáb | 08h Conteúdo · 10h Revisão · 14h Teste · 20h Revisão Geral
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button style={s.btn()} onClick={save} disabled={saving}>
              {saving ? 'Salvando...' : '💾 Salvar Configurações'}
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      <div style={s.toast(toast)}>✅ Salvo com sucesso!</div>
    </div>
  );
}
