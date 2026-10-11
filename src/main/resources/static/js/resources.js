/**
 * AcadBridge — resources.js
 * Fetch resources from Spring Boot + MySQL.
 * Supports search, branch filtering, sorting, and rendering.
 */

'use strict';

let currentResources = [];
let allResources = [];

const API_URL = '/api/resources';

/* Convert database resource into the format used by the frontend */
function formatResource(r) {
  return {
    id: r.resourceId,
    title: r.title || 'Untitled Resource',
    description: r.description || '',
    subject: r.subject || 'General',
    branch: r.branch || 'Common',
    contributor: r.uploadedBy || 'Unknown',
    filePath: r.filePath || '',
    year: r.createdAt ? String(r.createdAt).slice(0, 10) : '',
    tags: [r.subject || '', r.branch || ''].filter(Boolean),

    // These fields are not currently supplied by the backend.
    type: '',
    semester: '',
    rating: 0,
    downloads: 0
  };
}

/* Render resource grid */
function renderResourceGrid(list) {
  const grid = document.getElementById('resourceGrid');
  const count = document.getElementById('resultsCount');

  if (!grid) return;

  if (count) {
    count.textContent =
      `${list.length} resource${list.length !== 1 ? 's' : ''} found`;
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h5>No resources found</h5>
          <p>Try adjusting your search or filters.</p>
        </div>
      </div>`;
    return;
  }

  // Keep your existing card design if buildResourceCard is available.
  if (typeof buildResourceCard === 'function') {
    grid.innerHTML = list.map(r => buildResourceCard(r)).join('');
    return;
  }

  // Fallback if the existing card builder is unavailable.
  grid.innerHTML = list.map(r => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${escapeHTML(r.title)}</h5>
          <p class="card-text">${escapeHTML(r.description)}</p>
          <p class="text-muted small">
            Subject: ${escapeHTML(r.subject)}<br>
            Branch: ${escapeHTML(r.branch)}<br>
            Uploaded by: ${escapeHTML(r.contributor)}
          </p>
        </div>
      </div>
    </div>
  `).join('');
}

/* Safely display text in fallback cards */
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

/* Read selected filters */
function getFilters() {
  const checked = name =>
    [...document.querySelectorAll(
      `input[name="${name}"]:checked`
    )].map(input => input.value);

  return {
    types: checked('type'),
    branches: checked('branch'),
    semesters: checked('semester')
  };
}

/* Search, filter, and sort database resources */
function applyFilters() {
  const query = (
    document.getElementById('searchInput')?.value || ''
  ).toLowerCase().trim();

  const sortBy =
    document.getElementById('sortSelect')?.value || 'newest';

  const filters = getFilters();

  let list = allResources.filter(resource => {
    const searchableText = [
      resource.title,
      resource.description,
      resource.subject,
      resource.branch,
      resource.contributor,
      ...resource.tags
    ].join(' ').toLowerCase();

    if (query && !searchableText.includes(query)) {
      return false;
    }

    if (
      filters.branches.length &&
      !filters.branches.some(branch =>
        branch.toLowerCase() === resource.branch.toLowerCase()
      )
    ) {
      return false;
    }

    // The API does not currently supply resource type or semester.
    // Do not pretend those filters are supported yet.
    if (filters.types.length || filters.semesters.length) {
      return false;
    }

    return true;
  });

  list.sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'newest') {
      return b.year.localeCompare(a.year);
    }

    // Rating and downloads are not stored in the current API response.
    return 0;
  });

  currentResources = list;
  renderResourceGrid(list);
}

/* Connect search and filter controls */
function bindResourceEvents() {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const searchBtn = document.getElementById('searchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', applyFilters);
  }

  document.querySelectorAll('.filter-check input').forEach(input => {
    input.addEventListener('change', applyFilters);
  });

  const clearBtn = document.getElementById('clearFilters');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-check input').forEach(input => {
        input.checked = false;
      });

      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'newest';

      applyFilters();
    });
  }

  // Support search text passed from the homepage URL.
  const params = new URLSearchParams(location.search);
  const query = params.get('q');

  if (query && searchInput) {
    searchInput.value = query;
  }
}

/* Fetch real data from the backend */
async function loadResources() {
  const grid = document.getElementById('resourceGrid');
  if (!grid) return;

  grid.innerHTML = `
    <div class="col-12 text-center py-4">
      <p>Loading resources from AcadBridge...</p>
    </div>`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response from the server');
    }

    allResources = data.map(formatResource);

    bindResourceEvents();

    // Apply URL-based branch/type filters where supported.
    const params = new URLSearchParams(location.search);
    const branch = params.get('branch');
    const type = params.get('type');

    if (branch) {
      const checkbox = document.querySelector(
        `input[name="branch"][value="${branch}"]`
      );
      if (checkbox) checkbox.checked = true;
    }

    if (type) {
      const checkbox = document.querySelector(
        `input[name="type"][value="${type}"]`
      );
      if (checkbox) checkbox.checked = true;
    }

    applyFilters();
  } catch (error) {
    console.error('Failed to load AcadBridge resources:', error);

    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <i class="fas fa-exclamation-circle"></i>
          <h5>Could not load resources</h5>
          <p>Check that the AcadBridge backend is running, then refresh this page.</p>
          <button class="btn btn-primary" id="retryResources">
            Try Again
          </button>
        </div>
      </div>`;

    document.getElementById('retryResources')?.addEventListener(
      'click',
      loadResources
    );
  }
}

/* Start when the page is ready */
document.addEventListener('DOMContentLoaded', loadResources);