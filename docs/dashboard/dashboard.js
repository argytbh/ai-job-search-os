"use strict";

const STATUSES = ["Review", "Pursue", "Hold", "Applied", "Screen", "Assessment", "Interview", "Offer", "Dropped", "Rejected", "Closed"];
const CLOSED = new Set(["Dropped", "Rejected", "Closed"]);
const STATUS_LABELS = {
  Review: "Perlu ditinjau", Pursue: "Mau dilamar", Hold: "Simpan dulu", Applied: "Sudah dilamar",
  Screen: "Screening", Assessment: "Tes / assessment", Interview: "Interview", Offer: "Penawaran",
  Dropped: "Tidak dilanjutkan", Rejected: "Ditolak", Closed: "Selesai"
};
const STATUS_COLORS = {
  Review: "#7a8797", Pursue: "#15a3a3", Hold: "#d79420", Applied: "#3478b8",
  Screen: "#496cc5", Assessment: "#785bb5", Interview: "#9858a3", Offer: "#2f8a64",
  Dropped: "#9a7b62", Rejected: "#bd5966", Closed: "#6e7580"
};

const els = Object.fromEntries([
  "gate", "unsupported", "cloudMode", "googleSheetLink", "workspace", "connectButton", "disconnectButton", "connectionLabel", "pulse",
  "workspaceName", "lastSync", "syncDetail", "ledger", "searchInput", "statusFilter", "refreshButton",
  "appNav", "notice", "board", "tableView", "jobTableBody", "tableSummary", "emptyState", "toast",
  "analyticsMetrics", "analyticsSampleNote", "statusChart", "roleChart", "industryChart", "workChart", "locationChart", "sourceChart", "ageChart",
  "logSearch", "logList", "addJobButton", "exportCsvButton", "jobDialog", "jobForm", "jobDialogTitle", "closeJobDialog", "cancelJobButton",
  "jobId", "jobCompany", "jobRole", "jobStatus", "jobLocation", "jobUrl", "jobDiscovered", "jobApplied", "jobInterview",
  "recruiterName", "recruiterUrl", "jobNextAction", "jobRoleCategory", "jobIndustry", "jobWorkArrangement", "jobEmploymentType", "jobFormError", "saveJobButton"
].map((id) => [id, document.getElementById(id)]));

let workspaceHandle = null;
let tracker = null;
let lastSignature = null;
let pollTimer = null;
let mutationInProgress = false;
let toastTimer = null;
let rememberedHandle = null;
let currentSection = "dashboard";
let editingContactId = null;

try {
  const savedSection = localStorage.getItem("ai-job-search-os-section");
  if (["dashboard", "analytics", "tracker", "logs"].includes(savedSection)) currentSection = savedSection;
} catch {
  currentSection = "dashboard";
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ai-job-search-os-dashboard", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("handles");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("handles", "readonly");
    const request = tx.objectStore("handles").get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

async function dbSet(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("handles", "readwrite");
    tx.objectStore("handles").put(value, key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

async function dbDelete(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("handles", "readwrite");
    tx.objectStore("handles").delete(key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

async function hasPermission(handle, request) {
  const options = { mode: "readwrite" };
  if ((await handle.queryPermission(options)) === "granted") return true;
  return request && (await handle.requestPermission(options)) === "granted";
}

function validateTracker(value) {
  if (!value || value.schema_version !== 1 || !Array.isArray(value.jobs) || !Array.isArray(value.contacts) || !Array.isArray(value.activity)) {
    throw new Error("Format data/tracker.json tidak sesuai dengan AI Job Search OS schema version 1.");
  }
  const seen = new Set();
  value.jobs.forEach((job) => {
    if (!job || typeof job.job_id !== "string" || !job.job_id || typeof job.company !== "string" || !job.company || typeof job.role !== "string" || !job.role || !STATUSES.includes(job.status)) {
      throw new Error("Ada data lowongan yang tidak valid di tracker.");
    }
    if (seen.has(job.job_id)) throw new Error(`Job ID duplikat ditemukan: ${job.job_id}`);
    seen.add(job.job_id);
  });
  return value;
}

function safeGoogleSheetUrl(value) {
  const safeUrl = safeExternalUrl(value);
  if (!safeUrl) return null;
  const parsed = new URL(safeUrl);
  return parsed.hostname === "docs.google.com" && parsed.pathname.startsWith("/spreadsheets/") ? safeUrl : null;
}

async function readTrackerConfig() {
  const dataDir = await workspaceHandle.getDirectoryHandle("data");
  let handle;
  try {
    handle = await dataDir.getFileHandle("tracker.config.json");
  } catch (error) {
    if (error.name === "NotFoundError") return { schema_version: 1, mode: "local_json", google_sheet_url: null, verified_at: null };
    throw error;
  }
  const parsed = JSON.parse(await (await handle.getFile()).text());
  if (!parsed || parsed.schema_version !== 1 || !["local_json", "google_sheets"].includes(parsed.mode)) {
    throw new Error("Konfigurasi tracker tidak valid.");
  }
  if (parsed.mode === "google_sheets" && (!safeGoogleSheetUrl(parsed.google_sheet_url) || !parsed.verified_at)) {
    throw new Error("Konfigurasi Google Sheets belum selesai diverifikasi oleh agent.");
  }
  return parsed;
}

async function resolveTrackerHandle() {
  const dataDir = await workspaceHandle.getDirectoryHandle("data");
  return dataDir.getFileHandle("tracker.json");
}

async function readSnapshot() {
  const handle = await resolveTrackerHandle();
  const file = await handle.getFile();
  const text = await file.text();
  const parsed = validateTracker(JSON.parse(text));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return { handle, file, text, parsed, signature: `${file.lastModified}:${file.size}:${hash}` };
}

function setConnection(kind, label) {
  els.pulse.className = `pulse${kind ? ` ${kind}` : ""}`;
  els.connectionLabel.textContent = label;
}

function showToast(message, error = false) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.className = `toast${error ? " error" : ""}`;
  els.toast.hidden = false;
  toastTimer = setTimeout(() => { els.toast.hidden = true; }, 4200);
}

function showNotice(message) {
  els.notice.textContent = message;
  els.notice.hidden = !message;
}

function formatTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "—" : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function safeExternalUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function isLinkedInUrl(value) {
  const safeUrl = safeExternalUrl(value);
  if (!safeUrl) return false;
  const hostname = new URL(safeUrl).hostname.toLowerCase();
  return hostname === "linkedin.com" || hostname.endsWith(".linkedin.com");
}

function csvCell(value) {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function buildTrackerCsv(sourceTracker) {
  const headers = [
    "Job ID", "Perusahaan", "Posisi", "Status", "Lokasi", "Ditemukan", "Dilamar", "Interview",
    "Nama recruiter", "LinkedIn recruiter", "Link lowongan", "Klasifikasi posisi", "Industri",
    "Sistem kerja", "Jenis pekerjaan", "Langkah berikutnya", "Catatan"
  ];
  const rows = sourceTracker.jobs.map((job) => {
    const contact = sourceTracker.contacts.find((item) => item.job_id === job.job_id && safeExternalUrl(item.profile_url))
      || sourceTracker.contacts.find((item) => item.job_id === job.job_id)
      || null;
    return [
      job.job_id, job.company, job.role, STATUS_LABELS[job.status] || job.status, job.location,
      job.discovered_at, job.applied_at, job.interview_at, contact && contact.name,
      contact && safeExternalUrl(contact.profile_url), safeExternalUrl(job.canonical_url) || safeExternalUrl(job.source_url),
      job.role_category, job.industry, job.work_arrangement, job.employment_type, job.next_action, job.notes
    ];
  });
  return `\uFEFF${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

function exportTrackerCsv() {
  if (!tracker) return showToast("Hubungkan Personal Workspace sebelum export.", true);
  const csv = buildTrackerCsv(tracker);
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `job-tracker-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  showToast(`${tracker.jobs.length} lowongan diexport. File CSV bisa dibuka di Excel.`);
}

function visibleJobs() {
  const query = els.searchInput.value.trim().toLocaleLowerCase("id");
  const filter = els.statusFilter.value;
  return tracker.jobs.filter((job) => {
    if (filter === "active" && CLOSED.has(job.status)) return false;
    if (filter === "closed" && !CLOSED.has(job.status)) return false;
    if (!query) return true;
    return [job.job_id, job.company, job.role, job.location, job.notes, job.next_action]
      .filter(Boolean).some((value) => String(value).toLocaleLowerCase("id").includes(query));
  });
}

function renderLedger() {
  const counts = [
    ["Total", tracker.jobs.length],
    ["Perlu ditinjau", tracker.jobs.filter((j) => j.status === "Review").length],
    ["Mau dilamar", tracker.jobs.filter((j) => j.status === "Pursue").length],
    ["Sudah dilamar", tracker.jobs.filter((j) => j.status === "Applied").length],
    ["Sedang diproses", tracker.jobs.filter((j) => ["Screen", "Assessment", "Interview"].includes(j.status)).length],
    ["Penawaran", tracker.jobs.filter((j) => j.status === "Offer").length]
  ];
  els.ledger.replaceChildren(...counts.map(([label, count]) => {
    const metric = el("div", "metric");
    metric.append(el("span", "", label), el("strong", "", count));
    return metric;
  }));
}

function createStatusSelect(job) {
  const select = el("select", "status-select");
  select.setAttribute("aria-label", `Status ${job.role} di ${job.company}`);
  STATUSES.forEach((status) => {
    const option = el("option", "", STATUS_LABELS[status]);
    option.value = status;
    option.selected = status === job.status;
    select.append(option);
  });
  select.addEventListener("change", async () => {
    const next = select.value;
    select.disabled = true;
    try { await updateJobStatus(job.job_id, next); }
    catch (error) { showToast(error.message || "Status gagal disimpan.", true); await refresh(true); }
    finally { select.disabled = false; }
  });
  return select;
}

function createJobLink(job) {
  const url = safeExternalUrl(job.canonical_url) || safeExternalUrl(job.source_url);
  if (!url) return el("span", "no-link", "—");
  const link = el("a", "job-link", "Lihat lowongan ↗");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  return link;
}

function primaryContact(jobId) {
  return tracker.contacts.find((contact) => contact.job_id === jobId && safeExternalUrl(contact.profile_url))
    || tracker.contacts.find((contact) => contact.job_id === jobId)
    || null;
}

function createRecruiterLink(job) {
  const contact = primaryContact(job.job_id);
  const url = safeExternalUrl(contact && contact.profile_url);
  if (!url) return el("span", "no-link", "—");
  const link = el("a", "job-link", contact.name && contact.name !== "Recruiter" ? contact.name : "LinkedIn ↗");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  return link;
}

function renderCard(job, index) {
  const card = el("article", "job-card");
  card.style.animationDelay = `${Math.min(index * 18, 180)}ms`;
  card.append(el("span", "job-id", job.job_id), el("h3", "", job.role), el("p", "company", job.company));
  const meta = [job.location, job.discovered_at ? `Ditemukan ${formatTime(job.discovered_at)}` : null].filter(Boolean).join(" · ");
  if (meta) card.append(el("p", "meta", meta));
  if (job.next_action) card.append(el("div", "next-action", `Langkah berikutnya: ${job.next_action}`));

  const footer = el("div", "card-footer");
  footer.append(createStatusSelect(job), createJobLink(job));
  card.append(footer);
  return card;
}

function renderTable(jobs) {
  if (!jobs.length) {
    const row = el("tr", "no-results");
    const cell = el("td", "", "Tidak ada lowongan yang cocok dengan pencarian atau filter ini.");
    cell.colSpan = 10;
    row.append(cell);
    els.jobTableBody.replaceChildren(row);
    return;
  }
  const rows = jobs.map((job) => {
    const row = el("tr");
    const company = el("td");
    company.append(el("strong", "table-company", job.company), el("small", "table-job-id", job.job_id));
    const role = el("td", "", job.role);
    const status = el("td");
    status.append(createStatusSelect(job));
    const location = el("td", "", job.location || "—");
    const discovered = el("td", "", job.discovered_at ? formatTime(job.discovered_at) : "—");
    const applied = el("td", "", job.applied_at ? formatTime(job.applied_at) : "—");
    const interview = el("td", "", job.interview_at ? formatTime(job.interview_at) : "—");
    const recruiter = el("td");
    recruiter.append(createRecruiterLink(job));
    const link = el("td");
    link.append(createJobLink(job));
    const actions = el("td");
    const edit = el("button", "row-action", "Edit");
    edit.type = "button";
    edit.addEventListener("click", () => openJobDialog(job.job_id));
    actions.append(edit);
    row.append(company, role, status, location, discovered, applied, interview, recruiter, link, actions);
    return row;
  });
  els.jobTableBody.replaceChildren(...rows);
}

function groupValues(values) {
  const counts = new Map();
  values.forEach((value) => {
    const label = value && String(value).trim() ? String(value).trim() : "Belum diklasifikasikan";
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"));
}

function renderBarChart(container, groups) {
  if (!groups.length) {
    container.replaceChildren(el("p", "chart-empty", "Belum ada data."));
    return;
  }
  const total = groups.reduce((sum, [, count]) => sum + count, 0);
  container.replaceChildren(...groups.slice(0, 8).map(([label, count]) => {
    const row = el("div", "bar-row");
    const heading = el("div", "bar-heading");
    heading.append(el("span", "", label), el("strong", "", `${count} · ${Math.round((count / total) * 100)}%`));
    const track = el("div", "bar-track");
    const fill = el("div", "bar-fill");
    fill.style.width = `${(count / total) * 100}%`;
    track.append(fill);
    row.append(heading, track);
    return row;
  }));
}

function collapseGroups(groups, limit = 4) {
  if (groups.length <= limit) return groups;
  const visible = groups.slice(0, limit - 1);
  const remainder = groups.slice(limit - 1).reduce((sum, [, count]) => sum + count, 0);
  return [...visible, ["Lainnya", remainder]];
}

function renderDonutChart(container, groups) {
  if (!groups.length) {
    container.replaceChildren(el("p", "chart-empty", "Belum ada data."));
    return;
  }
  const data = collapseGroups(groups, 5);
  const total = data.reduce((sum, [, count]) => sum + count, 0);
  const colors = ["#173a5e", "#15a3a3", "#d79420", "#785bb5", "#9aa5b2"];
  let cursor = 0;
  const segments = data.map(([, count], index) => {
    const start = cursor;
    cursor += (count / total) * 100;
    return `${colors[index]} ${start}% ${cursor}%`;
  });
  const graphic = el("div", "donut-graphic");
  graphic.style.background = `conic-gradient(${segments.join(", ")})`;
  const center = el("div", "donut-center");
  center.append(el("strong", "", total), el("span", "", "lowongan"));
  graphic.append(center);
  const legend = el("div", "donut-legend");
  data.forEach(([label, count], index) => {
    const item = el("div", "donut-legend-item");
    const labelWrap = el("span", "donut-label");
    const swatch = el("i", "");
    swatch.style.background = colors[index];
    labelWrap.append(swatch, document.createTextNode(label));
    item.append(labelWrap, el("strong", "", `${count} · ${Math.round((count / total) * 100)}%`));
    legend.append(item);
  });
  container.replaceChildren(graphic, legend);
}

function sourceName(job) {
  if (job.source_name) return job.source_name;
  const value = safeExternalUrl(job.source_url) || safeExternalUrl(job.canonical_url);
  if (!value) return null;
  try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return null; }
}

function renderAnalytics() {
  const active = tracker.jobs.filter((job) => !CLOSED.has(job.status)).length;
  const applied = tracker.jobs.filter((job) => job.applied_at || ["Applied", "Screen", "Assessment", "Interview", "Offer"].includes(job.status)).length;
  const inProcess = tracker.jobs.filter((job) => ["Screen", "Assessment", "Interview"].includes(job.status)).length;
  const metrics = [
    ["Total lowongan", tracker.jobs.length], ["Masih aktif", active], ["Pernah dilamar", applied],
    ["Sedang diproses", inProcess], ["Penawaran", tracker.jobs.filter((job) => job.status === "Offer").length],
    ["Kontak", tracker.contacts.length]
  ];
  els.analyticsMetrics.replaceChildren(...metrics.map(([label, value]) => {
    const metric = el("div", "analytics-metric");
    metric.append(el("strong", "", value), el("span", "", label));
    return metric;
  }));
  if (tracker.jobs.length < 10) {
    els.analyticsSampleNote.textContent = `Data masih sedikit (${tracker.jobs.length} lowongan). Gunakan Analytics sebagai gambaran awal, bukan pola yang sudah pasti.`;
    els.analyticsSampleNote.hidden = false;
  } else {
    els.analyticsSampleNote.hidden = true;
  }
  const phase = (job) => {
    if (["Review", "Hold"].includes(job.status)) return "Belum diputuskan";
    if (job.status === "Pursue") return "Mau dilamar";
    if (["Applied", "Screen", "Assessment", "Interview", "Offer"].includes(job.status)) return "Dalam proses";
    return "Selesai";
  };
  renderDonutChart(els.statusChart, groupValues(tracker.jobs.map(phase)));
  renderBarChart(els.roleChart, groupValues(tracker.jobs.map((job) => job.role_category)));
  renderBarChart(els.industryChart, groupValues(tracker.jobs.map((job) => job.industry)));
  renderDonutChart(els.workChart, groupValues(tracker.jobs.map((job) => job.work_arrangement)));
  renderBarChart(els.locationChart, groupValues(tracker.jobs.map((job) => job.location)));
  renderBarChart(els.sourceChart, groupValues(tracker.jobs.map(sourceName)));
  const now = Date.now();
  const activeAge = tracker.jobs.filter((job) => !CLOSED.has(job.status)).map((job) => {
    if (!job.discovered_at || Number.isNaN(new Date(job.discovered_at).valueOf())) return "Tanggal belum dicatat";
    const days = Math.max(0, Math.floor((now - new Date(job.discovered_at).valueOf()) / 86400000));
    if (days <= 7) return "0–7 hari";
    if (days <= 14) return "8–14 hari";
    if (days <= 30) return "15–30 hari";
    return "Lebih dari 30 hari";
  });
  const ageOrder = ["0–7 hari", "8–14 hari", "15–30 hari", "Lebih dari 30 hari", "Tanggal belum dicatat"];
  const ageCounts = new Map(groupValues(activeAge));
  renderBarChart(els.ageChart, ageOrder.filter((label) => ageCounts.has(label)).map((label) => [label, ageCounts.get(label)]));
}

function activityTypeLabel(type) {
  const labels = {
    status_changed: "Status diubah", discovered: "Lowongan ditemukan", applied: "Lamaran dikirim",
    contact_added: "Kontak ditambahkan", interview: "Interview", note: "Catatan",
    job_added: "Lowongan ditambahkan", job_edited: "Lowongan diperbarui"
  };
  return labels[type] || String(type || "Aktivitas").replaceAll("_", " ");
}

function renderLogs() {
  const query = els.logSearch.value.trim().toLocaleLowerCase("id");
  const activities = [...tracker.activity].sort((a, b) => String(b.at || "").localeCompare(String(a.at || ""))).filter((item) => {
    if (!query) return true;
    return [item.activity_id, item.job_id, item.type, item.summary].filter(Boolean)
      .some((value) => String(value).toLocaleLowerCase("id").includes(query));
  });
  if (!activities.length) {
    els.logList.replaceChildren(el("div", "log-empty", tracker.activity.length ? "Tidak ada aktivitas yang cocok." : "Belum ada aktivitas di tracker."));
    return;
  }
  els.logList.replaceChildren(...activities.map((item) => {
    const row = el("article", "log-item");
    const marker = el("span", "log-marker");
    const content = el("div", "log-content");
    const head = el("div", "log-head");
    head.append(el("strong", "", activityTypeLabel(item.type)), el("time", "", formatTime(item.at)));
    content.append(head, el("p", "", item.summary || "Tanpa keterangan."), el("small", "", [item.job_id, item.activity_id].filter(Boolean).join(" · ")));
    row.append(marker, content);
    return row;
  }));
}

function showSection(section) {
  currentSection = section;
  document.querySelectorAll("[data-section-panel]").forEach((panel) => { panel.hidden = panel.dataset.sectionPanel !== section; });
  document.querySelectorAll("[data-section]").forEach((button) => {
    const active = button.dataset.section === section;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  try { localStorage.setItem("ai-job-search-os-section", section); } catch { /* Preference remains session-only. */ }
}

function render() {
  renderLedger();
  els.lastSync.textContent = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
  els.syncDetail.textContent = tracker.updated_at ? `Tracker ${formatTime(tracker.updated_at)}` : "Tracker belum pernah diubah";
  const jobs = visibleJobs();
  els.emptyState.hidden = tracker.jobs.length !== 0;
  const columns = STATUSES.map((status) => {
    const column = el("section", "column");
    column.style.setProperty("--status-color", STATUS_COLORS[status]);
    const matching = jobs.filter((job) => job.status === status);
    const head = el("div", "column-head");
    head.append(el("h2", "", STATUS_LABELS[status]), el("span", "", matching.length));
    const list = el("div", "card-list");
    if (matching.length) matching.forEach((job, index) => list.append(renderCard(job, index)));
    else list.append(el("div", "empty-column", "Belum ada"));
    column.append(head, list);
    return column;
  });
  els.board.replaceChildren(...columns);
  renderTable(jobs);
  els.tableSummary.textContent = `${jobs.length} dari ${tracker.jobs.length} lowongan ditampilkan`;
  renderAnalytics();
  renderLogs();
}

async function refresh(force = false) {
  if (!workspaceHandle || mutationInProgress || document.hidden) return;
  try {
    const snapshot = await readSnapshot();
    if (force || snapshot.signature !== lastSignature) {
      tracker = snapshot.parsed;
      lastSignature = snapshot.signature;
      render();
    }
    setConnection("live", "Terhubung · diperbarui otomatis");
    showNotice("");
  } catch (error) {
    setConnection("error", "Tracker perlu diperiksa");
    showNotice(error.message || "Tracker tidak dapat dibaca.");
  }
}

function activityId(now) {
  return `ACT-${now.replace(/[-:.TZ]/g, "").slice(0, 14)}-${crypto.getRandomValues(new Uint16Array(1))[0].toString(16).padStart(4, "0")}`;
}

async function persistTrackerChange(change, verify) {
  mutationInProgress = true;
  setConnection("", "Menyimpan perubahan…");
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const snapshot = await readSnapshot();
      const nextTracker = structuredClone(snapshot.parsed);
      const result = change(nextTracker);
      if (result && result.noop) return result;
      validateTracker(nextTracker);

      const current = await readSnapshot();
      if (current.signature !== snapshot.signature) continue;

      let writable;
      try { writable = await current.handle.createWritable({ mode: "exclusive" }); }
      catch (error) {
        if (error instanceof TypeError || error.name === "NotSupportedError") writable = await current.handle.createWritable();
        else throw error;
      }
      await writable.write(`${JSON.stringify(nextTracker, null, 2)}\n`);
      await writable.close();
      const verified = await readSnapshot();
      if (verify && !verify(verified.parsed, result)) throw new Error("Data yang dibaca kembali tidak cocok. Muat ulang tracker sebelum mencoba lagi.");
      tracker = verified.parsed;
      lastSignature = verified.signature;
      render();
      return result;
    }
    throw new Error("Tracker sedang diubah oleh agent. Tunggu sebentar lalu coba lagi.");
  } finally {
    mutationInProgress = false;
    setConnection("live", "Terhubung · diperbarui otomatis");
  }
}

async function updateJobStatus(jobId, nextStatus) {
  if (!STATUSES.includes(nextStatus)) throw new Error("Status tidak dikenali.");
  const result = await persistTrackerChange((nextTracker) => {
    const job = nextTracker.jobs.find((item) => item.job_id === jobId);
    if (!job) throw new Error("Lowongan sudah tidak ada. Dashboard akan memuat tracker terbaru.");
    const previous = job.status;
    if (previous === nextStatus) return { noop: true };
    const now = new Date().toISOString();
    job.status = nextStatus;
    if (nextStatus === "Applied" && !job.applied_at) job.applied_at = now;
    if (nextStatus === "Interview" && !job.interview_at) job.interview_at = now;
    nextTracker.updated_at = now;
    nextTracker.activity.push({
      activity_id: activityId(now), job_id: jobId, at: now, type: "status_changed",
      summary: `Status diubah oleh user melalui dashboard: ${previous} → ${nextStatus}`
    });
    return { jobId, nextStatus, interviewAt: job.interview_at || null };
  }, (savedTracker, saved) => savedTracker.jobs.some((job) => job.job_id === jobId && job.status === nextStatus && (job.interview_at || null) === saved.interviewAt));
  if (!result.noop) showToast(`Status ${jobId} diubah menjadi ${STATUS_LABELS[nextStatus]}.`);
}

function dateInputValue(value, withTime = false) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "";
  const local = new Date(date.valueOf() - date.getTimezoneOffset() * 60000).toISOString();
  return withTime ? local.slice(0, 16) : local.slice(0, 10);
}

function dateInputIso(value, withTime = false) {
  if (!value) return null;
  const date = new Date(withTime ? value : `${value}T12:00:00`);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
}

function nextRecordId(prefix, records, field) {
  const max = records.reduce((highest, record) => {
    const match = String(record[field] || "").match(new RegExp(`^${prefix}-(\\d+)$`));
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

function setFormError(message) {
  els.jobFormError.textContent = message || "";
  els.jobFormError.hidden = !message;
}

function openJobDialog(jobId = null) {
  const job = jobId ? tracker.jobs.find((item) => item.job_id === jobId) : null;
  const contact = job ? primaryContact(job.job_id) : null;
  editingContactId = contact ? contact.contact_id : null;
  els.jobForm.reset();
  setFormError("");
  els.jobDialogTitle.textContent = job ? "Edit lowongan" : "Tambah lowongan";
  els.jobId.value = job ? job.job_id : "";
  els.jobCompany.value = job ? job.company : "";
  els.jobRole.value = job ? job.role : "";
  els.jobStatus.value = job ? job.status : "Review";
  els.jobLocation.value = job && job.location ? job.location : "";
  els.jobUrl.value = job ? (safeExternalUrl(job.canonical_url) || safeExternalUrl(job.source_url) || "") : "";
  els.jobDiscovered.value = job ? dateInputValue(job.discovered_at) : dateInputValue(new Date().toISOString());
  els.jobApplied.value = job ? dateInputValue(job.applied_at) : "";
  els.jobInterview.value = job ? dateInputValue(job.interview_at, true) : "";
  els.recruiterName.value = contact && contact.name !== "Recruiter" ? contact.name : "";
  els.recruiterUrl.value = contact && safeExternalUrl(contact.profile_url) ? contact.profile_url : "";
  els.jobNextAction.value = job && job.next_action ? job.next_action : "";
  els.jobRoleCategory.value = job && job.role_category ? job.role_category : "";
  els.jobIndustry.value = job && job.industry ? job.industry : "";
  els.jobWorkArrangement.value = job && job.work_arrangement ? job.work_arrangement : "";
  els.jobEmploymentType.value = job && job.employment_type ? job.employment_type : "";
  els.jobDialog.showModal();
  els.jobCompany.focus();
}

function closeJobDialog() {
  if (els.jobDialog.open) els.jobDialog.close();
}

async function saveJob(event) {
  event.preventDefault();
  setFormError("");
  const values = {
    jobId: els.jobId.value,
    company: els.jobCompany.value.trim(), role: els.jobRole.value.trim(), status: els.jobStatus.value,
    location: els.jobLocation.value.trim(), url: els.jobUrl.value.trim(), discoveredAt: dateInputIso(els.jobDiscovered.value),
    appliedAt: dateInputIso(els.jobApplied.value), interviewAt: dateInputIso(els.jobInterview.value, true),
    recruiterName: els.recruiterName.value.trim(), recruiterUrl: els.recruiterUrl.value.trim(), nextAction: els.jobNextAction.value.trim(),
    roleCategory: els.jobRoleCategory.value.trim(), industry: els.jobIndustry.value.trim(),
    workArrangement: els.jobWorkArrangement.value.trim(), employmentType: els.jobEmploymentType.value.trim()
  };
  if (!values.company || !values.role) return setFormError("Perusahaan dan posisi wajib diisi.");
  if (!STATUSES.includes(values.status)) return setFormError("Status tidak dikenali.");
  if (values.url && !safeExternalUrl(values.url)) return setFormError("Link lowongan harus diawali http:// atau https://.");
  if (values.recruiterUrl && !isLinkedInUrl(values.recruiterUrl)) return setFormError("Masukkan link profil recruiter dari LinkedIn.");
  els.saveJobButton.disabled = true;
  try {
    const result = await persistTrackerChange((nextTracker) => {
      const now = new Date().toISOString();
      let job = values.jobId ? nextTracker.jobs.find((item) => item.job_id === values.jobId) : null;
      if (values.jobId && !job) throw new Error("Lowongan sudah tidak ada. Tutup form lalu muat ulang tracker.");
      const duplicate = nextTracker.jobs.find((item) => item.job_id !== values.jobId && (
        (values.url && [item.canonical_url, item.source_url].filter(Boolean).includes(values.url)) ||
        [item.company, item.role, item.location || ""].map((value) => String(value).trim().toLocaleLowerCase("id")).join("|") ===
        [values.company, values.role, values.location].map((value) => value.toLocaleLowerCase("id")).join("|")
      ));
      if (duplicate) throw new Error(`Lowongan serupa sudah ada sebagai ${duplicate.job_id}.`);
      const isNew = !job;
      if (isNew) {
        job = { job_id: nextRecordId("JOB", nextTracker.jobs, "job_id") };
        nextTracker.jobs.push(job);
      }
      const interviewAt = values.status === "Interview" && !values.interviewAt ? now : values.interviewAt;
      Object.assign(job, {
        company: values.company, role: values.role, status: values.status, location: values.location || null,
        canonical_url: values.url || null, source_url: values.url || null,
        source_name: values.url ? new URL(values.url).hostname.replace(/^www\./, "") : null,
        discovered_at: values.discoveredAt, applied_at: values.appliedAt,
        interview_at: interviewAt, next_action: values.nextAction || null,
        role_category: values.roleCategory || null, industry: values.industry || null,
        work_arrangement: values.workArrangement || null, employment_type: values.employmentType || null
      });
      let contact = editingContactId ? nextTracker.contacts.find((item) => item.contact_id === editingContactId) : null;
      if (!contact && (values.recruiterName || values.recruiterUrl)) {
        contact = { contact_id: nextRecordId("CONTACT", nextTracker.contacts, "contact_id"), job_id: job.job_id, confidence: null, notes: "Ditambahkan manual melalui dashboard." };
        nextTracker.contacts.push(contact);
      }
      if (contact) {
        contact.name = values.recruiterName || contact.name || "Recruiter";
        contact.profile_url = values.recruiterUrl || null;
      }
      nextTracker.updated_at = now;
      nextTracker.activity.push({
        activity_id: activityId(now), job_id: job.job_id, at: now, type: isNew ? "job_added" : "job_edited",
        summary: isNew ? `Lowongan ${values.role} di ${values.company} ditambahkan manual melalui dashboard.` : `Data lowongan ${job.job_id} diperbarui manual melalui dashboard.`
      });
      return { jobId: job.job_id, isNew };
    }, (savedTracker, result) => savedTracker.jobs.some((job) => job.job_id === result.jobId && job.company === values.company && job.role === values.role));
    closeJobDialog();
    showToast(result.isNew ? `${result.jobId} ditambahkan ke tracker.` : `${result.jobId} berhasil diperbarui.`);
  } catch (error) {
    setFormError(error.message || "Lowongan gagal disimpan.");
  } finally {
    els.saveJobButton.disabled = false;
  }
}

async function activate(handle, requestPermission) {
  if (!(await hasPermission(handle, requestPermission))) return false;
  workspaceHandle = handle;
  let config;
  let snapshot = null;
  try {
    config = await readTrackerConfig();
    if (config.mode === "local_json") snapshot = await readSnapshot();
  } catch (error) {
    workspaceHandle = null;
    throw new Error(`Folder ini bukan Personal Workspace yang valid. ${error.message}`);
  }
  await dbSet("workspace", handle);
  els.gate.hidden = true;
  els.unsupported.hidden = true;
  els.disconnectButton.hidden = false;
  document.body.classList.add("connected");
  clearInterval(pollTimer);
  if (config.mode === "google_sheets") {
    tracker = null;
    lastSignature = null;
    els.workspace.hidden = true;
    els.cloudMode.hidden = false;
    els.appNav.hidden = true;
    els.googleSheetLink.href = safeGoogleSheetUrl(config.google_sheet_url);
    setConnection("live", "Tracker · Google Sheets");
    return true;
  }
  tracker = snapshot.parsed;
  lastSignature = snapshot.signature;
  els.workspaceName.textContent = handle.name || "Personal Workspace";
  els.cloudMode.hidden = true;
  els.workspace.hidden = false;
  els.appNav.hidden = false;
  render();
  showSection(currentSection);
  setConnection("live", "Terhubung · diperbarui otomatis");
  showNotice("");
  pollTimer = setInterval(() => refresh(false), 1500);
  return true;
}

async function connect() {
  try {
    if (rememberedHandle && await activate(rememberedHandle, true)) {
      rememberedHandle = null;
      return;
    }
    const handle = await window.showDirectoryPicker({ id: "ai-job-search-workspace", mode: "readwrite", startIn: "documents" });
    await activate(handle, true);
  } catch (error) {
    if (error.name !== "AbortError") showToast(error.message || "Folder tidak dapat dibuka.", true);
  }
}

async function disconnect() {
  clearInterval(pollTimer);
  workspaceHandle = null;
  tracker = null;
  lastSignature = null;
  await dbDelete("workspace");
  els.workspace.hidden = true;
  els.cloudMode.hidden = true;
  els.gate.hidden = false;
  els.disconnectButton.hidden = true;
  els.appNav.hidden = true;
  document.body.classList.remove("connected");
  els.connectButton.textContent = "Pilih folder workspace";
  rememberedHandle = null;
  setConnection("", "Belum terhubung");
}

async function init() {
  if (!window.isSecureContext || !("showDirectoryPicker" in window)) {
    els.gate.hidden = true;
    els.unsupported.hidden = false;
    return;
  }
  els.connectButton.addEventListener("click", connect);
  els.disconnectButton.addEventListener("click", disconnect);
  els.refreshButton.addEventListener("click", () => refresh(true));
  STATUSES.forEach((status) => {
    const option = el("option", "", STATUS_LABELS[status]);
    option.value = status;
    els.jobStatus.append(option);
  });
  els.addJobButton.addEventListener("click", () => openJobDialog());
  els.exportCsvButton.addEventListener("click", exportTrackerCsv);
  els.closeJobDialog.addEventListener("click", closeJobDialog);
  els.cancelJobButton.addEventListener("click", closeJobDialog);
  els.jobForm.addEventListener("submit", saveJob);
  els.jobDialog.addEventListener("click", (event) => { if (event.target === els.jobDialog) closeJobDialog(); });
  document.querySelectorAll("[data-section]").forEach((button) => button.addEventListener("click", () => showSection(button.dataset.section)));
  els.searchInput.addEventListener("input", () => tracker && render());
  els.statusFilter.addEventListener("change", () => tracker && render());
  els.logSearch.addEventListener("input", () => tracker && renderLogs());
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(true); });
  try {
    const remembered = await dbGet("workspace");
    if (remembered && await activate(remembered, false)) return;
    if (remembered) {
      rememberedHandle = remembered;
      els.connectButton.textContent = "Hubungkan kembali folder terakhir";
    }
  } catch (error) {
    console.warn("Folder terakhir tidak dapat dipulihkan", error);
  }
}

init();
