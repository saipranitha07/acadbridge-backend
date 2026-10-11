/**
 * AcadBridge — app.js
 * Shared utilities: demo banner, navbar, toast, bookmarks, scroll, etc.
 */

'use strict';

/* ── Sample Data ────────────────────────────────────────────── */
const SAMPLE_RESOURCES = [
  {
    id: 'r1', title: 'Data Structures Complete Notes', subject: 'Data Structures',
    branch: 'CSE', semester: 3, unit: 'Unit 1-4', type: 'notes',
    contributor: 'Arjun Mehta', year: '2025-26', downloads: 342, rating: 4.7,
    reviews: 28, size: '2.4 MB', pages: 68, tags: ['arrays','linked-list','trees'],
    description: 'Comprehensive hand-written and typed notes covering all units of Data Structures (BCS301). Includes diagrams, algorithms, and solved examples.'
  },
  {
    id: 'r2', title: 'DBMS Previous Year Paper 2023-24', subject: 'Database Management',
    branch: 'CSE', semester: 4, unit: 'All Units', type: 'paper',
    contributor: 'Priya Sharma', year: '2023-24', downloads: 521, rating: 4.5,
    reviews: 41, size: '1.1 MB', pages: 8, tags: ['SQL','ER-model','normalization'],
    description: 'University exam paper for DBMS (BCS401) from the 2023-24 academic year. Includes all sections.'
  },
  {
    id: 'r3', title: 'Network Lab Manual – 7th Semester', subject: 'Computer Networks',
    branch: 'CSE', semester: 7, unit: 'Lab', type: 'lab',
    contributor: 'Sneha Patel', year: '2025-26', downloads: 187, rating: 4.8,
    reviews: 19, size: '3.8 MB', pages: 52, tags: ['socket','TCP/IP','wireshark'],
    description: 'Fully solved lab manual with programs for all 10 experiments including socket programming and network tools.'
  },
  {
    id: 'r4', title: 'Operating System Assignment – Scheduling', subject: 'Operating Systems',
    branch: 'CSE', semester: 5, unit: 'Unit 2', type: 'assignment',
    contributor: 'Rahul Kumar', year: '2025-26', downloads: 95, rating: 4.2,
    reviews: 12, size: '0.8 MB', pages: 14, tags: ['scheduling','FCFS','Round-Robin'],
    description: 'Assignment on CPU scheduling algorithms with diagrams, Gantt charts, and solved problems.'
  },
  {
    id: 'r5', title: 'Web Technology – HTML, CSS, JS Slides', subject: 'Web Technology',
    branch: 'CSE', semester: 6, unit: 'Unit 1-3', type: 'ppt',
    contributor: 'Divya Nair', year: '2025-26', downloads: 274, rating: 4.6,
    reviews: 33, size: '5.2 MB', pages: 96, tags: ['HTML5','CSS3','JavaScript'],
    description: 'Slide deck covering HTML5 semantics, CSS3 animations, JavaScript ES6+ features, and DOM manipulation.'
  },
  {
    id: 'r6', title: 'Engineering Mathematics I Study Guide', subject: 'Mathematics I',
    branch: 'Common', semester: 1, unit: 'All Units', type: 'study',
    contributor: 'Karan Singh', year: '2024-25', downloads: 612, rating: 4.9,
    reviews: 57, size: '4.0 MB', pages: 80, tags: ['calculus','matrices','ODEs'],
    description: 'Complete study guide for Engineering Maths I with solved PYQs, formulas, and quick-revision notes.'
  },
  {
    id: 'r7', title: 'Java Programming – Core Concepts Notes', subject: 'Java Programming',
    branch: 'CSE', semester: 4, unit: 'Unit 1-3', type: 'notes',
    contributor: 'Neha Verma', year: '2025-26', downloads: 408, rating: 4.7,
    reviews: 36, size: '3.1 MB', pages: 72, tags: ['OOP','collections','exception'],
    description: 'Notes on core Java: OOP principles, collections framework, exception handling, and I/O streams.'
  },
  {
    id: 'r8', title: 'Microprocessor Previous Paper 2022-23', subject: 'Microprocessors',
    branch: 'ECE', semester: 5, unit: 'All Units', type: 'paper',
    contributor: 'Amit Reddy', year: '2022-23', downloads: 219, rating: 4.4,
    reviews: 21, size: '0.9 MB', pages: 8, tags: ['8086','assembly','interrupts'],
    description: 'University examination paper for Microprocessors & Interfacing from 2022-23.'
  },
  {
    id: 'r9', title: 'Digital Electronics Lab Manual', subject: 'Digital Electronics',
    branch: 'ECE', semester: 3, unit: 'Lab', type: 'lab',
    contributor: 'Isha Joshi', year: '2025-26', downloads: 143, rating: 4.6,
    reviews: 16, size: '2.7 MB', pages: 44, tags: ['logic-gates','flip-flops','counters'],
    description: 'Lab manual covering 12 experiments on logic gates, flip-flops, adders, and counters.'
  },
  {
    id: 'r10', title: 'Fluid Mechanics Complete Notes', subject: 'Fluid Mechanics',
    branch: 'Mechanical', semester: 4, unit: 'Unit 1-5', type: 'notes',
    contributor: 'Rohit Gupta', year: '2024-25', downloads: 267, rating: 4.5,
    reviews: 22, size: '3.5 MB', pages: 90, tags: ['bernoulli','viscosity','flow'],
    description: 'Detailed notes for Fluid Mechanics covering all 5 units with diagrams and derivations.'
  },
  {
    id: 'r11', title: 'Engineering Drawing Slides', subject: 'Engineering Drawing',
    branch: 'Common', semester: 1, unit: 'Unit 1-3', type: 'ppt',
    contributor: 'Meera Pillai', year: '2024-25', downloads: 189, rating: 4.3,
    reviews: 18, size: '8.4 MB', pages: 120, tags: ['orthographic','isometric','CAD'],
    description: 'Slide deck for Engineering Drawing with visual examples, practice problems, and CAD basics.'
  },
  {
    id: 'r12', title: 'Analog Circuits Study Material', subject: 'Analog Circuits',
    branch: 'ECE', semester: 4, unit: 'Unit 2-4', type: 'study',
    contributor: 'Sanjay Kumar', year: '2025-26', downloads: 175, rating: 4.4,
    reviews: 15, size: '2.2 MB', pages: 56, tags: ['op-amp','filters','oscillators'],
    description: 'Study material for Analog Circuits covering operational amplifiers, active filters, and oscillator circuits.'
  }
];

const TYPE_ICONS = {
  notes: 'fa-file-alt',
  paper: 'fa-scroll',
  lab: 'fa-flask',
  assignment: 'fa-tasks',
  ppt: 'fa-file-powerpoint',
  study: 'fa-book-open'
};

const TYPE_LABELS = {
  notes: 'Class Notes',
  paper: 'Prev. Paper',
  lab: 'Lab Manual',
  assignment: 'Assignment',
  ppt: 'Presentation',
  study: 'Study Material'
};

const TYPE_BADGE_CLASS = {
  notes: 'badge-notes',
  paper: 'badge-paper',
  lab: 'badge-lab',
  assignment: 'badge-assign',
  ppt: 'badge-ppt',
  study: 'badge-study'
};

/* ── Bookmark helpers ─────────────────────────────────────── */
function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('acadbridge_bookmarks') || '[]'); }
  catch { return []; }
}

function saveBookmarks(bm) {
  localStorage.setItem('acadbridge_bookmarks', JSON.stringify(bm));
}

function isBookmarked(id) {
  return getBookmarks().includes(id);
}

function toggleBookmark(id) {
  let bm = getBookmarks();
  if (bm.includes(id)) {
    bm = bm.filter(b => b !== id);
    showToast('Removed from My Library', 'info');
  } else {
    bm.push(id);
    showToast('Saved to My Library!', 'success');
  }
  saveBookmarks(bm);
  return bm.includes(id);
}

/* ── Toast ──────────────────────────────────────────────────── */
function showToast(message, type = 'info', duration = 3200) {
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const t = document.createElement('div');
  t.className = `toast-custom ${type}`;
  t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'fadeOutRight 0.35s ease forwards';
    setTimeout(() => t.remove(), 350);
  }, duration);
}

/* ── Star rating HTML ───────────────────────────────────────── */
function starsHTML(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) s += '<i class="fas fa-star"></i>';
    else if (rating >= i - 0.5) s += '<i class="fas fa-star-half-alt"></i>';
    else s += '<i class="far fa-star"></i>';
  }
  return s;
}

/* ── Resource Card HTML ─────────────────────────────────────── */
function buildResourceCard(r) {
  const saved = isBookmarked(r.id);
  const typeIcon = TYPE_ICONS[r.type] || 'fa-file';
  const typeBadge = TYPE_BADGE_CLASS[r.type] || '';
  const typeLabel = TYPE_LABELS[r.type] || r.type;
  const stars = starsHTML(r.rating);

  return `
  <div class="col-md-6 col-xl-4 d-flex">
    <div class="resource-card w-100" onclick="openResource('${r.id}')" style="cursor:pointer">
      <div class="rc-top">
        <div class="rc-type-icon"><i class="fas ${typeIcon}"></i></div>
        <div class="d-flex flex-column align-items-end gap-1">
          <span class="badge-type ${typeBadge}">${typeLabel}</span>
          <small class="text-white-50" style="font-size:0.75rem">${r.year}</small>
        </div>
      </div>
      <div class="rc-body">
        <h5>${r.title}</h5>
        <div class="rc-meta">
          <span><i class="fas fa-code-branch"></i>${r.branch}</span>
          <span><i class="fas fa-layer-group"></i>Sem ${r.semester}</span>
          <span><i class="fas fa-book"></i>${r.subject}</span>
        </div>
        <p style="font-size:0.82rem;color:var(--text-mid);line-height:1.45;
                  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
          ${r.description}
        </p>
      </div>
      <div class="rc-footer">
        <div>
          <div class="star-rating">${stars}<span>(${r.reviews})</span></div>
          <small style="color:var(--text-light);font-size:0.76rem"><i class="fas fa-download me-1"></i>${r.downloads} downloads</small>
        </div>
        <button class="btn-bookmark ${saved ? 'saved' : ''}" onclick="event.stopPropagation();handleBookmark(this,'${r.id}')" title="Save to library">
          <i class="${saved ? 'fas' : 'far'} fa-bookmark"></i>
        </button>
      </div>
    </div>
  </div>`;
}

function openResource(id) {
  window.location.href = `resource-details.html?id=${id}`;
}

function handleBookmark(btn, id) {
  const nowSaved = toggleBookmark(id);
  btn.classList.toggle('saved', nowSaved);
  btn.querySelector('i').className = nowSaved ? 'fas fa-bookmark' : 'far fa-bookmark';
}

/* ── Active nav link ────────────────────────────────────────── */
function markActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && page.includes(href.replace('.html',''))) {
      link.classList.add('active');
    }
  });
}

/* ── Scroll reveal (lightweight) ───────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    obs.observe(el);
  });
}

/* ── Counter animation ──────────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

/* ── Demo password toggle ───────────────────────────────────── */
function setupPasswordToggles() {
  document.querySelectorAll('.btn-toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = btn.closest('.input-group').querySelector('input');
      if (!inp) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.querySelector('i').className = inp.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
  });
}

/* ── Form validation helper ─────────────────────────────────── */
function validateForm(formEl) {
  let valid = true;
  formEl.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('is-invalid');
      valid = false;
    } else {
      field.classList.remove('is-invalid');
    }
  });
  // email check
  const emailEl = formEl.querySelector('input[type=email]');
  if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add('is-invalid');
    valid = false;
  }
  return valid;
}

/* ── Upload zone drag/drop ──────────────────────────────────── */
function setupUploadZone() {
  const zone = document.querySelector('.upload-zone');
  const input = document.getElementById('fileInput');
  const nameDisplay = document.getElementById('fileName');
  if (!zone || !input) return;

  zone.addEventListener('click', () => input.click());

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });

  input.addEventListener('change', () => {
    if (input.files.length) handleFileSelect(input.files[0]);
  });

  function handleFileSelect(file) {
    if (nameDisplay) nameDisplay.textContent = `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    zone.style.borderColor = 'var(--blue)';
    zone.style.background = 'rgba(30,144,255,0.06)';
  }
}

/* ── DOMContentLoaded init ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  markActiveNav();
  initScrollReveal();
  setupPasswordToggles();
  setupUploadZone();

  // Counter animation when stats strip visible
  const strip = document.querySelector('.stats-strip');
  if (strip) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(strip);
  }
});
