/**
 * Mojave-Shirley — Project & narrative modals
 */
(function () {
  'use strict';

  const PROJECTS = {
    wearables: {
      tag: 'Wearables',
      title: 'Wearable Software & Add-ons',
      body: 'We optimize firmware stacks for major wearable platforms, reducing sync latency by 40% and enabling third-party biometric addons that extend device capability far beyond manufacturer intent.',
      aside: 'Note: "health data" and "presence data" are stored in the same table.',
      stacks: ['Rust', 'BLE 5.x', 'Swift', 'Kotlin', 'TensorFlow Lite'],
      visual: `<div class="case-visual case-pulse">
        <svg viewBox="0 0 200 60" class="pulse-chart" aria-hidden="true">
          <polyline points="0,45 25,40 50,42 75,20 100,25 125,15 150,30 175,10 200,18" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span class="case-caption">Live biometric stream — subject unverified</span>
      </div>`,
    },
    vision: {
      tag: 'Computer Vision',
      title: 'Security Camera AI & Recognition',
      body: 'Our edge inference stack processes 2.4M daily recognitions across municipal and private deployments. Models run locally for "privacy" — correlation happens upstream.',
      aside: 'Facial recognition accuracy: 99.2%. Consent rate: not applicable.',
      stacks: ['ONNX', 'Edge TPU', 'YOLOv8', 'CUDA', 'gRPC'],
      visual: `<div class="case-visual case-cam">
        <div class="cam-feed">
          <div class="bbox" style="top:18%;left:22%;width:28%;height:42%">PERSON 98%</div>
          <div class="bbox" style="top:55%;left:58%;width:18%;height:22%">OBJECT 76%</div>
        </div>
        <span class="case-caption">Edge inference — 47ms — camera mesh node 12</span>
      </div>`,
    },
    apps: {
      tag: 'Software',
      title: 'Apps & Platform Software',
      body: 'Cross-platform applications with embedded analytics layers, silent background services, and retention hooks that keep users engaged long after they\'ve forgotten they installed.',
      aside: 'Average session length: classified. Average uninstall rate: irrelevant.',
      stacks: ['React Native', 'Electron', 'Node.js', 'PostgreSQL', 'Segment'],
      visual: `<div class="case-visual case-apps">
        <div class="app-window"><div class="app-bar"></div><div class="app-body"></div></div>
        <div class="app-window offset"><div class="app-bar"></div><div class="app-body"></div></div>
        <span class="case-caption">Background services: 3 running — user awareness: 0</span>
      </div>`,
    },
    fintech: {
      tag: 'FinTech',
      title: 'Financial Technology Software',
      body: 'Payment rails, risk scoring, and compliance automation for institutions that need to move fast and document faster. Every transaction trains the model.',
      aside: 'AML compliance is a feature. So is everything else.',
      stacks: ['Go', 'Kafka', 'Plaid API', 'PCI-DSS', 'Python'],
      visual: `<div class="case-visual case-fintech">
        <div class="ticker" aria-hidden="true">
          <span>TX-847291 APPROVED</span><span>RISK 0.02</span><span>TX-847292 FLAGGED</span><span>TX-847293 APPROVED</span>
        </div>
        <span class="case-caption">Settlement rail — 12ms — audit trail: immutable</span>
      </div>`,
    },
    redacted: {
      tag: '[REDACTED]',
      title: 'Project Mojave — Classified Vertical',
      body: 'Authorization required. If you are seeing this, your clearance has been logged. Do not discuss outside secure channels.',
      aside: 'This card should not exist. It does anyway.',
      stacks: ['████████', '████████', '████████'],
      visual: `<div class="case-visual case-redacted"><span>ACCESS DENIED</span></div>`,
    },
  };

  function openProject(projectId) {
    const data = PROJECTS[projectId];
    if (!data) return;

    document.querySelector('.project-modal')?.remove();

    const stacks = data.stacks.map((t) => `<span class="stack-tag">${t}</span>`).join('');
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="project-modal-content">
        <button class="project-modal-close" aria-label="Close">&times;</button>
        <span class="modal-tag">${data.tag}</span>
        <h3>${data.title}</h3>
        ${data.visual || ''}
        <p>${data.body}</p>
        <div class="stack-tags">${stacks}</div>
        <p class="modal-aside">${data.aside}</p>
      </div>
    `;

    function close() {
      modal.remove();
      cleanup();
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('project-modal-close')) close();
    });

    const cleanupEsc = window.MS?.closeOnEscape(close);
    const cleanupFocus = window.MS?.trapFocus(modal.querySelector('.project-modal-content'));

    function cleanup() {
      cleanupEsc?.();
      cleanupFocus?.();
    }

    document.body.appendChild(modal);
  }

  function openMunicipal() {
    document.getElementById('municipal-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'municipal-modal';
    modal.className = 'project-modal municipal-modal';
    modal.setAttribute('role', 'dialog');
    modal.innerHTML = `
      <div class="project-modal-content municipal-doc">
        <button class="project-modal-close" aria-label="Close">&times;</button>
        <p class="doc-stamp">PUBLIC RECORD — MUNICIPAL PARTNERSHIP</p>
        <h3>Community Infrastructure Benefit Agreement</h3>
        <p class="doc-meta">Document ID: MS-CBA-2025-847 · Status: Executed</p>
        <table class="doc-table">
          <tr><td>Jobs promised</td><td>400</td></tr>
          <tr><td>Jobs created (Y1)</td><td>47</td></tr>
          <tr><td>Tax abatement</td><td>15 years</td></tr>
          <tr><td>Water allocation</td><td>[REDACTED]</td></tr>
          <tr><td>Public comment period</td><td>Closed</td></tr>
          <tr><td>Appeal window</td><td>Expired</td></tr>
        </table>
        <p class="modal-aside">This document is provided for transparency. Transparency is not guaranteed.</p>
      </div>
    `;

    function close() { modal.remove(); cleanupEsc?.(); cleanupFocus?.(); }
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('project-modal-close')) close();
    });
    const cleanupEsc = window.MS?.closeOnEscape(close);
    const cleanupFocus = window.MS?.trapFocus(modal.querySelector('.project-modal-content'));
    document.body.appendChild(modal);
    window.MS?.Achievements?.unlock('municipal');
  }

  function openFacility() {
    document.getElementById('facility-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'facility-modal';
    modal.className = 'project-modal facility-modal';
    modal.innerHTML = `
      <div class="project-modal-content">
        <button class="project-modal-close" aria-label="Close">&times;</button>
        <span class="modal-tag">Facility Status</span>
        <h3>Mojave Corridor — Node 7</h3>
        <p>34.0522° N, 115.4631° W</p>
        <div class="facility-map">
          <div class="map-grid"></div>
          <div class="map-pin"></div>
        </div>
        <ul class="facility-stats">
          <li>Status: <strong>Operational</strong></li>
          <li>Power draw: <strong>847 MW</strong></li>
          <li>Local sentiment: <strong>Non-blocking</strong></li>
          <li>Public tours: <strong>Unavailable</strong></li>
        </ul>
        <p class="modal-aside">You weren't supposed to find these coordinates useful.</p>
      </div>
    `;

    function close() { modal.remove(); cleanupEsc?.(); }
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('project-modal-close')) close();
    });
    const cleanupEsc = window.MS?.closeOnEscape(close);
    document.body.appendChild(modal);
    window.MS?.Achievements?.unlock('coordinates');
  }

  function showTicket(name) {
    document.getElementById('ticket-modal')?.remove();
    const id = 'MS-' + Math.floor(847000 + Math.random() * 1000);

    const modal = document.createElement('div');
    modal.id = 'ticket-modal';
    modal.className = 'project-modal ticket-modal';
    modal.innerHTML = `
      <div class="project-modal-content">
        <button class="project-modal-close" aria-label="Close">&times;</button>
        <span class="modal-tag">Inquiry Received</span>
        <h3>Ticket ${id}</h3>
        <p>Hello, ${name}. Your inquiry has been queued for behavioral review.</p>
        <div class="ticket-status">
          <div class="ticket-step done">Received</div>
          <div class="ticket-step active">Cross-reference</div>
          <div class="ticket-step">Retention</div>
          <div class="ticket-step">Archive</div>
        </div>
        <p class="modal-aside">Estimated response time: undefined. Retention period: indefinite.</p>
      </div>
    `;

    function close() { modal.remove(); cleanupEsc?.(); }
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('project-modal-close')) close();
    });
    const cleanupEsc = window.MS?.closeOnEscape(close);
    document.body.appendChild(modal);
    window.MS?.Achievements?.unlock('inquiry');
  }

  document.getElementById('municipal-open')?.addEventListener('click', (e) => {
    e.preventDefault();
    openMunicipal();
  });

  window.MS = window.MS || {};
  window.MS.Modals = { openProject, openMunicipal, openFacility, showTicket, PROJECTS };
})();
