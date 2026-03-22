import { useEffect, useRef, useState, useCallback } from 'react'
import { useTerminal } from '../hooks/useTerminal'
import './Terminal.css'

// Tab-completion dictionary
const COMPLETABLE = [
  'help',
  'whoami',
  'ls',
  'ls -la',
  'ls ./projects',
  'clear',
  'cat',
  'cat projects/vps.txt',
  'cat projects/portfolio.txt',
  'contact',
  'socials',
  'skills',
  'nmap',
  'decrypt',
  'sudo',
]

function HistoryLine({ item }) {
  return (
    <div
      className={`terminal-line terminal-line--${item.type}`}
      // We never inject raw HTML — output is always rendered as text content
      // dangerouslySetInnerHTML is intentionally avoided for XSS safety
    >
      {item.text}
    </div>
  )
}

export default function Terminal() {
  const { history, executeCommand, navigateHistory } = useTerminal()
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(true)

  const inputRef = useRef(null)
  const historyEndRef = useRef(null)
  const containerRef = useRef(null)

  // Auto-scroll to bottom whenever history changes
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Click anywhere on terminal → refocus input
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus()
    setFocused(true)
  }, [])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        executeCommand(inputValue)
        setInputValue('')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = navigateHistory('up', inputValue)
        setInputValue(prev)
        // Move cursor to end on next tick
        setTimeout(() => {
          const inp = inputRef.current
          if (inp) inp.setSelectionRange(inp.value.length, inp.value.length)
        }, 0)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = navigateHistory('down', inputValue)
        setInputValue(next)
      } else if (e.key === 'Tab') {
        e.preventDefault()
        // Tab completion — match against known commands
        const partial = inputValue.toLowerCase()
        if (!partial) return
        const match = COMPLETABLE.find((cmd) => cmd.startsWith(partial))
        if (match) setInputValue(match)
      }
    },
    [inputValue, executeCommand, navigateHistory],
  )

  return (
    <main
      className="terminal"
      ref={containerRef}
      onClick={handleContainerClick}
      aria-label="Interactive terminal"
    >
      {/* Scanline CRT overlay */}
      <div className="terminal__scanlines" aria-hidden="true" />

      {/* History buffer */}
      <section
        className="terminal__history"
        aria-live="polite"
        aria-label="Terminal output history"
      >
        {history.map((item) => (
          <HistoryLine key={item.id} item={item} />
        ))}
        {/* Scroll anchor */}
        <div ref={historyEndRef} />
      </section>

      {/* Active prompt row */}
      <div className="terminal__prompt-row" aria-label="Command prompt">
        <span className="terminal__prompt-user">guest</span>
        <span className="terminal__prompt-at">@</span>
        <span className="terminal__prompt-host">sec-eng</span>
        <span className="terminal__prompt-colon">:</span>
        <span className="terminal__prompt-path">~</span>
        <span className="terminal__prompt-dollar">$&nbsp;</span>
        <div className="terminal__input-wrapper">
          <input
            ref={inputRef}
            id="terminal-input"
            className="terminal__input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            aria-label="Terminal command input"
          />
          {/* Blinking block cursor — shown when input is empty and focused */}
          {focused && inputValue === '' && (
            <span className="terminal__cursor" aria-hidden="true" />
          )}
        </div>
      </div>
    </main>
  )
}
