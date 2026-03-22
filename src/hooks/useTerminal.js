/**
 * useTerminal — Core state management for the terminal engine.
 * Manages history buffer, command dispatch, and command history navigation.
 * Input is sanitized before processing to prevent XSS — standard practice.
 */
import { useState, useCallback } from 'react'

// ─── Command Data ────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    perms: 'drwxr-xr-x',
    size: '4.2K',
    date: 'Jan 15',
    name: 'NetStrike',
    desc: 'Custom C2 framework for red team engagements.',
    color: 'muted',
  },
  {
    perms: '-rwxr-xr-x',
    size: '18K',
    date: 'Feb 03',
    name: 'VulnScan.sh',
    desc: 'Automated vulnerability scanner (Bash + Python).',
    color: 'accent',
  },
  {
    perms: '-rwxr-xr-x',
    size: '31K',
    date: 'Feb 28',
    name: 'PacketGhost',
    desc: 'Passive network traffic analyzer with anomaly detection.',
    color: 'accent',
  },
  {
    perms: '-rw-r--r--',
    size: '9.1K',
    date: 'Mar 10',
    name: 'CTF-Writeups',
    desc: 'Documented solutions for HackTheBox & TryHackMe challenges.',
    color: 'primary',
  },
]

const COMMANDS = {
  help: {
    description: 'List all available commands',
  },
  whoami: {
    description: 'Display user profile and bio',
  },
  ls: {
    description: 'List projects directory',
  },
  clear: {
    description: 'Clear the terminal screen',
  },
  'ls -la': {
    description: 'List projects in long format',
  },
  'ls ./projects': {
    description: 'List projects directory',
  },
}

// ─── Line Factory Helpers ────────────────────────────────────────────────────

const line = (text, type = 'output', id = Math.random()) => ({ id, text, type })

// ─── Command Handlers ─────────────────────────────────────────────────────────

function cmdHelp() {
  return [
    line(''),
    line('┌─────────────────────────────────────────────────────┐', 'dim'),
    line('│           AVAILABLE COMMANDS                        │', 'dim'),
    line('└─────────────────────────────────────────────────────┘', 'dim'),
    line(''),
    line('  help          — show this help menu', 'output'),
    line('  whoami        — display bio & profile', 'output'),
    line('  ls            — list all projects', 'output'),
    line('  clear         — clear the terminal screen', 'output'),
    line(''),
    line('  Coming soon:', 'muted'),
    line('  skills        — view technical skills (top -u skills)', 'muted'),
    line('  contact       — find me online (traceroute me)', 'muted'),
    line('  nmap          — scan the portfolio tech stack', 'muted'),
    line('  decrypt       — unlock secret files [EASTER EGG]', 'muted'),
    line(''),
    line('  Pro tip: Press ↑ / ↓ to navigate command history.', 'dim'),
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
    line('  Permissions   Size   Date      Name', 'dim'),
    line('  ─────────────────────────────────────────────────', 'dim'),
    ...PROJECTS.map((p) =>
      line(
        `  ${p.perms}  ${p.size.padStart(5)}  ${p.date} ${year}  ${p.name}`,
        p.color === 'accent' ? 'accent' : p.color === 'muted' ? 'muted' : 'output',
      ),
    ),
    line(''),
    line(
      '  [+x] = has live demo  |  cyan = executable  |  green = readable',
      'dim',
    ),
    line('  Type `cat <project_name>` for details.', 'dim'),
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
