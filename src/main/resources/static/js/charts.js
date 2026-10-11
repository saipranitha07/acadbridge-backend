/**
 * AcadBridge — charts.js
 * Chart.js chart initializers for Admin, Previous Papers, and other pages.
 */

'use strict';

/* ── Shared palette ──────────────────────────────────────────── */
const PALETTE = {
  blue:    'rgba(30,144,255,0.85)',
  blueT:   'rgba(30,144,255,0.15)',
  navy:    'rgba(13,27,42,0.85)',
  accent:  'rgba(0,196,204,0.8)',
  accentT: 'rgba(0,196,204,0.15)',
  gold:    'rgba(245,166,35,0.85)',
  green:   'rgba(34,197,94,0.85)',
  red:     'rgba(239,68,68,0.85)',
  purple:  'rgba(147,51,234,0.85)',
  orange:  'rgba(249,115,22,0.85)',
};

const MULTI_COLORS = [
  PALETTE.blue, PALETTE.accent, PALETTE.gold,
  PALETTE.green, PALETTE.red, PALETTE.purple, PALETTE.orange
];

/* ── Default Chart.js options ────────────────────────────────── */
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#4A5568';

/* ── Helper: get canvas context safely ─────────────────────── */
function ctx(id) {
  const el = document.getElementById(id);
  return el ? el.getContext('2d') : null;
}

/* ════════════════════════════════════════════════════════════
   ADMIN DASHBOARD CHARTS
   ════════════════════════════════════════════════════════════ */

/** Resource uploads per month (bar) */
function initUploadTrendChart() {
  const c = ctx('uploadTrendChart');
  if (!c) return;
  new Chart(c, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'Uploads',
        data: [18, 24, 31, 22, 40, 55, 38, 47, 62, 70, 53, 44],
        backgroundColor: PALETTE.blue,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

/** Resource type distribution (doughnut) */
function initResourceTypeChart() {
  const c = ctx('resourceTypeChart');
  if (!c) return;
  new Chart(c, {
    type: 'doughnut',
    data: {
      labels: ['Notes','Prev. Papers','Lab Manuals','Assignments','PPTs','Study Material'],
      datasets: [{
        data: [38, 22, 14, 10, 9, 7],
        backgroundColor: MULTI_COLORS,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 14, font: { size: 11 } } }
      },
      cutout: '62%'
    }
  });
}

/** User registrations over months (line) */
function initUserGrowthChart() {
  const c = ctx('userGrowthChart');
  if (!c) return;
  new Chart(c, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'New Users',
        data: [45, 62, 78, 55, 89, 112, 98, 134, 156, 178, 143, 121],
        borderColor: PALETTE.accent,
        backgroundColor: PALETTE.accentT,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: PALETTE.accent,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

/** Branch-wise resource count (horizontal bar) */
function initBranchChart() {
  const c = ctx('branchChart');
  if (!c) return;
  new Chart(c, {
    type: 'bar',
    data: {
      labels: ['CSE','ECE','Mechanical','Civil','EEE','Common'],
      datasets: [{
        label: 'Resources',
        data: [312, 198, 145, 112, 89, 74],
        backgroundColor: MULTI_COLORS,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { grid: { display: false } }
      }
    }
  });
}

/* ════════════════════════════════════════════════════════════
   PREVIOUS PAPERS PAGE CHARTS
   ════════════════════════════════════════════════════════════ */

/** Historical topic frequency – DBMS (bar) */
function initDbmsTopicChart() {
  const c = ctx('dbmsTopicChart');
  if (!c) return;
  new Chart(c, {
    type: 'bar',
    data: {
      labels: ['ER Model','Normalization','SQL Queries','Transactions','File Org.','Indexing','PL/SQL'],
      datasets: [
        {
          label: '2022-23',
          data: [3, 2, 4, 2, 1, 2, 1],
          backgroundColor: 'rgba(30,144,255,0.7)',
          borderRadius: 5,
        },
        {
          label: '2023-24',
          data: [2, 3, 3, 3, 2, 1, 2],
          backgroundColor: 'rgba(0,196,204,0.7)',
          borderRadius: 5,
        },
        {
          label: '2024-25',
          data: [4, 2, 5, 2, 1, 3, 2],
          backgroundColor: 'rgba(245,166,35,0.7)',
          borderRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Times Asked' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

/** Historical topic frequency – Data Structures (bar) */
function initDsTopicChart() {
  const c = ctx('dsTopicChart');
  if (!c) return;
  new Chart(c, {
    type: 'bar',
    data: {
      labels: ['Arrays','Linked List','Trees','Graphs','Sorting','Searching','Hashing'],
      datasets: [
        {
          label: '2022-23',
          data: [2, 3, 4, 3, 2, 2, 1],
          backgroundColor: 'rgba(147,51,234,0.7)',
          borderRadius: 5,
        },
        {
          label: '2023-24',
          data: [3, 2, 3, 4, 3, 1, 2],
          backgroundColor: 'rgba(249,115,22,0.7)',
          borderRadius: 5,
        },
        {
          label: '2024-25',
          data: [2, 4, 5, 3, 2, 2, 3],
          backgroundColor: 'rgba(34,197,94,0.7)',
          borderRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Times Asked' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

/** Marks distribution radar for a subject */
function initMarksRadar() {
  const c = ctx('marksRadar');
  if (!c) return;
  new Chart(c, {
    type: 'radar',
    data: {
      labels: ['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5'],
      datasets: [
        {
          label: '2022-23',
          data: [18, 14, 16, 20, 12],
          borderColor: PALETTE.blue,
          backgroundColor: PALETTE.blueT,
          pointBackgroundColor: PALETTE.blue,
        },
        {
          label: '2023-24',
          data: [20, 16, 14, 18, 15],
          borderColor: PALETTE.accent,
          backgroundColor: PALETTE.accentT,
          pointBackgroundColor: PALETTE.accent,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        r: {
          beginAtZero: true,
          max: 25,
          ticks: { stepSize: 5 }
        }
      }
    }
  });
}

/** Paper difficulty trend (line) */
function initDifficultyTrend() {
  const c = ctx('difficultyTrend');
  if (!c) return;
  new Chart(c, {
    type: 'line',
    data: {
      labels: ['2019-20','2020-21','2021-22','2022-23','2023-24','2024-25'],
      datasets: [{
        label: 'Avg. Difficulty (1–5)',
        data: [3.2, 3.0, 3.5, 3.8, 3.6, 4.1],
        borderColor: PALETTE.gold,
        backgroundColor: 'rgba(245,166,35,0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: PALETTE.gold,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 1, max: 5, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

/* ── Auto-init on DOM ready ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Admin page
  initUploadTrendChart();
  initResourceTypeChart();
  initUserGrowthChart();
  initBranchChart();
  // Previous papers page
  initDbmsTopicChart();
  initDsTopicChart();
  initMarksRadar();
  initDifficultyTrend();
});
