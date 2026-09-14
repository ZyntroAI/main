import React, { useState, useEffect } from 'react';

// ==================== CONFIG ====================
const CONFIG = {
  org: "ZyntroAI",
  repo: "pure-agent-dev",
  gistOwner: "zyntromedia",
  driveId: "ca_wVn41Th4HOa1",
  slackEnabled: true,
  outputPath: "output/eisenhower_matrix.html",
  links: {
    dead: "https://github.com/ZyntroAI/ZyntroAI-Project",
    gist: "https://gist.github.com/zyntromedia",
    repoMain: "https://github.com/ZyntroAI/crystalcastleX"
  },
  categories: {
    critical: { label: "สำคัญ+เร่งด่วน", color: "#22c55e" },
    plan: { label: "สำคัญ+ไม่เร่งด่วน", color: "#3b82f6" },
    delegate: { label: "ไม่สำคัญ+เร่งด่วน", color: "#eab308" },
    low: { label: "ไม่สำคัญ+ไม่เร่งด่วน", color: "#6b7280" }
  },
  tools: [
    { id: "fig", name: "Fig AI", icon: "🤖" },
    { id: "notion", name: "Notion", icon: "📝" },
    { id: "clickup", name: "ClickUp", icon: "📋" },
    { id: "slack", name: "Slack", icon: "💬" },
    { id: "github", name: "GitHub", icon: "🐱" },
    { id: "coderabbit", name: "CodeRabbit", icon: "🐰" }
  ]
};

// ==================== DATA ====================
const initialTasks = [
  { id: 1, title: "Hybrid Storage Update", category: "critical", due: "2026-09-15, 09:00", status: "active", desc: "Drive + Gist + Dedup" },
  { id: 2, title: "Fig Template Integration", category: "plan", due: "2026-09-16", status: "active", desc: "Use all templates" },
  { id: 3, title: "Link Status Logging", category: "critical", due: "2026-09-14", status: "done", desc: "Record dead link" },
  { id: 4, title: "CI/CD Cleanup", category: "delegate", due: "2026-09-17", status: "pending", desc: "Remove duplicates" },
  { id: 5, title: "Archive Old Docs", category: "low", due: "2026-09-20", status: "pending", desc: "Clean structure" }
];

// ==================== COMPONENT ====================
export default function TaskOrg() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [slackStatus, setSlackStatus] = useState("synced");
  const [stats, setStats] = useState({});

  useEffect(() => {
    const sorted = [...tasks].sort((a, b) => new Date(a.due) - new Date(b.due));
    setTasks(sorted);
    
    const newStats = {};
    Object.keys(CONFIG.categories).forEach(key => {
      newStats[key] = tasks.filter(t => t.category === key).length;
    });
    setStats(newStats);
  }, [tasks]);

  const updateTask = (id, updates) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const completeTask = (id) => updateTask(id, { status: "done" });
  const sendSlackUpdate = () => { setSlackStatus("sending"); setTimeout(() => setSlackStatus("synced"), 800); };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f8fafc", padding: "1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: "bold" }}>🏢 {CONFIG.org} TaskOrg</h1>
          <p style={{ color: "#94a3b8" }}>Repo: {CONFIG.repo} • Fig AI Powered</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {CONFIG.tools.map(tool => (
            <span key={tool.id} style={{ background: "#1e293b", padding: "0.3rem 0.6rem", borderRadius: "0.5rem", fontSize: "0.85rem" }}>
              {tool.icon} {tool.name}
            </span>
          ))}
        </div>
      </header>

      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #334155", marginBottom: "1rem" }}>
        {[
          { key: "dashboard", label: "📊 Dashboard" },
          { key: "schedule", label: "📅 Schedule" },
          { key: "manage", label: "✏️ จัดการ" },
          { key: "links", label: "🔗 ลิงก์" },
          { key: "templates", label: "📑 เทมเพลต" }
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: "0.6rem 1rem", background: activeTab === tab.key ? "#2563eb" : "transparent",
            border: "none", color: "#fff", borderTopLeftRadius: "0.4rem", borderTopRightRadius: "0.4rem", cursor: "pointer"
          }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <div>
          <h2 style={{ marginBottom: "1rem" }}>📊 สถิติ 4 ส่วน</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
            {Object.entries(CONFIG.categories).map(([key, cat]) => (
              <div key={key} style={{ background: "#1e293b", padding: "1.2rem", borderRadius: "0.6rem", borderLeft: `4px solid ${cat.color}` }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{stats[key] || 0}</div>
                <div style={{ color: "#cbd5e1" }}>{cat.label}</div>
              </div>
            ))}
          </div>
          <h3 style={{ marginBottom: "1rem" }}>📋 รายการงาน</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {tasks.map(task => (
              <div key={task.id} style={{ background: "#1e293b", padding: "1rem", borderRadius: "0.5rem", borderLeft: `3px solid ${CONFIG.categories[task.category].color}`, opacity: task.status === "done" ? 0.6 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><strong>{task.title}</strong><span style={{ color: "#94a3b8" }}>{task.due}</span></div>
                <p style={{ color: "#cbd5e1", margin: "0.3rem 0" }}>{task.desc}</p>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button onClick={() => completeTask(task.id)} style={{ background: "#16a34a", border: "none", padding: "0.3rem 0.7rem", borderRadius: "0.3rem", color: "#fff" }}>✅ เสร็จ</button>
                  <button onClick={() => deleteTask(task.id)} style={{ background: "#dc2626", border: "none", padding: "0.3rem 0.7rem", borderRadius: "0.3rem", color: "#fff" }}>🗑️ ลบ</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "schedule" && (
        <div>
          <h2>📅 กำหนดการ (ใกล้สุดก่อน)</h2>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
            {[...tasks].sort((a,b)=>new Date(a.due)-new Date(b.due)).map((t,i)=>(
              <li key={t.id} style={{ background: "#1e293b", padding: "1rem", borderRadius: "0.5rem" }}>
                <strong>{i+1}. {t.title}</strong><div style={{ color: "#93c5fd" }}>📅 {t.due}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "manage" && (
        <div style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "0.6rem" }}>
          <h2>✏️ จัดการงาน</h2>
          <ul style={{ lineHeight: "2", color: "#e2e8f0" }}>
            <li>✅ แก้ไขชื่อ/รายละเอียด/กำหนดส่ง</li>
            <li>✅ ทำเครื่องหมายว่าเสร็จ</li>
            <li>🗑️ ลบงานที่ไม่ต้องการ/ซ้ำซ้อน</li>
            <li>🧹 กฎ: ซ้ำ → เก็บอันดีที่สุด</li>
          </ul>
        </div>
      )}

      {activeTab === "links" && (
        <div style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "0.6rem" }}>
          <h2>🔗 สถานะลิงก์</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "1rem" }}>
            <div>✅ GitHub Gist: <code>{CONFIG.links.gist}</code></div>
            <div>✅ Main Repo: <code>{CONFIG.links.repoMain}</code></div>
            <div>✅ Drive ID: <code>{CONFIG.driveId}</code></div>
            <div style={{ color: "#f87171" }}>❌ DEAD: <code>{CONFIG.links.dead}</code></div>
          </div>
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#0f172a", borderRadius: "0.5rem" }}>📄 บันทึก: {CONFIG.outputPath}</div>
        </div>
      )}

      {activeTab === "templates" && (
        <div style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "0.6rem" }}>
          <h2>📑 เทมเพลต Fig</h2>
          <p style={{ color: "#94a3b8", marginBottom: "1rem" }}>✅ ใช้ทั้งในงาน + นอกเหนือจากงาน</p>
          <ul style={{ lineHeight: "2" }}>
            <li>✅ หลัก: App / Storage / CI / Report</li>
            <li>➕ เพิ่ม: README / Link Log / Dedup Check / Structure</li>
            <li>🔗 ไม่ซ้ำ • เสริมกัน • สอดคล้องสถาปัตยกรรม</li>
          </ul>
        </div>
      )}

      <footer style={{ marginTop: "2.5rem", paddingTop: "1rem", borderTop: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>🔔 Slack: <span style={{ color: slackStatus === "synced" ? "#22c55e" : "#facc15" }}>{slackStatus === "synced" ? "✅ อัปเดตล่าสุด" : "⏳ กำลังส่ง..."}</span></div>
        <button onClick={sendSlackUpdate} style={{ background: "#a855f7", border: "none", padding: "0.5rem 1rem", borderRadius: "0.4rem", color: "#fff" }}>📤 ส่งสรุป</button>
      </footer>
    </div>
  );
}
