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
        <div class="cam-feed" id="interactive-cam-feed">
          <div class="bbox" style="top:18%;left:22%;width:28%;height:42%">PERSON 98%</div>
          <div class="bbox" style="top:55%;left:58%;width:18%;height:22%">OBJECT 76%</div>
        </div>
        <span class="case-caption">Move cursor over feed — edge inference active</span>
      </div>`,
      interactiveCam: true,
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
    pipe: {
      tag: 'The Pipe',
      title: 'You Found the Pipe',
      body: 'Every directive discovered. Every vertical mapped. You understand that infrastructure is not built — it is installed. Welcome to Mojave-Shirley. Your clearance is permanent.',
      aside: 'This message self-destructs never. Session retained forever.',
      stacks: ['Presence', 'Retention', 'Compliance'],
      visual: `<div class="case-visual case-pipe"><span>◆ PIPE MEMBER ◆</span></div>`,
    },
  };

  const LABELS = ['PERSON', 'OBJECT', 'VEHICLE', 'SIGNAL', 'ANOMALY'];

  function initCamFeed(feed) {
    if (!feed) return;
    let boxCount = 0;
    feed.addEventListener('mousemove', (e) => {
      if (boxCount > 8) return;
      const rect = feed.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (Math.random() > 0.92) {
        const box = document.createElement('div');
        box.className = 'bbox bbox-dynamic';
        const size = 12 + Math.random() * 18;
        box.style.cssText = `top:${y - size / 2}%;left:${x - size / 2}%;width:${size}%;height:${size * 0.8}%`;
        box.textContent = `${LABELS[Math.floor(Math.random() * LABELS.length)]} ${Math.floor(60 + Math.random() * 39)}%`;
        feed.appendChild(box);
        boxCount++;
        setTimeout(() => box.remove(), 2500);
      }
    });
  }

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

    if (data.interactiveCam) {
      initCamFeed(modal.querySelector('#interactive-cam-feed'));
    }
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
        <p class="doc-qr-hint">Facility node: <a href="node/" target="_blank" rel="noopener">/node</a></p>
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

  function openGlossary() {
    openGenericModal('glossary-modal', `
      <span class="modal-tag">Lexicon</span>
      <h3>Corporate Glossary</h3>
      <dl class="glossary-list">
        <dt>Community partnership</dt><dd>Long-term land lease with optional tax abatement.</dd>
        <dt>Edge region</dt><dd>Geographic area where you do not live.</dd>
        <dt>Transparency</dt><dd>Availability of information upon denial.</dd>
        <dt>Retention policy</dt><dd>Duration: yes.</dd>
        <dt>Public comment period</dt><dd>Scheduled interval before predetermined outcome.</dd>
        <dt>Local sentiment</dt><dd>Non-blocking telemetry.</dd>
      </dl>
    `);
  }

  function openCareers() {
    openGenericModal('careers-modal', `
      <span class="modal-tag">Careers</span>
      <h3>Join the Pipeline</h3>
      <ul class="careers-list">
        <li><strong>Community Sentiment Analyst</strong> — Deprioritize feedback at scale.</li>
        <li><strong>Protest De-escalation Engineer</strong> — Rename rallies to engagement spikes.</li>
        <li><strong>Retention Policy Architect</strong> — Design systems that never forget.</li>
      </ul>
      <button type="button" class="btn btn-primary" id="careers-apply">Apply Now</button>
      <p class="modal-aside" id="careers-result" hidden>Recommendation: Infrastructure. Always Infrastructure.</p>
    `, () => {
      document.getElementById('careers-apply')?.addEventListener('click', () => {
        document.getElementById('careers-result').hidden = false;
        window.MS?.Achievements?.unlock('careers');
        window.MS?.showToast('Application received. You are pre-qualified for the pipe.');
      });
    });
  }

  function openInvestors() {
    openGenericModal('investors-modal', `
      <span class="modal-tag">Q3 2025</span>
      <h3>Investor Deck</h3>
      <div class="investor-charts">
        <div class="chart-bar"><span class="chart-label">Compute capacity</span><div class="chart-fill" style="width:95%"></div></div>
        <div class="chart-bar"><span class="chart-label">Community trust</span><div class="chart-fill chart-flat" style="width:12%"></div></div>
        <div class="chart-bar"><span class="chart-label">MW under management</span><div class="chart-fill" style="width:88%"></div></div>
        <div class="chart-bar"><span class="chart-label">Objections filed</span><div class="chart-fill" style="width:70%"></div></div>
      </div>
      <p class="modal-aside">Forward-looking statements include datacenters you haven't heard about yet.</p>
    `);
    window.MS?.Achievements?.unlock('investors');
  }

  function openReport() {
    openGenericModal('report-modal', `
      <span class="modal-tag">Whistleblower</span>
      <h3>Report This Site</h3>
      <textarea id="report-text" rows="4" placeholder="Describe your concerns..." class="report-input"></textarea>
      <button type="button" class="btn btn-primary" id="report-submit">Submit Report</button>
      <p class="modal-aside" id="report-result" hidden>Complaint archived. Subject notified. Thank you for your compliance.</p>
    `, () => {
      document.getElementById('report-submit')?.addEventListener('click', () => {
        document.getElementById('report-result').hidden = false;
        window.MS?.Achievements?.unlock('whistleblower');
        window.MS?.showToast('Report forwarded to Legal and Retention.');
      });
    });
  }

  function openShareCard() {
    const { count, total } = window.MS?.Achievements?.getProgress() || { count: 0, total: 24 };
    openGenericModal('share-modal', `
      <span class="modal-tag">Clearance Card</span>
      <h3>EYES ONLY</h3>
      <div class="clearance-card">
        <p class="clearance-level">CLEARANCE: PIPE MEMBER</p>
        <p>Directives: ${count}/${total}</p>
        <p>Mojave-Shirley · edge-7-mojave</p>
      </div>
      <p class="modal-aside">Screenshot encouraged. Deletion discouraged.</p>
    `);
  }

  function openGenericModal(id, inner, onMount) {
    document.getElementById(id)?.remove();
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'project-modal';
    modal.innerHTML = `<div class="project-modal-content"><button class="project-modal-close" aria-label="Close">&times;</button>${inner}</div>`;
    function close() { modal.remove(); cleanupEsc?.(); }
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('project-modal-close')) close();
    });
    const cleanupEsc = window.MS?.closeOnEscape(close);
    document.body.appendChild(modal);
    onMount?.();
  }

  document.getElementById('municipal-open')?.addEventListener('click', (e) => {
    e.preventDefault();
    openMunicipal();
  });
  document.getElementById('careers-open')?.addEventListener('click', (e) => {
    e.preventDefault();
    openCareers();
  });
  document.getElementById('investors-open')?.addEventListener('click', (e) => {
    e.preventDefault();
    openInvestors();
  });
  document.getElementById('report-open')?.addEventListener('click', (e) => {
    e.preventDefault();
    openReport();
  });

  window.MS = window.MS || {};
  window.MS.Modals = {
    openProject, openMunicipal, openFacility, showTicket,
    openGlossary, openCareers, openInvestors, openReport, openShareCard,
    PROJECTS,
  };
})();

