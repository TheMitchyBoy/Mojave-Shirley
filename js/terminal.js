/**
 * Mojave-Shirley — Hidden terminal
 */
(function () {
  'use strict';

  const terminal = document.getElementById('terminal');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  let tailInterval = null;

  const FILES = {
    'memo.txt': [
      'INTERNAL MEMO — Q3 2025',
      'The best infrastructure is the kind nobody notices',
      'until it is everywhere.',
      '',
      'Action items:',
      '- Expand Mojave corridor capacity',
      '- Deprioritize town hall feedback loops',
      '- Rebrand protests as "community engagement spikes"',
    ],
    'protests.log': [
      '[2025-08-14] Rally detected — 240 attendees — logged',
      '[2025-09-02] Council vote delayed — outreach paused',
      '[2025-10-19] Construction permit approved — sentiment: irrelevant',
      '[2025-11-30] Water usage FOIA request — auto-response sent',
      '[2026-01-12] "Public comment period closed" banner deployed',
    ],
  };

  const COMMANDS = {
    help: () => [
      'Available commands:',
      '  help              — show this message',
      '  ls                — list files',
      '  cat <file>        — read file (memo.txt, protests.log)',
      '  status            — system status',
      '  projects          — list active verticals',
      '  datacenter        — infrastructure info',
      '  whoami            — identify session',
      '  tail -f protests.log — live protest feed',
      '  glossary          — corporate lexicon',
      '  careers           — open positions',
      '  investors         — quarterly deck',
      '  sudo              — elevated access',
      '  clear             — clear terminal',
      '  exit              — close terminal',
      '  mojave            — classified access',
      '  achievements      — directive progress',
      '  node-id           — inspect source node',
    ],
    ls: () => ['memo.txt', 'protests.log', 'partnership.pdf', '[classified]/'],
    status: () => [
      'EDGE-NODE-7 :: OPERATIONAL',
      'node-id: edge-7-mojave',
      'Uptime: 847 days, 14 hours',
      'Active inferences: 2,412,847/day',
      'Signals processed: ' + (window.MS?.Metrics?.getSignals() || '2.4M'),
      'Community objections: 14 (pending review)',
      'Protest activity: detected (non-blocking)',
    ],
    projects: () => [
      '[WEARABLES]   Biometric pipeline v3.2 — ACTIVE',
      '[VISION]      Recognition mesh — ACTIVE',
      '[APPS]        Retention engine — ACTIVE',
      '[FINTECH]     Risk inference — ACTIVE',
      '[REDACTED]    Project Mojave — ACTIVE',
    ],
    datacenter: () => {
      window.MS?.Achievements?.unlock('datacenter');
      return [
        'REGION: Mojave Corridor',
        'STATUS: Construction phase 2',
        'LOCAL SENTIMENT: mixed (ignored)',
        'POWER DRAW: 847 MW',
        'WATER USAGE: [REDACTED]',
        'JOBS CREATED: 47',
        'JOBS PROMISED: 400',
        '',
        'The datacenter is the new town square.',
        'We are always building.',
      ];
    },
    whoami: () => [
      'guest@unauthorized-session',
      'IP: logged',
      'Fingerprint: collected',
      'Duration on site: ' + Math.floor(performance.now() / 1000) + 's',
      'Interest level: elevated (you opened the terminal)',
    ],
    mojave: () => {
      window.MS?.Classified?.show();
      window.MS?.Achievements?.unlock('mojave');
      return ['Access granted.', 'Opening classified overlay...'];
    },
    achievements: () => {
      const { count, total } = window.MS?.Achievements?.getProgress() || { count: 0, total: 24 };
      return [`Directives discovered: ${count}/${total}`, `Footer: Directive Log · Finale unlocks when all others found`];
    },
    'node-id': () => {
      window.MS?.Achievements?.unlock('node_inspect');
      return [
        'node-id: edge-7-mojave',
        'Source comment verified.',
        'You inspect elements. We inspect you.',
      ];
    },
    clear: () => {
      if (terminalOutput) terminalOutput.innerHTML = '';
      stopTail();
      return null;
    },
    exit: () => {
      hide();
      return null;
    },
    glossary: () => {
      window.MS?.Modals?.openGlossary();
      window.MS?.Achievements?.unlock('glossary');
      return ['Opening corporate lexicon...'];
    },
    careers: () => {
      window.MS?.Modals?.openCareers();
      return ['Routing to Human Capital pipeline...'];
    },
    investors: () => {
      window.MS?.Modals?.openInvestors();
      return ['Loading shareholder materials...'];
    },
    sudo: () => {
      window.MS?.Redacted?.enable();
      return ['Password: accepted (not verified)', 'Redacted mode enabled.'];
    },
  };

  function print(lines, className = '') {
    if (!terminalOutput || !lines) return;
    lines.forEach((line) => {
      const div = document.createElement('div');
      div.textContent = line;
      if (className) div.className = className;
      terminalOutput.appendChild(div);
    });
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function show() {
    if (!terminal) return;
    terminal.hidden = false;
    if (terminalOutput && !terminalOutput.children.length) {
      print(['Mojave-Shirley edge terminal v2.1', 'Type "help" for commands.', ''], 'line-dim');
    }
    terminalInput?.focus();
    window.MS?.Achievements?.unlock('terminal');
  }

  function hide() {
    if (terminal) terminal.hidden = true;
    stopTail();
  }

  function stopTail() {
    if (tailInterval) {
      clearInterval(tailInterval);
      tailInterval = null;
    }
  }

  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    print(['$ ' + raw]);

    if (cmd.startsWith('cat ')) {
      const file = cmd.slice(4).trim();
      const content = FILES[file];
      if (content) print(content);
      else print([`cat: ${file}: No such file`], 'line-error');
      return;
    }

    if (cmd === 'tail -f protests.log') {
      print(['Following protests.log... (ctrl+c not supported)'], 'line-dim');
      print(FILES['protests.log']);
      let i = 0;
      stopTail();
      tailInterval = setInterval(() => {
        const msgs = [
          `[${new Date().toISOString().slice(0, 10)}] Scanner sweep — sector 7 — nominal`,
          `[${new Date().toISOString().slice(0, 10)}] Anonymous tip logged — priority: low`,
          `[${new Date().toISOString().slice(0, 10)}] Uptime maintained — objections: deprecated`,
        ];
        print([msgs[i % msgs.length]], 'line-warn');
        i++;
      }, 4000);
      return;
    }

    if (cmd === 'rm -rf conscience' || cmd === 'rm -rf conscience/') {
      window.MS?.Achievements?.unlock('conscience');
      print([
        'rm: conscience: Permission denied',
        'rm: operation logged for compliance review',
        'Nice try.',
      ], 'line-warn');
      return;
    }

    const handler = COMMANDS[cmd];
    if (handler) {
      const result = handler();
      if (result) print(result);
    } else if (cmd) {
      print([`command not found: ${cmd}`, 'type "help" for available commands'], 'line-error');
    }
  }

  terminalInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      window.MS?.Sounds?.playKeystroke();
      runCommand(val);
    }
  });

  window.MS = window.MS || {};
  window.MS.Terminal = { show, hide, print, runCommand, COMMANDS };
})();
