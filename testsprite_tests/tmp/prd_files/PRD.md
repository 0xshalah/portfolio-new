web application/stitch/projects/8723659245912491857/screens/9cb036f2a8e84b9ba86c4ff0c20bd45e
# Terminal & Code Portfolio

## Product Overview

**The Pitch:** A deeply immersive, command-line interface portfolio for a Cyber Security Engineering student. It proves technical competence instantly by forcing the user to interact with a simulated UNIX terminal environment, while adhering to strict security standards (like OWASP Top 10) and offering accessibility for non-technical users.

**For:** Technical recruiters, red team leaders, and fellow hackers looking for raw skill, CTF experience, and security engineering projects without the corporate fluff.

**Device:** desktop, mobile (via specialized virtual keyboard)

**Design Direction:** Retro-futuristic hacker terminal. Hard edges, CRT monitor glow, monospaced typography, and pure text-based layouts. 

**Inspired by:** Hacknet, Kali Linux Terminal, Retro CRT displays, Awwwards Terminal Styles.

---

## Screens

- **Boot Sequence:** Initial simulated hardware boot cycle establishing the aesthetic.
- **Main Terminal (Home):** Core CLI prompt displaying `whoami` details and available commands.
- **Projects (`ls ./projects`):** Directory listing of security tools and vulnerability research.
- **Skills (`top -u skills`):** Process-monitor style visualization of languages, tools, and CTF ranks.
- **Contact (`traceroute me`):** Network routing visualization leading to email and GitHub links.
- **GUI Escape Hatch:** A subtle, accessible toggle ("Switch to GUI Mode") for recruiters in a rush, providing a standard web interface alternative.

---

## Key Flows

**Command Execution:** User navigates the portfolio via CLI commands.

1. User is on Main Terminal -> sees blinking cursor at `guest@sec-eng:~$`.
2. User types `ls ./projects` (or clicks the suggested command) -> instant text output renders line-by-line. (Users can append a `-fast` flag or adjust speed controls to skip typing animations).
3. System prints a tabulated list of project files with read/write/execute permissions acting as link states.

**Recruiter-Proofing & UX Flow:**
- **Tab Completion:** User types partial command (e.g., `pr`) and presses `Tab` -> auto-completes to `projects`.
- **Command History:** User presses `Up` or `Down` arrows to navigate previously entered commands.

---

<details>
<summary>Design System</summary>

## Color Palette

- **Primary:** `#00FF41` - Terminal text, active borders, blinking cursor
- **Background:** `#050505` - Main screen background
- **Surface:** `#0A0A0A` - Command output blocks, modal overlays
- **Text:** `#00FF41` - Standard output text
- **Muted:** `#008F11` - Inactive files, timestamps, secondary logs
- **Accent:** `#00FFFF` - Cyan for executable files, hyperlinks, critical highlights
- **Error:** `#FF3131` - Access denied messages, invalid commands
- **Warning:** `#FFD700` - System warnings, deprecated flags

## Typography

Distinctive, rigid monospace fonts to sell the illusion of a raw terminal.

- **Headings:** VT323, 400, 24px (ASCII art headers: 12px Fira Code)
- **Body:** Fira Code, 400, 16px
- **Small text:** Fira Code, 400, 12px
- **Buttons (Commands):** Fira Code, 700, 16px

**Style notes:** `0px` border radius everywhere. `text-shadow: 0 0 5px rgba(0, 255, 65, 0.5)` on primary text for CRT glow. Subtle moving scanline overlay via CSS background pattern. Incorporate a subtle visual glitch effect (CSS distortion) when a user inputs an unauthorized command (e.g., `sudo`).

**Audio Design:** Optional audio feedback (default muted) including subtle mechanical keyboard typing sounds and a static noise burst during the boot sequence.

## Design Tokens

```css
:root {
  --color-primary: #00FF41;
  --color-background: #050505;
  --color-surface: #0A0A0A;
  --color-text: #00FF41;
  --color-muted: #008F11;
  --color-accent: #00FFFF;
  --color-error: #FF3131;
  --color-warning: #FFD700;
  --font-primary: 'Fira Code', monospace;
  --font-display: 'VT323', monospace;
  --radius: 0px;
  --spacing: 16px;
  --glow: 0 0 5px rgba(0, 255, 65, 0.5);
  --scanline-opacity: 0.1;
  --crt-curve: perspective(1000px) rotateX(0.5deg) rotateY(-0.5deg);
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}
```

</details>

---

<details>
<summary>Screen Specifications</summary>

### Boot Sequence

**Purpose:** Immersive loading screen that transitions the user into the terminal environment.

**Layout:** Top-to-bottom rapid scrolling text on a pure black background.

**Key Elements:**
- **Kernel Logs:** Rapidly printing random `[ OK ]` and `[ INFO ]` syslogs.
- **Mounting Drives:** Simulated loading of portfolio assets (`Mounting /dev/sda1...`).
- **Login Prompt:** Halts at `sec-eng login: ` before auto-typing `guest`.
- **Audio:** Brief, subtle static sound effect (if audio is enabled).

**States:**
- **Loading:** Rapid text generation (50ms interval).
- **Empty/Error:** N/A (Automated sequence).

**Components:**
- **Log Line:** 12px, `#008F11` timestamp, `#00FF41` text.

**Interactions:**
- **Click anywhere:** Skips boot sequence, jumps immediately to Main Terminal.

**Responsive:**
- **Desktop:** 80ch max-width, left-aligned.
- **Tablet/Mobile:** Adjusted width, fast-forwards animation to reduce mobile load.

### Main Terminal (Home)

**Purpose:** Central hub for navigation via simulated command line.

**Layout:** Standard terminal window. Left-aligned prompt at the bottom, command history above it. Persistent "Switch to GUI" button fixed in the corner.

**Key Elements:**
- **ASCII Art Banner:** Large stylized name at the top of the buffer.
- **MOTD (Message of the Day):** Brief bio (e.g., "Cyber Sec Engineering Student | Red Team Enthusiast").
- **Command Prompt:** `guest@sec-eng:~$` with a blinking `_` cursor.
- **Help Menu:** Auto-printed list of available commands (`help`, `projects`, `skills`, `contact`, `man`, `cat`, `nmap`, `decrypt`).

**Advanced Commands:**
- `man [command]`: Renders detailed manual pages demonstrating documentation skills.
- `cat [project_name]`: Directly prints a markdown write-up inside the terminal buffer.
- `nmap -v portfolio`: Simulates a port scan revealing the portfolio's tech stack as "open services".
- `decrypt [hash]`: A mini-game easter egg unlocking "Secret Files" (e.g., rare certifications or testimonials).

**States:**
- **Empty:** Cleared terminal (`clear` command executed).
- **Loading:** Blinking cursor waiting for input.
- **Error:** Glitch animation on prompt, prints red `--color-error` text for permission denied.

**Components:**
- **Prompt:** `#00FFFF` user/host, `#00FF41` path, `16px`.
- **Cursor:** `#00FF41` background block, 500ms blink animation.

**Interactions:**
- **Keyboard Input:** Captures keystrokes, echoes to prompt.
- **Enter Key:** Submits command, prints output to history buffer.
- **Click Command:** Clickable text alternatives for non-keyboard users that auto-fill and execute.
- **Tab/Arrows:** Tab completion and command history navigation.

**Responsive:**
- **Desktop:** 100vw/100vh, 24px padding.
- **Mobile:** Triggers a specialized "Virtual Keyboard" overlay ensuring terminal commands can be tapped easily without relying on native OS keyboards.

### Projects (`ls ./projects`)

**Purpose:** Display portfolio projects disguised as a UNIX directory listing.

**Layout:** Tabular data format mimicking `ls -la`.

**Key Elements:**
- **Command Echo:** `guest@sec-eng:~$ ls -la ./projects`
- **File List:** Table showing permissions, owner, size, date, and project name.
- **Executable Files:** Projects with live demos are marked `+x` and colored `#00FFFF`.
- **Project Descriptions:** Executing `./project_name.sh` or `cat project_name.md` prints a payload of details (stack, github link, summary).

**States:**
- **Loading:** Staggered line-by-line printing (10ms delay).
- **Error:** `bash: ./project: No such file or directory` (If user types invalid project).

**Components:**
- **File Row:** 16px, monospace layout. `drwxr-xr-x` (#008F11), `project_name` (#00FF41 or #00FFFF).

**Interactions:**
- **Click/Type `./[project]`:** Expands detailed view in the terminal buffer.
- **Hover File:** `#00FFFF` underline text decoration.

**Responsive:**
- **Desktop:** Full width table.

### Skills (`top -u skills`)

**Purpose:** Showcase technical proficiencies and CTF ranks in a dynamic process-monitor format.

**Layout:** Multi-column dashboard mimicking `htop` or `top`.

**Key Elements:**
- **System Stats Header:** Uptime, CTF rank (e.g., "HackTheBox: Hacker"), TryHackMe streak.
- **Process List (Languages/Tools):** Columns for `PID`, `USER`, `%CPU` (Proficiency level), `COMMAND` (Tool name).
- **Bar Graphs:** CPU usage bars made of ASCII characters `[|||||||   ]`.

**States:**
- **Loading:** Instant render, numbers fluctuate slightly to simulate live processes.

**Components:**
- **Skill Bar:** `[` (#008F11), `|` (#00FF41), `]` (#008F11).
- **Header Block:** Black background, `#00FF41` text inverted for table headers.

**Interactions:**
- **Keyboard `q`:** Exits the `top` view, returns to prompt.

**Responsive:**
- **Desktop:** Fixed width columns, 80ch minimum.

### Contact (`traceroute me`)

**Purpose:** Provide contact links through a network diagnostics aesthetic.

**Layout:** Sequential network hop list.

**Key Elements:**
- **Hop List:** Numbered rows showing routing through various "nodes" (e.g., `1  router.local (192.168.1.1) 2ms`).
- **Final Destinations:** The final hops resolve to actual contact methods (`github.com/username`, `linkedin.com/in/name`, `mailto:email@domain.com`).
- **Status:** Shows `Connection Established` in `#00FFFF`.

**States:**
- **Loading:** Slow, deliberate printing of each hop (500ms delay per line) to mimic real traceroute.

**Components:**
- **Hop Row:** `12px`, `#008F11` IP addresses, `#00FFFF` destination URLs.

**Interactions:**
- **Click URL:** Opens respective link in a new tab.

**Responsive:**
- **Desktop:** Standard terminal width padding.

</details>

---

<details>
<summary>Build Guide</summary>

**Stack:** HTML + Tailwind CSS v3 + Vanilla JS (for typing/CLI logic) + Framer Motion (for organic, fluid transitions between rendered commands).

**Build Order:**
1. **Main Terminal (Home)** - Establishes the core CSS variables, font loading, CRT effects (with custom curve and scanlines), and the global input capture system (including Tab/Arrow key support).
2. **Boot Sequence** - Adds the introductory overlay using simple JS timeouts and audio triggers.
3. **Projects / Skills / Contact** - Implemented as data objects in JS that get injected into the terminal buffer DOM element upon correct command execution.

**Engineering Depth:**
- **Dynamic Fetching:** Fetch GitHub API data to display live stats and pin repositories inside the terminal interface.
- **Persistent Session:** Use `localStorage` to save command history and session state so returning users do not lose their flow.
- **File System Logic:** Implement a JSON-based virtual directory tree allowing robust file navigation (`cd`, `ls`, `cat`).

**High-End Visual Polishing:**
- **Staggered Text Injection:** Use non-linear intervals for command outputs to mimic realistic, uneven terminal parsing/load times.
- **Buffer Scroll Animation:** Smoothly animate the terminal window scrolling to the bottom when new outputs are executed.
- **'Dead Pixel' CRT Effect:** Introduce subtle CSS overlays of static screen burn-in and dead pixels to maximize the retro-hardware feel.

**Security Easter Eggs:**
- Implement custom sassy responses for dangerous or probing commands (e.g., `sudo`, `rm -rf /`, `whoami --root`).

**Security & Technical SEO:**
- **XSS Protection:** Enforce strict input sanitization on the command prompt. Include source-code comments (`// Sanitizing input to prevent XSS - standard practice`) to implicitly show recruiters security awareness.
- **Environment Variables Awareness:** Ensure any dynamic integrations (like GitHub) utilize `.env` files and server-side/serverless architecture to prevent API key leaks in the client code.
- **Security Headers:** Deploy with strict CSP, HSTS, and X-Frame-Options. Mention these natively in the `skills` output.
- **Technical SEO:**
  - Implement **JSON-LD Schema** (`Person` / `ProfilePage`) so search engines properly index the user as a "Cyber Security Engineer" regardless of the JS-heavy UI.
  - Use **Semantic HTML**: Render standard SEO tags (`<h1>`, `<h2>`, `<article>`) in the DOM hidden via `.sr-only` utility classes so web crawlers parse the content accurately while preserving the visual terminal illusion.

</details>