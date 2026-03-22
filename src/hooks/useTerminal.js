/**
 * useTerminal — Core state management for the terminal engine.
 * Manages history buffer, command dispatch, and command history navigation.
 * Input is sanitized before processing to prevent XSS — standard practice.
 */
import { useState, useCallback } from 'react'

// ─── Data Layer ───────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    perms: 'drwxr-xr-x',
    size: '12K',
    date: 'Jan 20',
    name: 'vps-infrastructure',
    file: 'vps.txt',
    desc: 'Self-hosting PaaS on Ubuntu 24.04 with Coolify.',
    color: 'accent',
  },
  {
    perms: '-rwxr-xr-x',
    size: '31K',
    date: 'Mar 22',
    name: 'terminal-portfolio',
    file: 'portfolio.txt',
    desc: 'This terminal — React + Vite, CRT aesthetics, XSS-safe engine.',
    color: 'primary',
  },
]

// ─── Project Detail Files ─────────────────────────────────────────────────────
// Accessible via: cat projects/vps.txt  |  cat projects/portfolio.txt

const PROJECT_FILES = {
  'vps.txt': () => [
    line(''),
    line('  ┌──────────────────────────────────────────────────────────┐', 'dim'),
    line('  │  PROJECT: VPS Infrastructure & PaaS                      │', 'dim'),
    line('  └──────────────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  Status   : ● Live in production', 'accent'),
    line('  Stack    : Ubuntu 24.04 · Coolify · NGINX · Certbot SSL', 'output'),
    line('  Domain   : Custom domain w/ DNS A-record (Cloudflare)', 'output'),
    line('  Auth     : SSH key-pair only — password auth disabled', 'output'),
    line('  Firewall : UFW — only ports 22/tcp, 80/tcp, 443/tcp open', 'output'),
    line(''),
    line('  ┌──────────────────────────────────────────────────────────┐', 'dim'),
    line('  │  HIGHLIGHTS                                              │', 'dim'),
    line('  └──────────────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  [+]  Provisioned a bare-metal VPS (Ubuntu 24.04 LTS)', 'output'),
    line('  [+]  Deployed Coolify as a self-hosted PaaS layer', 'output'),
    line('  [+]  Configured NGINX reverse proxy with HTTPS (Let\'s Encrypt)', 'output'),
    line('  [+]  Hardened SSH: disabled root & password login', 'output'),
    line('  [+]  UFW configured — minimal attack surface', 'output'),
    line('  [+]  Automated SSL renewal via systemd timer', 'output'),
    line(''),
    line('  ┌──────────────────────────────────────────────────────────┐', 'dim'),
    line('  │  SECURITY NOTES                                          │', 'dim'),
    line('  └──────────────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  All services run behind NGINX reverse proxy.', 'muted'),
    line('  SSH access restricted to key-based auth only.', 'muted'),
    line('  Regular unattended-upgrades for security patches.', 'muted'),
    line(''),
    line('  GitHub   : github.com/shalahuddin', 'link'),
    line(''),
  ],
  'portfolio.txt': () => [
    line(''),
    line('  ┌──────────────────────────────────────────────────────────┐', 'dim'),
    line('  │  PROJECT: Terminal-Based Security Portfolio               │', 'dim'),
    line('  └──────────────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  Status   : ● You are inside it right now', 'accent'),
    line('  Stack    : React 18 · Vite 6 · Vanilla CSS', 'output'),
    line('  Hosted   : Self-hosted via Coolify on personal VPS', 'output'),
    line('  Design   : CRT / green-phosphor terminal aesthetic', 'output'),
    line(''),
    line('  ┌──────────────────────────────────────────────────────────┐', 'dim'),
    line('  │  HIGHLIGHTS                                              │', 'dim'),
    line('  └──────────────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  [+]  Custom command engine with dispatch table', 'output'),
    line('  [+]  XSS-safe input — raw HTML is escaped before dispatch', 'output'),
    line('  [+]  Tab auto-completion for all commands', 'output'),
    line('  [+]  Command history navigation (↑ / ↓)', 'output'),
    line('  [+]  CRT scanline + phosphor glow CSS effects', 'output'),
    line('  [+]  Auto-scroll to latest output on every command', 'output'),
    line('  [+]  Animated boot sequence with skip-on-click', 'output'),
    line(''),
    line('  ┌──────────────────────────────────────────────────────────┐', 'dim'),
    line('  │  ARCHITECTURE                                            │', 'dim'),
    line('  └──────────────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  src/', 'muted'),
    line('  ├── hooks/useTerminal.js   — command engine & state', 'muted'),
    line('  ├── components/Terminal.jsx — interactive shell UI', 'muted'),
    line('  └── components/Terminal.css — CRT theme & typography', 'muted'),
    line(''),
    line('  GitHub   : github.com/shalahuddin/portfolio', 'link'),
    line(''),
  ],
}

const COMMANDS = {
  help:            { description: 'List all available commands' },
  whoami:          { description: 'Display user profile and bio' },
  ls:              { description: 'List projects directory' },
  'ls -la':        { description: 'List projects in long format' },
  'ls ./projects': { description: 'List projects directory' },
  clear:           { description: 'Clear the terminal screen' },
  cat:             { description: 'Read a project file (e.g. cat projects/vps.txt)' },
  contact:         { description: 'Display contact & social links' },
  socials:         { description: 'Alias for contact' },
}

// ─── Line Factory Helpers ─────────────────────────────────────────────────────

const line = (text, type = 'output', id = Math.random()) => ({ id, text, type })

// ─── Command Handlers ─────────────────────────────────────────────────────────

function cmdHelp() {
  return [
    line(''),
    line('  ┌─────────────────────────────────────────────────────┐', 'dim'),
    line('  │           AVAILABLE COMMANDS                        │', 'dim'),
    line('  └─────────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  help          — show this help menu', 'output'),
    line('  whoami        — display bio & profile', 'output'),
    line('  ls            — list all projects', 'output'),
    line('  cat <file>    — read a project file', 'output'),
    line('  contact       — find me online (GitHub · LinkedIn · Email)', 'output'),
    line('  clear         — clear the terminal screen', 'output'),
    line(''),
    line('  Coming soon:', 'muted'),
    line('  skills        — view technical skills (top -u skills)', 'muted'),
    line('  nmap          — scan the portfolio tech stack', 'muted'),
    line('  decrypt       — unlock secret files [EASTER EGG]', 'muted'),
    line(''),
    line('  Pro tip: Press ↑ / ↓ to navigate command history.', 'dim'),
    line('  Pro tip: Press Tab to auto-complete a command.', 'dim'),
    line(''),
  ]
}

function cmdWhoami() {
  return [
    line(''),
    line('  ██╗    ██╗██╗  ██╗ ██████╗  █████╗ ███╗   ███╗██╗', 'ascii'),
    line('  ██║    ██║██║  ██║██╔═══██╗██╔══██╗████╗ ████║██║', 'ascii'),
    line('  ██║ █╗ ██║███████║██║   ██║███████║██╔████╔██║██║', 'ascii'),
    line('  ██║███╗██║██╔══██║██║   ██║██╔══██║██║╚██╔╝██║██║', 'ascii'),
    line('  ╚███╔███╔╝██║  ██║╚██████╔╝██║  ██║██║ ╚═╝ ██║██║', 'ascii'),
    line('   ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝', 'ascii'),
    line(''),
    line('  ┌────────────────────────────────────────────────┐', 'dim'),
    line('  │  USER PROFILE                                  │', 'dim'),
    line('  └────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  Name     : Shalahuddin', 'output'),
    line('  Role     : Cyber Security Engineering Student', 'output'),
    line('  Focus    : Red Team Ops · Network Security · CTF', 'output'),
    line('  Location : Indonesia', 'output'),
    line(''),
    line('  ┌────────────────────────────────────────────────┐', 'dim'),
    line('  │  PLATFORMS                                     │', 'dim'),
    line('  └────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  HackTheBox  : Hacker rank                        ', 'accent'),
    line('  TryHackMe   : Active — top 10%                   ', 'accent'),
    line('  GitHub      : github.com/shalahuddin             ', 'accent'),
    line(''),
    line('  Type `contact` to see all my links.', 'dim'),
    line(''),
    line('  "Security is not a product, but a process."', 'dim'),
    line('   — Bruce Schneier', 'muted'),
    line(''),
  ]
}

function cmdLs() {
  const now = new Date()
  const year = now.getFullYear()

  return [
    line(''),
    line(`total ${PROJECTS.length * 4}`, 'muted'),
    line('  Permissions   Size   Date        Name                    Description', 'dim'),
    line('  ──────────────────────────────────────────────────────────────────────', 'dim'),
    ...PROJECTS.map((p) =>
      line(
        `  ${p.perms}  ${p.size.padStart(4)}  ${p.date} ${year}  ${p.name.padEnd(22)}  ${p.desc}`,
        p.color === 'accent' ? 'accent' : p.color === 'primary' ? 'output' : 'output',
      ),
    ),
    line(''),
    line('  Type `cat projects/<name>.txt` for full details.', 'dim'),
    line('  Example: cat projects/vps.txt', 'dim'),
    line(''),
  ]
}

function cmdCat(args) {
  if (!args || !args.trim()) {
    return [
      line(''),
      line('  Usage: cat projects/<file.txt>', 'error'),
      line('  Available files:', 'muted'),
      ...PROJECTS.map((p) => line(`    projects/${p.file}`, 'accent')),
      line(''),
    ]
  }

  // Normalize: strip leading "projects/" or "./"
  const normalized = args
    .trim()
    .replace(/^\.?\/?projects\//, '')
    .toLowerCase()

  const handler = PROJECT_FILES[normalized]

  if (handler) {
    return handler()
  }

  // Unknown file
  return [
    line(''),
    line(`  cat: ${args.trim()}: No such file or directory`, 'error'),
    line(''),
    line('  Available project files:', 'muted'),
    ...PROJECTS.map((p) => line(`    projects/${p.file}`, 'accent')),
    line(''),
  ]
}

function cmdContact() {
  return [
    line(''),
    line('  ┌────────────────────────────────────────────────┐', 'dim'),
    line('  │  FIND ME ONLINE                                │', 'dim'),
    line('  └────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  GitHub     →  github.com/shalahuddin', 'link'),
    line('  LinkedIn   →  linkedin.com/in/shalahuddin', 'link'),
    line('  Email      →  shalahuddin@proton.me', 'link'),
    line(''),
    line('  ┌────────────────────────────────────────────────┐', 'dim'),
    line('  │  CTF & SECURITY                                │', 'dim'),
    line('  └────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  HackTheBox →  hackthebox.eu/profile/shalahuddin', 'link'),
    line('  TryHackMe  →  tryhackme.com/p/shalahuddin', 'link'),
    line(''),
    line('  Response time: usually < 24h is. DMs are open.', 'muted'),
    line(''),
  ]
}

function cmdNotFound(input) {
  return [
    line(''),
    line(
      `  bash: ${input}: command not found`,
      'error',
    ),
    line('  Type `help` for a list of available commands.', 'muted'),
    line(''),
  ]
}

// ─── Easter Eggs ──────────────────────────────────────────────────────────────

function cmdSudo() {
  return [
    line(''),
    line('  [sudo] password for guest: ', 'warning'),
    line('  Sorry, you are not in the sudoers file.', 'error'),
    line('  This incident will be reported. 👁️', 'error'),
    line(''),
  ]
}

function cmdRmRf() {
  return [
    line(''),
    line('  ⚠  Nice try.', 'warning'),
    line('  rm: cannot remove `/`: Permission denied', 'error'),
    line('  Guest accounts don\'t have root privileges.', 'muted'),
    line(''),
  ]
}

// ─── Command Dispatcher ───────────────────────────────────────────────────────

function dispatch(raw) {
  // Sanitizing input to prevent XSS — standard practice
  const sanitized = raw
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()

  const normalized = sanitized.toLowerCase()

  if (normalized === 'help') return { lines: cmdHelp(), clear: false }
  if (normalized === 'whoami') return { lines: cmdWhoami(), clear: false }
  if (
    normalized === 'ls' ||
    normalized === 'ls -la' ||
    normalized === 'ls ./projects' ||
    normalized === 'ls -la ./projects'
  ) {
    return { lines: cmdLs(), clear: false }
  }
  if (normalized === 'clear') return { lines: [], clear: true }

  // cat command — extract args after "cat "
  if (normalized === 'cat' || normalized.startsWith('cat ')) {
    const args = sanitized.slice(3).trim()  // everything after "cat"
    return { lines: cmdCat(args), clear: false }
  }

  if (normalized === 'contact' || normalized === 'socials') {
    return { lines: cmdContact(), clear: false }
  }

  if (normalized === 'sudo' || normalized.startsWith('sudo ')) return { lines: cmdSudo(), clear: false }
  if (normalized === 'rm -rf /' || normalized === 'rm -rf *') return { lines: cmdRmRf(), clear: false }

  return { lines: cmdNotFound(sanitized), clear: false }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const WELCOME_LINES = [
  line(''),
  line('  ███████╗███████╗ ██████╗      ███████╗███╗   ██╗ ██████╗', 'ascii'),
  line('  ██╔════╝██╔════╝██╔════╝      ██╔════╝████╗  ██║██╔════╝', 'ascii'),
  line('  ███████╗█████╗  ██║           █████╗  ██╔██╗ ██║██║  ███╗', 'ascii'),
  line('  ╚════██║██╔══╝  ██║           ██╔══╝  ██║╚██╗██║██║   ██║', 'ascii'),
  line('  ███████║███████╗╚██████╗      ███████╗██║ ╚████║╚██████╔╝', 'ascii'),
  line('  ╚══════╝╚══════╝ ╚═════╝      ╚══════╝╚═╝  ╚═══╝ ╚═════╝', 'ascii'),
  line(''),
  line('  ─────────────────────────────────────────────────────────', 'dim'),
  line('  Cyber Security Engineering Student  ·  Red Team Enthusiast', 'muted'),
  line('  ─────────────────────────────────────────────────────────', 'dim'),
  line(''),
  line('  Type `help` to list all commands.', 'output'),
  line('  Type `whoami` to view my profile.', 'output'),
  line('  Type `ls` to browse projects.', 'output'),
  line(''),
]

export function useTerminal() {
  const [history, setHistory] = useState(WELCOME_LINES)
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const executeCommand = useCallback((rawInput) => {
    const trimmed = rawInput.trim()
    if (!trimmed) return null

    // Append the user's input line + output to history
    const inputLine = line(`guest@sec-eng:~$ ${trimmed}`, 'input')
    const { lines: outputLines, clear } = dispatch(trimmed)

    if (clear) {
      setHistory([])
    } else {
      setHistory((prev) => [...prev, inputLine, ...outputLines])
    }

    // Save to command navigation history
    setCmdHistory((prev) => [trimmed, ...prev])
    setHistoryIndex(-1)

    return null
  }, [])

  const navigateHistory = useCallback(
    (direction, currentInput) => {
      if (cmdHistory.length === 0) return currentInput

      let nextIndex = historyIndex
      if (direction === 'up') {
        nextIndex = Math.min(historyIndex + 1, cmdHistory.length - 1)
      } else {
        nextIndex = Math.max(historyIndex - 1, -1)
      }

      setHistoryIndex(nextIndex)
      return nextIndex === -1 ? '' : cmdHistory[nextIndex]
    },
    [cmdHistory, historyIndex],
  )

  return { history, executeCommand, navigateHistory }
}
