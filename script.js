// Mobile menu toggle (keeps compatibility)
const hamburger = document.querySelector('.hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const nav = document.querySelector('.nav-links');
        if (nav) nav.classList.toggle('active');
    });
}

/* Matrix effect (supports full #matrix or small #smatrix) */
const fullCanvas = document.getElementById('matrix');
const smallCanvas = document.getElementById('smatrix');
const activeCanvas = fullCanvas || smallCanvas;
const activeCtx = activeCanvas && activeCanvas.getContext ? activeCanvas.getContext('2d') : null;
let w, h, columns, drops, fontSize;

function setupCanvas() {
    if (!activeCanvas || !activeCtx) return;
    const dpr = window.devicePixelRatio || 1;
    // If we have the full canvas, size to window. If small, size to element's CSS dims.
    if (activeCanvas.id === 'matrix') {
        w = activeCanvas.width = Math.floor(window.innerWidth * dpr);
        h = activeCanvas.height = Math.floor(window.innerHeight * dpr);
        activeCanvas.style.width = window.innerWidth + 'px';
        activeCanvas.style.height = window.innerHeight + 'px';
        fontSize = 16;
    } else {
        // For small canvas, use its client size
        const rect = activeCanvas.getBoundingClientRect();
        w = activeCanvas.width = Math.floor(rect.width * dpr);
        h = activeCanvas.height = Math.floor(rect.height * dpr);
        activeCanvas.style.width = rect.width + 'px';
        activeCanvas.style.height = rect.height + 'px';
        fontSize = 12; // smaller font for small matrix
    }
    activeCtx.scale(dpr, dpr);
    columns = Math.floor((w / dpr) / fontSize);
    drops = Array.from({ length: columns }).map(() => Math.random() * -1000);
}

function drawMatrix() {
    if (!activeCtx) return;
    // fade
    activeCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    activeCtx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);
    activeCtx.fillStyle = '#33ff33';
    activeCtx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        activeCtx.fillText(text, x, y);
        if (y > (activeCanvas.id === 'matrix' ? window.innerHeight : parseInt(activeCanvas.style.height || '240')) && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}

function loop() {
    drawMatrix();
    requestAnimationFrame(loop);
}

window.addEventListener('resize', () => {
    // small debounce
    clearTimeout(window._matrixResize);
    window._matrixResize = setTimeout(() => setupCanvas(), 150);
});

if (activeCanvas && activeCtx) {
    setupCanvas();
    requestAnimationFrame(loop);
}

/* Terminal typing simulation */
const terminalOutput = document.getElementById('terminal-output');
const typingEl = document.getElementById('typing');
const terminal = document.getElementById('terminal');

const lines = [
    'Initializing INTELX v2.7',
    'Loading modules: net, decrypt, scanner',
    'Establishing secure shell... OK',
    'Scanning network: 192.168.0.0/24',
    'Found 7 hosts, starting probe...',
    'Probe complete. Open ports: 22,80,443',
    'Saving report to /var/log/intelx/report-2025-10-17.log',
    'All systems nominal.'
];

let lineIndex = 0;
let charIndex = 0;
let typingSpeed = 24; // ms per char

// For interactive terminal
let inputBuffer = '';

function prompt() {
    typingEl.textContent = '';
    inputBuffer = '';
    if (terminal) terminal.focus();
}

function appendLine(text) {
    if (!terminalOutput) return;
    const p = document.createElement('p');
    p.textContent = text;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function typeNextChar() {
    if (lineIndex >= lines.length) {
        // loop: after a pause, clear some lines and restart for effect
        setTimeout(() => {
            if (terminalOutput) terminalOutput.innerHTML = '';
            lineIndex = 0;
            charIndex = 0;
        }, 4000);
        typingEl.textContent = '';
        return;
    }

    const line = lines[lineIndex];
    if (charIndex <= line.length) {
        typingEl.textContent = line.slice(0, charIndex);
        charIndex++;
        setTimeout(typeNextChar, typingSpeed + Math.random() * 80);
    } else {
        // commit line and move to next
        appendLine(line);
        lineIndex++;
        charIndex = 0;
        typingEl.textContent = '';
        setTimeout(typeNextChar, 600 + Math.random() * 800);
    }
}

// If terminal exists and has output, pre-fill a couple of lines so text is visible immediately
if (terminalOutput) {
    appendLine(lines[0]);
    appendLine(lines[1]);
    // start typing from the third line
    lineIndex = 2;
}

setTimeout(typeNextChar, 800);

// Accessibility: allow focus to terminal to pause animation (optional)
if (terminalOutput) {
    terminalOutput.addEventListener('focus', () => { /* placeholder */ });
}

/* Interactive terminal input handling */
document.addEventListener('keydown', (e) => {
    // Only handle when terminal exists and is focused
    if (!terminal) return;
    if (document.activeElement !== terminal) return;

    if (e.key === 'Backspace') {
        e.preventDefault();
        inputBuffer = inputBuffer.slice(0, -1);
        typingEl.textContent = inputBuffer;
        return;
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = inputBuffer.trim();
        appendLine('root@intelx:~$ ' + cmd);
        runCommand(cmd);
        inputBuffer = '';
        typingEl.textContent = '';
        return;
    }

    // Printable characters
    if (e.key.length === 1) {
        inputBuffer += e.key;
        typingEl.textContent = inputBuffer;
    }
});

function runCommand(cmd) {
    const parts = cmd.split(' ').filter(Boolean);
    const base = parts[0] ? parts[0].toLowerCase() : '';
    if (!base) return;

    if (base === 'help') {
        appendLine('Available commands: help, scan [target], clear, download-report');
        appendLine('\nhelp — show this help message');
        appendLine('scan [target] — run a quick network scan (simulated)');
        appendLine('clear — clear the terminal output');
        appendLine('download-report — download the last generated scan report (if any)');
        appendLine('\nI will help those who got scammed. If you were scammed, contact support@intelx.example for guidance.');
        return;
    }

    if (base === 'clear') { if (terminalOutput) terminalOutput.innerHTML = ''; return; }

    if (base === 'scan') {
        const target = parts[1] || 'local-network';
        appendLine('Starting simulated scan on: ' + target);
        appendLine('Scanning...');
        // produce a fake report after a delay
        setTimeout(() => {
            const report = generateScanReport(target);
            appendLine('Scan complete. Summary: ' + report.summary);
            appendLine('Use download-report to save a copy.');
            // store last report on window for download
            window._intelx_last_report = report;
                // reveal the home banner (copy of resources nav) when scan completes
                const hb = document.getElementById('home-banner');
                if (hb) hb.style.display = 'block';
        }, 1200 + Math.random() * 900);
        return;
    }

    if (base === 'download-report' || base === 'report') {
        const r = window._intelx_last_report;
        if (!r) { appendLine('No report available. Run a scan first.'); return; }
        // create downloadable blob and provide link
        const blob = new Blob([r.text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        appendLine('Report ready: ' + r.filename + ' (click link to download)');
        const a = document.createElement('a');
        a.href = url; a.download = r.filename; a.textContent = '[Download ' + r.filename + ']';
        a.style.color = '#7fff7f';
        a.style.display = 'inline-block';
        a.style.margin = '6px 0';
        if (terminalOutput) terminalOutput.appendChild(a);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        return;
    }

    appendLine('Unknown command: ' + cmd + '. Type "help" for available commands.');
}

function generateScanReport(target) {
    const now = new Date();
    const filename = `intelx-scan-${now.toISOString().replace(/[:.]/g,'-')}.txt`;
    const hosts = [
        { ip: '192.168.0.2', ports: [22, 80] },
        { ip: '192.168.0.10', ports: [80] },
        { ip: '192.168.0.15', ports: [22, 443, 3306] }
    ];
    const lines = [];
    lines.push('INTELX Scan Report');
    lines.push('Target: ' + target);
    lines.push('Generated: ' + now.toISOString());
    lines.push('');
    lines.push('Discovered hosts:');
    hosts.forEach(h => lines.push(`- ${h.ip}  open ports: ${h.ports.join(',')}`));
    lines.push('');
    lines.push('Summary: ' + hosts.length + ' hosts found.');
    const text = lines.join('\n');
    return { filename, text, summary: `${hosts.length} hosts found` };
}

// Ensure terminal is focusable on click
if (terminal) {
    terminal.addEventListener('click', () => terminal.focus());
}

// Note: Run Scan was moved to a dedicated page at scan/index.html.