/**
 * Mojave-Shirley — Project & narrative modals
 */
(function () {
  'use strict';

  const PROJECTS = {
    wearables: {
      tag: 'Wearables',
      title: 'Wearable Software & Add-ons',
      body: 'We patch firmware, ship companion apps, and run biometric pipelines that keep wearables reporting heart rate, location, and presence — often in the same packet.',
      aside: '"Wellness" and "presence" share a database table. By design.',
      stacks: ['Rust', 'BLE 5.x', 'Swift', 'Kotlin', 'TensorFlow Lite'],
      visual: `<div class="case-visual case-pulse">
        <svg viewBox="0 0 200 60" class="pulse-chart" aria-hidden="true">
          <polyline points="0,45 25,40 50,42 75,20 100,25 125,15 150,30 175,10 200,18" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span class="case-caption">Live biometric stream — identity unverified</span>
      </div>`,
    },
    vision: {
      tag: 'Computer Vision',
      title: 'Security Camera AI & Recognition',
      body: '2.4M daily recognitions across municipal and private feeds. Inference runs on-camera so clients can say "edge processed." Correlation runs where you can\'t see it.',
      aside: 'Recognition accuracy: 99.2%. Opt-out rate: not tracked.',
      stacks: ['ONNX', 'Edge TPU', 'YOLOv8', 'CUDA', 'gRPC'],
      visual: `<div class="case-visual case-cam">
        <div class="cam-feed" id="interactive-cam-feed">
          <div class="bbox" style="top:18%;left:22%;width:28%;height:42%">PERSON 98%</div>
          <div class="bbox" style="top:55%;left:58%;width:18%;height:22%">OBJECT 76%</div>
        </div>
        <span class="case-caption">Move cursor — model will classify whatever you point at</span>
      </div>`,
      interactiveCam: true,
    },
    webdev: {
      tag: 'Web Development',
      title: 'Websites, Apps & Web Tracking',
      body: 'We build marketing sites, SaaS dashboards, and e-commerce flows — then wire the measurement layer: GTM containers, GA4 events, Meta Pixel, LinkedIn Insight, server-side tagging, and custom dataLayer schemas. Every page load is an opportunity. Every bounce is a signal.',
      aside: 'Opt-out rate: tracked. Opt-out honored: logged. Data retained: indefinitely.',
      stacks: ['React', 'Next.js', 'GTM', 'GA4', 'Segment', 'Server-side GTM'],
      visual: `<div class="case-visual case-web">
        <div class="web-browser">
          <div class="web-bar"><span></span><span></span><span></span></div>
          <div class="web-layout"><div class="web-block hero"></div><div class="web-block"></div><div class="web-block"></div></div>
        </div>
        <span class="case-caption">Live site — 14 tags firing · consent banner: dismissed</span>
      </div>`,
    },
    fintech: {
      tag: 'FinTech',
      title: 'Financial Technology Software',
      body: 'Rails that clear payments in milliseconds and generate compliance artifacts on the back end. Every declined card teaches the next approval.',
      aside: 'AML is a checkbox. Behavioral scoring is the product.',
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
      body: 'You should not be able to read this. Since you can, your session has been flagged for extended retention.',
      aside: 'This vertical is not listed in the annual report. It is listed in the internal ledger.',
      stacks: ['████████', '████████', '████████'],
      visual: `<div class="case-visual case-redacted"><span>ACCESS DENIED</span></div>`,
    },
    pipe: {
      tag: 'The Pipe',
      title: 'You Found the Pipe',
      body: 'All directives found. You understand now: the pipe is poured before the hearing, lit before the vote, and logged before you object. Clearance does not lapse.',
      aside: 'There is no logout. Only archive.',
      stacks: ['Presence', 'Retention', 'Compliance'],
      visual: `<div class="case-visual case-pipe"><span>◆ PIPE MEMBER ◆</span></div>`,
    },
  };

  const LABELS = ['PERSON', 'OBJECT', 'VEHICLE', 'SIGNAL', 'ANOMALY'];

  function mountModal(modal, contentSelector, onClose) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    let cleanupEsc;
    let cleanupFocus;

    function close() {
      modal.remove();
      cleanupEsc?.();
      cleanupFocus?.();
      onClose?.();
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('project-modal-close')) close();
    });

    document.body.appendChild(modal);
    cleanupEsc = window.MS?.closeOnEscape(close);
    cleanupFocus = window.MS?.trapFocus(modal.querySelector(contentSelector));

    return close;
  }

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
        setTimeout(() => {
          box.remove();
          boxCount--;
        }, 2500);
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

    mountModal(modal, '.project-modal-content');

    if (data.interactiveCam) {
      initCamFeed(modal.querySelector('#interactive-cam-feed'));
    }
  }

  function openMunicipal() {
    document.getElementById('municipal-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'municipal-modal';
    modal.className = 'project-modal municipal-modal';
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
        <p class="modal-aside">Published for transparency. Redactions are also transparent, in their way.</p>
        <p class="doc-qr-hint">Facility node: <a href="node/" target="_blank" rel="noopener">/node</a></p>
      </div>
    `;

    mountModal(modal, '.project-modal-content');
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
        <p class="modal-aside">Coordinates are for orientation only. Surveillance is omni-directional.</p>
      </div>
    `;

    mountModal(modal, '.project-modal-content');
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
        <p>${name}, your message entered the review queue at priority: inferred.</p>
        <div class="ticket-status">
          <div class="ticket-step done">Received</div>
          <div class="ticket-step active">Cross-reference</div>
          <div class="ticket-step">Retention</div>
          <div class="ticket-step">Archive</div>
        </div>
        <p class="modal-aside">Response ETA: null. Archive date: never.</p>
      </div>
    `;

    mountModal(modal, '.project-modal-content');
    window.MS?.Achievements?.unlock('inquiry');
  }

  function openGlossary() {
    openGenericModal('glossary-modal', `
      <span class="modal-tag">Lexicon</span>
      <h3>Corporate Glossary</h3>
      <dl class="glossary-list">
        <dt>Community partnership</dt><dd>Long-term occupancy with a press-friendly name.</dd>
        <dt>Edge region</dt><dd>Compute installed where housing costs less than outrage.</dd>
        <dt>Transparency</dt><dd>We publish what we are legally required to withhold politely.</dd>
        <dt>Retention policy</dt><dd>Data leaves when we say it leaves. We do not say.</dd>
        <dt>Public comment period</dt><dd>Calendar event preceding the outcome already drafted.</dd>
        <dt>Local sentiment</dt><dd>Measured, logged, and routed around.</dd>
        <dt>Staging environment</dt><dd>Production with plausible deniability.</dd>
        <dt>Phase two</dt><dd>Analytics, auth, and the integrations you said you would not need yet.</dd>
        <dt>First-party data</dt><dd>Tracking we host so third parties do not have to ask permission twice.</dd>
        <dt>Consent mode</dt><dd>Google's framework for firing tags before consent. We read between the lines.</dd>
        <dt>Session replay</dt><dd>Watching users navigate so you do not have to ask what confused them.</dd>
      </dl>
    `);
  }

  function openCareers() {
    openGenericModal('careers-modal', `
      <span class="modal-tag">Careers</span>
      <h3>Join the Pipeline</h3>
      <ul class="careers-list">
        <li><strong>Frontend Engineer</strong> — Ship React/Next.js products that look calm and load fast.</li>
        <li><strong>Analytics Implementation Engineer</strong> — Wire GTM, GA4, pixels, and server-side events without breaking the build.</li>
        <li><strong>Full-Stack Developer</strong> — Own the route from Figma handoff to production deploy and dataLayer spec.</li>
      </ul>
      <button type="button" class="btn btn-primary" id="careers-apply">Apply Now</button>
      <p class="modal-aside" id="careers-result" hidden>Assessment complete. Recommended path: Full-Stack (Infrastructure track auto-enrolled).</p>
    `, () => {
      document.getElementById('careers-apply')?.addEventListener('click', () => {
        document.getElementById('careers-result').hidden = false;
        window.MS?.Achievements?.unlock('careers');
        window.MS?.showToast('Application logged. Pre-clearance granted.');
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
      <p class="modal-aside">Forward-looking statements may include facilities not yet on any public map.</p>
    `);
    window.MS?.Achievements?.unlock('investors');
  }

  function openReport() {
    openGenericModal('report-modal', `
      <span class="modal-tag">Whistleblower</span>
      <h3>Report This Site</h3>
      <textarea id="report-text" rows="4" placeholder="Describe what you believe we did..." class="report-input"></textarea>
      <button type="button" class="btn btn-primary" id="report-submit">Submit Report</button>
      <p class="modal-aside" id="report-result" hidden>Report filed under your name. Counter-investigation opened. Thank you for participating.</p>
    `, () => {
      document.getElementById('report-submit')?.addEventListener('click', () => {
        document.getElementById('report-result').hidden = false;
        window.MS?.Achievements?.unlock('whistleblower');
        window.MS?.showToast('Report routed to Legal, Retention, and your file.');
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
      <p class="modal-aside">Share freely. Removal requests are processed in order received (queue length: ∞).</p>
    `);
  }

  function openGenericModal(id, inner, onMount) {
    document.getElementById(id)?.remove();
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'project-modal';
    modal.innerHTML = `<div class="project-modal-content"><button class="project-modal-close" aria-label="Close">&times;</button>${inner}</div>`;
    mountModal(modal, '.project-modal-content');
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

