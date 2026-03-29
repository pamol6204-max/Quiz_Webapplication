/* ═══════════════════════════════════════════════════════════════
   QuizAdmin – admin-script.js
   Works with the same localStorage keys used by quiz app:
     "user"        → registered users array
     "userTest"    → all test submissions
     "Quizes"      → questions array
   Admin credentials stored under "adminUser"
═══════════════════════════════════════════════════════════════ */

// ─── Default admin credentials ───────────────────────────────
const ADMIN_EMAIL    = "admin@quiz.com";
const ADMIN_PASSWORD = "admin1234";

// ─── Default questions (same as script.js) ───────────────────
const DEFAULT_QUESTIONS = [
  { question: " What is the correct syntax to output 'Hello, World!' in JavaScript?", answer: "console.log('Hello, World!')", options: ["print('Hello, World!');","console.log('Hello, World!')","echo('Hello, World!');","document.write('Hello, World!');"] },
  { question: "Which operator is used to compare both value and type in JavaScript?", answer: "===", options: ["==","!=","===","!=="] },
  { question: "How do you declare a variable in JavaScript?", answer: "var x;", options: ["var x;","variable x;","int x;","declare x;"] },
  { question: "What will the following code output? console.log(2 + '2');", answer: "22", options: ["4","22","Error","2.2"] },
  { question: "Which method is used to add a new element to the end of an array?", answer: "push()", options: ["push()","pop()","shift()","unshift()"] },
  { question: "What is the purpose of the 'this' keyword in JavaScript?", answer: "It refers to the object from which the function was called.", options: ["It refers to the global object.","It refers to the object from which the function was called.","It refers to the parent object.","It refers to the function itself."] },
  { question: "Which method is used to remove the last element from an array?", answer: "pop()", options: ["pop()","push()","splice()","shift()"] },
  { question: "How can you create a function in JavaScript?", answer: "function myFunction() {}", options: ["function myFunction() {}","create function myFunction() {}","function: myFunction() {}","myFunction() = function() {}"] },
  { question: "What is the output of 'console.log(typeof NaN);'", answer: "number", options: ["number","NaN","undefined","object"] },
  { question: "How can you convert a string to an integer in JavaScript?", answer: "parseInt()", options: ["parseInt()","parseFloat()","toInteger()","convertToInt()"] },
];

// ─── Admin Auth Guard ─────────────────────────────────────────
function checkAdminAuth() {
  const adminLoggedIn = JSON.parse(sessionStorage.getItem("adminLoggedIn") || "null");
  if (!adminLoggedIn) {
    // Show a simple login prompt
    document.body.innerHTML = buildLoginPage();
    return false;
  }
  return true;
}

function buildLoginPage() {
  return `
  <style>
    body { display:flex; align-items:center; justify-content:center; min-height:100vh; background:var(--dark); }
    .login-box { background:var(--card); border:1px solid var(--border); border-radius:20px; padding:48px 40px; width:400px; max-width:95vw; }
    .login-logo { width:52px;height:52px;background:var(--gold);border-radius:14px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:24px;color:#12111A;margin:0 auto 20px; }
    .login-title { font-family:'Syne',sans-serif;font-size:24px;font-weight:800;text-align:center;margin-bottom:6px; }
    .login-sub { text-align:center;color:var(--muted);font-size:14px;margin-bottom:32px; }
    .login-err { background:rgba(255,92,108,0.1);border:1px solid rgba(255,92,108,0.3);color:var(--red);padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;display:none; }
  </style>
  <div class="login-box">
    <div class="login-logo">Q</div>
    <div class="login-title">Admin Login</div>
    <div class="login-sub">Sign in to manage the quiz application</div>
    <div class="login-err" id="login-err">Invalid credentials. Try admin@quiz.com / admin1234</div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input class="form-control" type="email" id="a-email" placeholder="admin@quiz.com" value="admin@quiz.com">
    </div>
    <div class="form-group">
      <label class="form-label">Password</label>
      <input class="form-control" type="password" id="a-pass" placeholder="••••••••" value="admin1234">
    </div>
    <button class="btn btn-primary" style="width:100%;justify-content:center;padding:12px;" onclick="doAdminLogin()">
      <i class="fa-solid fa-right-to-bracket"></i> Sign In
    </button>
  </div>`;
}

function doAdminLogin() {
  const email = document.getElementById("a-email").value.trim();
  const pass  = document.getElementById("a-pass").value;
  const err   = document.getElementById("login-err");
  if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
    sessionStorage.setItem("adminLoggedIn", JSON.stringify({ email }));
    location.reload();
  } else {
    err.style.display = "block";
  }
}

function adminLogout() {
  sessionStorage.removeItem("adminLoggedIn");
  location.reload();
}

// ─── Data Helpers ─────────────────────────────────────────────
function getQuestions() {
  const saved = localStorage.getItem("Quizes");
  if (saved) {
    return JSON.parse(saved);
  }
  // First time only — seed the defaults
  saveQuestions(DEFAULT_QUESTIONS);
  return DEFAULT_QUESTIONS;
}

function saveQuestions(arr) {
  localStorage.setItem("Quizes", JSON.stringify(arr));
}

function getUsers() {
  return JSON.parse(localStorage.getItem("user") || "[]");
}

function getTests() {
  return JSON.parse(localStorage.getItem("userTest") || "[]");
}

// ─── Delete tracking ──────────────────────────────────────────
let pendingDeleteIndex = -1;

// ─── Page Navigation ──────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  const page = document.getElementById("page-" + name);
  if (page) page.classList.add("active");

  // Highlight nav item
  document.querySelectorAll(".nav-item").forEach(n => {
    if (n.getAttribute("onclick") && n.getAttribute("onclick").includes(`'${name}'`)) {
      n.classList.add("active");
    }
  });

  // Render page
  switch (name) {
    case "dashboard":   renderDashboard();   break;
    case "questions":   renderQuestions();   break;
    case "users":       renderUsers();       break;
    case "results":     renderResults();     break;
    case "leaderboard": renderLeaderboard(); break;
  }
}

// ─── Dashboard ────────────────────────────────────────────────
function renderDashboard() {
  const users     = getUsers();
  const questions = getQuestions();
  const tests     = getTests();

  document.getElementById("stat-total-users").textContent     = users.length;
  document.getElementById("stat-total-questions").textContent = questions.length;
  document.getElementById("stat-total-tests").textContent     = tests.length;

  const avgScore = tests.length
    ? Math.round(tests.reduce((s, t) => s + t.score, 0) / tests.length)
    : 0;
  document.getElementById("stat-avg-score").textContent = avgScore;

  // Recent tests table (latest 10)
  const tbody = document.getElementById("recent-tests-tbody");
  const recent = [...tests].slice(0, 10);

  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No tests submitted yet</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = recent.map((t, i) => {
    const pct = Math.round((t.score / 100) * 100);
    return `<tr>
      <td>${i + 1}</td>
      <td>
        <div class="user-chip">
          <div class="chip-avatar">${(t.name || "?").charAt(0).toUpperCase()}</div>
          <div>
            <div class="chip-name">${esc(t.name)}</div>
            <div class="chip-email">${esc(t.email)}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${t.score >= 70 ? 'badge-green' : t.score >= 40 ? 'badge-gold' : 'badge-red'}">${t.score}/100</span></td>
      <td>
        <div style="width:140px;">
          <div style="font-size:12px;color:var(--muted);margin-bottom:4px;">${pct}%</div>
          <div class="score-bar-wrap"><div class="score-bar" style="width:${pct}%"></div></div>
        </div>
      </td>
      <td style="color:var(--muted);font-size:13px;">${esc(t.date || "—")}</td>
    </tr>`;
  }).join("");
}

// ─── Questions ────────────────────────────────────────────────
let allQuestions = [];

function renderQuestions(filter = "") {
  allQuestions = getQuestions();
  const tbody = document.getElementById("questions-tbody");
  const list  = filter
    ? allQuestions.filter(q => q.question.toLowerCase().includes(filter.toLowerCase()))
    : allQuestions;

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><i class="fa-solid fa-circle-question"></i><p>No questions found</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((q, i) => {
    const realIdx = allQuestions.indexOf(q);
    return `<tr>
      <td style="color:var(--muted);font-size:13px;">${realIdx + 1}</td>
      <td style="max-width:400px;">
        <div style="font-size:14px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(q.question)}</div>
      </td>
      <td><span class="badge badge-green">${esc(q.answer)}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-info btn-sm" onclick="viewQuestion(${realIdx})"><i class="fa-solid fa-eye"></i></button>
          <button class="btn btn-success btn-sm" onclick="openEditModal(${realIdx})"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-danger btn-sm" onclick="askDelete(${realIdx})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join("");
}

function filterQuestions() {
  renderQuestions(document.getElementById("q-search").value);
}

// ─── Add / Edit Question ──────────────────────────────────────
function openAddModal() {
  document.getElementById("modal-title").textContent = "Add Question";
  document.getElementById("edit-index").value = "-1";
  document.getElementById("q-text").value = "";
  ["opt-1","opt-2","opt-3","opt-4"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("correct-ans").value = "";
  openModal("question-modal");
}

function openEditModal(idx) {
  const q = getQuestions()[idx];
  document.getElementById("modal-title").textContent = "Edit Question";
  document.getElementById("edit-index").value = idx;
  document.getElementById("q-text").value = q.question;
  document.getElementById("opt-1").value  = q.options[0] || "";
  document.getElementById("opt-2").value  = q.options[1] || "";
  document.getElementById("opt-3").value  = q.options[2] || "";
  document.getElementById("opt-4").value  = q.options[3] || "";
  // Find which option index is the correct answer
  const ci = q.options.findIndex(o => o === q.answer);
  document.getElementById("correct-ans").value = ci >= 0 ? ci : "";
  openModal("question-modal");
}

function saveQuestion() {
  const text   = document.getElementById("q-text").value.trim();
  const opts   = [
    document.getElementById("opt-1").value.trim(),
    document.getElementById("opt-2").value.trim(),
    document.getElementById("opt-3").value.trim(),
    document.getElementById("opt-4").value.trim(),
  ];
  const ci     = document.getElementById("correct-ans").value;

  if (!text)                        { showToast("Question text is required", "error"); return; }
  if (opts.some(o => !o))           { showToast("All 4 options are required", "error"); return; }
  if (ci === "")                    { showToast("Select the correct answer", "error"); return; }

  const newQ = { question: text, options: opts, answer: opts[parseInt(ci)] };
  const questions = getQuestions();
  const idx = parseInt(document.getElementById("edit-index").value);

  if (idx === -1) {
    questions.push(newQ);
    showToast("Question added successfully", "success");
  } else {
    questions[idx] = newQ;
    showToast("Question updated successfully", "success");
  }

  saveQuestions(questions);
  closeModal("question-modal");
  renderQuestions();
  // Update dashboard stat live
  document.getElementById("stat-total-questions").textContent = questions.length;
}

function viewQuestion(idx) {
  const q = getQuestions()[idx];
  const ci = q.options.findIndex(o => o === q.answer);
  const html = `
    <div class="view-table-wrap">
      <div class="view-row">
        <div class="view-label">QUESTION</div>
        <div class="view-value">${esc(q.question)}</div>
      </div>
      ${q.options.map((o, i) => `
      <div class="view-row">
        <div class="view-label">OPTION ${i + 1}</div>
        <div class="view-value" style="${i === ci ? 'color:var(--green);font-weight:600;' : ''}">
          ${i === ci ? '<i class="fa-solid fa-check" style="margin-right:6px;"></i>' : ''}${esc(o)}
        </div>
      </div>`).join("")}
      <div class="view-row">
        <div class="view-label">ANSWER</div>
        <div class="view-value"><span class="badge badge-green">${esc(q.answer)}</span></div>
      </div>
    </div>`;
  document.getElementById("view-question-content").innerHTML = html;
  openModal("view-question-modal");
}

function askDelete(idx) {
  pendingDeleteIndex = idx;
  openModal("confirm-modal");
}

function confirmDelete() {
  if (pendingDeleteIndex < 0) return;
  const questions = getQuestions();
  questions.splice(pendingDeleteIndex, 1);
  saveQuestions(questions);
  pendingDeleteIndex = -1;
  closeModal("confirm-modal");
  renderQuestions();
  document.getElementById("stat-total-questions").textContent = questions.length;
  showToast("Question deleted", "info");
}

// ─── Users ────────────────────────────────────────────────────
let allUsers = [];

function renderUsers(filter = "") {
  allUsers = getUsers();
  const tests = getTests();
  const tbody = document.getElementById("users-tbody");
  const list  = filter
    ? allUsers.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase()))
    : allUsers;

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fa-solid fa-users"></i><p>No users registered yet</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((u, i) => {
    const userTests = tests.filter(t => t.email === u.email);
    const bestScore = userTests.length ? Math.max(...userTests.map(t => t.score)) : null;
    return `<tr>
      <td style="color:var(--muted);font-size:13px;">${i + 1}</td>
      <td>
        <div class="user-chip">
          <div class="chip-avatar">${(u.name || "?").charAt(0).toUpperCase()}</div>
          <div>
            <div class="chip-name">${esc(u.name)}</div>
            <div class="chip-email">${esc(u.email)}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="badge ${userTests.length ? 'badge-blue' : 'badge-muted'}">${userTests.length} test${userTests.length !== 1 ? 's' : ''}</span>
      </td>
      <td>
        ${bestScore !== null
          ? `<span class="badge ${bestScore >= 70 ? 'badge-green' : bestScore >= 40 ? 'badge-gold' : 'badge-red'}">${bestScore}/100</span>`
          : `<span style="color:var(--muted);font-size:13px;">No tests</span>`}
      </td>
      <td>
        <div class="action-btns">
          <button class="btn btn-info btn-sm" onclick="viewUserTests('${esc(u.email)}', '${esc(u.name)}')">
            <i class="fa-solid fa-chart-bar"></i> Tests
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${esc(u.email)}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`;
  }).join("");
}

function filterUsers() {
  renderUsers(document.getElementById("u-search").value);
}

function viewUserTests(email, name) {
  const tests = getTests().filter(t => t.email === email);
  if (!tests.length) {
    showToast(`${name} hasn't taken any tests yet`, "info");
    return;
  }
  const html = `
    <div style="margin-bottom:16px;">
      <div class="user-chip">
        <div class="chip-avatar">${name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="chip-name">${esc(name)}</div>
          <div class="chip-email">${esc(email)}</div>
        </div>
      </div>
    </div>
    <div class="view-table-wrap">
      <table style="width:100%;">
        <thead>
          <tr>
            <th style="padding:10px 14px;color:var(--muted);font-size:11px;letter-spacing:1px;">#</th>
            <th style="padding:10px 14px;color:var(--muted);font-size:11px;letter-spacing:1px;">SCORE</th>
            <th style="padding:10px 14px;color:var(--muted);font-size:11px;letter-spacing:1px;">TIME SPENT</th>
            <th style="padding:10px 14px;color:var(--muted);font-size:11px;letter-spacing:1px;">DATE</th>
          </tr>
        </thead>
        <tbody>
          ${tests.map((t, i) => `<tr>
            <td style="padding:10px 14px;font-size:13px;color:var(--muted);">${i + 1}</td>
            <td style="padding:10px 14px;">
              <span class="badge ${t.score >= 70 ? 'badge-green' : t.score >= 40 ? 'badge-gold' : 'badge-red'}">${t.score}/100</span>
            </td>
            <td style="padding:10px 14px;font-size:13px;color:var(--muted);">${formatTime(t.time)}</td>
            <td style="padding:10px 14px;font-size:13px;color:var(--muted);">${esc(t.date || "—")}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
  document.getElementById("view-result-content").innerHTML = html;
  openModal("view-result-modal");
}

function deleteUser(email) {
  if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
  const users = getUsers().filter(u => u.email !== email);
  localStorage.setItem("user", JSON.stringify(users));
  renderUsers();
  document.getElementById("stat-total-users").textContent = users.length;
  showToast("User deleted", "info");
}

// ─── Results ──────────────────────────────────────────────────
let allTests = [];

function renderResults(filter = "") {
  allTests = getTests().sort((a, b) => b.score - a.score);
  const tbody = document.getElementById("results-tbody");
  const list  = filter
    ? allTests.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()) || t.email.toLowerCase().includes(filter.toLowerCase()))
    : allTests;

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-chart-bar"></i><p>No test results yet</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((t, i) => {
    const realRank = allTests.indexOf(t) + 1;
    return `<tr>
      <td>
        <span class="rank-badge ${realRank === 1 ? 'rank-1' : realRank === 2 ? 'rank-2' : realRank === 3 ? 'rank-3' : 'rank-n'}">${realRank}</span>
      </td>
      <td>
        <div class="user-chip">
          <div class="chip-avatar">${(t.name || "?").charAt(0).toUpperCase()}</div>
          <div>
            <div class="chip-name">${esc(t.name)}</div>
            <div class="chip-email">${esc(t.email)}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${t.score >= 70 ? 'badge-green' : t.score >= 40 ? 'badge-gold' : 'badge-red'}">${t.score}/100</span></td>
      <td style="color:var(--muted);font-size:13px;">${formatTime(t.time)}</td>
      <td style="color:var(--muted);font-size:13px;">${esc(t.date || "—")}</td>
      <td>
        <button class="btn btn-info btn-sm" onclick='viewResultDetail(${JSON.stringify(i)})'>
          <i class="fa-solid fa-eye"></i> Detail
        </button>
      </td>
    </tr>`;
  }).join("");
}

function filterResults() {
  renderResults(document.getElementById("r-search").value);
}

function viewResultDetail(listIdx) {
  const tests = getTests().sort((a, b) => b.score - a.score);
  const t = tests[listIdx];
  if (!t) return;

  const correct   = t.questions ? t.questions.filter(q => q.choosedAnswer === q.answer).length : 0;
  const incorrect = t.questions ? t.questions.filter(q => q.choosedAnswer && q.choosedAnswer !== q.answer).length : 0;
  const skipped   = t.questions ? t.questions.filter(q => !q.choosedAnswer).length : 0;

  let questionsHtml = "";
  if (t.questions && t.questions.length) {
    questionsHtml = `
      <div style="margin-top:20px;">
        <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:15px;margin-bottom:12px;">Questions Attempted</div>
        ${t.questions.map((q, qi) => {
          const isCorrect = q.choosedAnswer === q.answer;
          const wasSkipped = !q.choosedAnswer;
          return `<div style="background:var(--dark);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:10px;">
            <div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--text);">Q${qi + 1}. ${esc(q.question)}</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              ${(q.options || []).map(o => {
                let style = "background:var(--card);border:1px solid var(--border);";
                if (o === q.answer) style = "background:rgba(61,220,151,0.15);border:1px solid var(--green);color:var(--green);";
                else if (o === q.choosedAnswer && !isCorrect) style = "background:rgba(255,92,108,0.15);border:1px solid var(--red);color:var(--red);";
                return `<span style="${style}padding:5px 12px;border-radius:6px;font-size:12px;">${esc(o)}</span>`;
              }).join("")}
            </div>
            ${wasSkipped
              ? `<div style="margin-top:8px;font-size:12px;color:var(--muted);"><i class="fa-solid fa-minus"></i> Skipped</div>`
              : isCorrect
              ? `<div style="margin-top:8px;font-size:12px;color:var(--green);"><i class="fa-solid fa-check"></i> Correct</div>`
              : `<div style="margin-top:8px;font-size:12px;color:var(--red);"><i class="fa-solid fa-xmark"></i> Wrong — correct: <strong>${esc(q.answer)}</strong></div>`
            }
          </div>`;
        }).join("")}
      </div>`;
  }

  const html = `
    <div class="view-table-wrap" style="margin-bottom:16px;">
      <div class="view-row">
        <div class="view-label">USER</div>
        <div class="view-value">
          <div class="user-chip">
            <div class="chip-avatar">${(t.name || "?").charAt(0).toUpperCase()}</div>
            <div><div class="chip-name">${esc(t.name)}</div><div class="chip-email">${esc(t.email)}</div></div>
          </div>
        </div>
      </div>
      <div class="view-row">
        <div class="view-label">SCORE</div>
        <div class="view-value"><span class="badge ${t.score >= 70 ? 'badge-green' : t.score >= 40 ? 'badge-gold' : 'badge-red'}" style="font-size:16px;padding:5px 14px;">${t.score}/100</span></div>
      </div>
      <div class="view-row">
        <div class="view-label">TIME SPENT</div>
        <div class="view-value">${formatTime(t.time)}</div>
      </div>
      <div class="view-row">
        <div class="view-label">DATE</div>
        <div class="view-value">${esc(t.date || "—")}</div>
      </div>
      <div class="view-row">
        <div class="view-label">CORRECT</div>
        <div class="view-value" style="color:var(--green);">${correct}</div>
      </div>
      <div class="view-row">
        <div class="view-label">WRONG</div>
        <div class="view-value" style="color:var(--red);">${incorrect}</div>
      </div>
      <div class="view-row">
        <div class="view-label">SKIPPED</div>
        <div class="view-value" style="color:var(--muted);">${skipped}</div>
      </div>
    </div>
    ${questionsHtml}`;

  document.getElementById("view-result-content").innerHTML = html;
  openModal("view-result-modal");
}

// ─── Leaderboard ──────────────────────────────────────────────
function renderLeaderboard() {
  const tests = getTests().sort((a, b) => b.score - a.score);
  const podium = document.getElementById("podium-section");
  const tbody  = document.getElementById("leaderboard-tbody");

  if (!tests.length) {
    podium.innerHTML = `<div class="empty-state" style="width:100%;"><i class="fa-solid fa-trophy"></i><p>No results yet</p></div>`;
    tbody.innerHTML  = `<tr><td colspan="4"><div class="empty-state"><i class="fa-solid fa-trophy"></i><p>No results yet</p></div></td></tr>`;
    return;
  }

  // Podium (top 3)
  const top = [tests[1], tests[0], tests[2]]; // 2nd, 1st, 3rd layout
  const rankLabels = ["🥈", "🥇", "🥉"];
  const heights    = ["80px", "110px", "60px"];
  const bgColors   = [
    "rgba(124,122,150,0.25)",
    "rgba(243,189,0,0.25)",
    "rgba(61,220,151,0.15)"
  ];

  podium.innerHTML = top.map((t, i) => {
    if (!t) return `<div class="podium-item"><div class="podium-block" style="width:90px;height:${heights[i]};background:${bgColors[i]};">—</div><div class="podium-name">—</div></div>`;
    return `<div class="podium-item">
      <div class="podium-rank">${rankLabels[i]}</div>
      <div class="podium-block" style="width:90px;height:${heights[i]};background:${bgColors[i]};">${t.score}</div>
      <div class="podium-name">${esc(t.name)}</div>
      <div class="podium-score">${esc(t.email)}</div>
    </div>`;
  }).join("");

  // Full table
  tbody.innerHTML = tests.map((t, i) => `<tr>
    <td>
      <span class="rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n'}">${i + 1}</span>
    </td>
    <td>
      <div class="user-chip">
        <div class="chip-avatar">${(t.name || "?").charAt(0).toUpperCase()}</div>
        <div>
          <div class="chip-name">${esc(t.name)}</div>
          <div class="chip-email">${esc(t.email)}</div>
        </div>
      </div>
    </td>
    <td><span class="badge ${t.score >= 70 ? 'badge-green' : t.score >= 40 ? 'badge-gold' : 'badge-red'}">${t.score}/100</span></td>
    <td style="color:var(--muted);font-size:13px;">${esc(t.date || "—")}</td>
  </tr>`).join("");
}

// ─── Modal Helpers ────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add("open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

// Close on overlay click
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.classList.remove("open");
  });
});

// ─── Toast ────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  const icons = { success: "fa-circle-check", error: "fa-circle-xmark", info: "fa-circle-info" };
  toast.querySelector(".toast-icon").className = `fa-solid ${icons[type] || icons.success} toast-icon`;
  document.getElementById("toast-msg").textContent = msg;
  toast.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = ""; }, 3000);
}

// ─── Utilities ────────────────────────────────────────────────
function esc(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ─── Init ─────────────────────────────────────────────────────
(function init() {
  if (!checkAdminAuth()) return;

  // Seed default questions if none exist
  if (!localStorage.getItem("Quizes")) {
    saveQuestions(DEFAULT_QUESTIONS);
  }

  // Render initial page
  renderDashboard();
})();
