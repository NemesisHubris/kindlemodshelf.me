# KindleModShelf Page Formatting Standards

A comprehensive guide to page structure patterns, section types, and when to use them based on analysis of 15+ pages across the site.

---

## ABSOLUTE REQUIREMENTS (Every Page)

These sections appear on **100% of pages** and should never be omitted:

1. **Navigation Bar** - `← Back to Home` link (fixed position, top-left)
2. **H1 Page Title** - Centered, uses primary color
3. **Summary Section** - Introductory paragraph describing what the page is about
   - Uses `.summary` class styling
   - 1-3 sentences max
   - Plain language, user-focused
4. **Footer Disclaimer** - Legal/educational notice at bottom

---

## CORE SECTIONS (Required in 90%+ of Pages)

These sections should be included unless there's a strong reason not to:

### 1. **Download**
- **Position**: Always first content section (after summary)
- **Frequency**: 15/15 pages examined (100%)
- **When to include**: Any page about a tool, plugin, game, or downloadable resource
- **When to skip**: Guide/tutorial pages, informational pages without downloads (jailbreaking.html, customscreensavers.html)
- **Format**:
  ```html
  <section class="section-title">Download</section>
  <div class="card card-desc">
    <a href="[download-link]" class="card-download" target="_blank" rel="noopener">Download</a>
    [Optional: version info, requirements, alternative links]
  </div>
  ```

### 2. **Features** (or Key Features / Main Features)
- **Position**: 2nd or 3rd section (after Download, possibly after Overview)
- **Frequency**: 12/15 pages examined (80%)
- **When to include**: Tools, plugins, games - anything with capabilities to showcase
- **When to skip**: Very simple pages, informational pages without complex features (gpt.html, jailbreaking.html)
- **Format**: Bullet list in card div
- **Variations**:
  - "Features" - generic tools
  - "Key Features" - emphasizes most important ones
  - "Main Features" - comprehensive feature list
- **Content**:
  - 3-8 bullet points (more looks cluttered)
  - Concise descriptions (5-15 words each)
  - User benefit-focused

### 3. **Installation / How to Install**
- **Position**: Usually 4th-5th section
- **Frequency**: 12/15 pages examined (80%)
- **When to include**: Any downloadable tool, plugin, or mod that requires setup
- **When to skip**: Web-based tools, informational pages, pages where use is self-evident
- **Format**: Ordered list (step-by-step instructions)
- **Content**:
  - Clear, numbered steps
  - Assumes beginner knowledge for essential tools
  - More detailed for complex installations
  - Include file paths for clarity (e.g., `/koreader/plugins/`)

---

## COMMON OPTIONAL SECTIONS (Conditional)

Include these sections **only when applicable**:

### **Overview / About**
- **Position**: Immediately after Summary (before Features) for complex pages
- **Frequency**: 5/15 pages (guides, plugins, complex tools)
- **When to use**:
  - Plugin pages that need context (Project: Title)
  - Guide pages that explain a concept first
  - Pages with complex relationships to other tools
- **When to skip**: Simple standalone tools, single-purpose pages
- **Length**: 2-4 paragraphs max

### **Requirements**
- **Position**: Before Installation
- **Frequency**: 5/15 pages (technical tools, games, device-specific tools)
- **When to use**:
  - Hardfloat (HF) vs Softfloat (SF) distinction needed
  - Specific Kindle models required
  - Dependencies on other tools (must install KUAL first, etc.)
  - System/OS requirements
- **When to skip**: Universal tools with no constraints
- **Format**: Bullet list or simple statement

### **How to Use**
- **Position**: After Installation
- **Frequency**: 4/15 pages
- **When to use**:
  - Non-obvious tools where feature list alone isn't enough
  - Complex plugins with workflows
  - Tools with multiple modes or settings
  - Games with non-standard controls
- **When to skip**: Tools that are self-explanatory, very simple utilities
- **Format**: Numbered steps or narrative description with examples
- **Examples in site**: projecttitle.html, koweather.html, kanki.html, textadept.html

### **How to Play** (Games Only)
- **Position**: After Features
- **Frequency**: 2/15 pages (games: snake.html, 2048.html)
- **When to use**: Board games, puzzles, strategy games
- **When to skip**: All non-game pages
- **Format**: Rules explanation + control instructions

### **Notes / Tips / Caveats**
- **Position**: After How to Use or Installation
- **Frequency**: 4/15 pages
- **When to use**:
  - Known workarounds or limitations
  - Performance tips
  - Device-specific gotchas
  - Best practices for use
- **When to skip**: If no notable caveats exist
- **Format**: Bullet list or callout box
- **Examples**: disableads.html, koweather.html, projecttitle.html

### **Known Issues / Troubleshooting / FAQ**
- **Position**: Near end, before Credits
- **Frequency**: 4/15 pages (complex tools: kindleforge.html, textadept.html, koweather.html)
- **When to use**:
  - Common problems users encounter
  - Installation failure scenarios
  - Compatibility issues
  - Multiple pages of Q&A
- **When to skip**: Simple tools without documented issues
- **Format**:
  - "Known Issues" = bullet list of problems
  - "Troubleshooting" = problem → solution pairs
  - "FAQ" = question → answer pairs
- **Threshold**: Include if you have 3+ issues/questions worth documenting

### **Credits**
- **Position**: Near end, before footer
- **Frequency**: 7/15 pages (47%)
- **When to use**:
  - Original developers to acknowledge
  - Significant forks or modifications
  - Contributors to mention
- **When to skip**: Simple one-person projects without major contributions
- **Format**: Link to GitHub profile + brief credit
- **Examples**:
  - "Created by [Author]"
  - "Maintained by [Org]"
  - "Based on [Original Project]"

### **Customization / Configuration**
- **Position**: After How to Use
- **Frequency**: 2/15 pages (highly configurable tools: kanki.html, projecttitle.html)
- **When to use**: Tools with significant customization options
- **When to skip**: Tools with minimal settings
- **Format**: Feature-by-feature customization guide

### **Why Use / Why Jailbreak**
- **Position**: After Features
- **Frequency**: 2/15 pages (essential tools: koreader.html, kterm.html)
- **When to use**:
  - Essential dependencies people might question
  - Tools that justify their complexity
  - Permission/safety concern explanations
- **When to skip**: Most pages (not needed for games, guides)
- **Format**: 1-2 paragraphs explaining the value/necessity

### **Personal Note / Author Commentary**
- **Position**: Varies (kanki.html has it after main content)
- **Frequency**: 3/15 pages (kanki.html, jailbreaking.html, koreaderplugindev.html)
- **When to use**:
  - Complex projects where author has helpful context
  - Tools with specific recommendations
  - Pages where personality matters
- **When to skip**: Most pages (only for comprehensive/complex projects)

---

## SECTION ORDERING GUIDE

### **Standard Order (For Tools & Plugins)**
1. Back Home button
2. H1 Title
3. Summary
4. **Download** ← Always first
5. **Features** ← Second major section
6. Requirements (if needed)
7. **Installation** ← Third major section
8. How to Use (if needed)
9. Notes/Tips (if needed)
10. Known Issues (if many)
11. Credits (if applicable)
12. Footer

### **Game Page Order**
1. Back Home button
2. H1 Title
3. Summary
4. **Download** ← Always first
5. **Features** ← Highlight gameplay
6. **How to Play** ← Instead of "How to Use"
7. Requirements (if HF/SF specific)
8. How to Install
9. Notes/Controls
10. Credits
11. Footer

### **Guide/Tutorial Order**
1. Back Home button
2. H1 Title
3. Summary (often longer)
4. Overview/Context (if needed)
5. **Requirements** ← More prominent for guides
6. **Step-by-Step Instructions** ← Core section
7. Tips/Troubleshooting
8. Resources/Links
9. Credits
10. Footer

### **Plugin/Mod Order (Complex)**
1. Back Home button
2. H1 Title
3. Summary
4. **Overview** ← Extra for plugins
5. **Download**
6. **Features**
7. **Installation**
8. **How to Use**
9. Notes/Customization
10. Known Issues
11. Credits
12. Footer

---

## DEVIATIONS FROM THE PATTERN

These pages intentionally break the standard pattern and when:

### **jailbreaking.html**
- **Why**: Comprehensive guide with subsections
- **Deviation**: Narrative format with subsections, embedded YouTube, longer flow
- **Pattern to follow**: When creating multi-section guide pages

### **gpt.html**
- **Why**: Resource download page
- **Deviation**: No Features, Installation, or Credits sections
- **Pattern to follow**: For download-only informational pages

### **customscreensavers.html**
- **Why**: Tutorial/guide with focus on steps
- **Deviation**: No Features section, narrative format
- **Pattern to follow**: When creating step-by-step tutorials

### **koreaderplugindev.html**
- **Why**: Educational content with code blocks
- **Deviation**: Uses code examples, subsections, learning objectives
- **Pattern to follow**: When creating tutorial/educational content

---

## WHEN TO OMIT COMMON SECTIONS

### **Don't Include Download Section When:**
- Page is informational only (guides, jailbreaking.html)
- Page is about a feature of something else (customscreensavers.html)
- Resources are embedded in the page itself (gpt.html)

### **Don't Include Features When:**
- Page is a guide/tutorial (customscreensavers.html, jailbreaking.html)
- Tool is self-explanatory single-purpose (simple utilities)
- Page emphasizes process over capabilities

### **Don't Include Installation When:**
- Tool is web-based or cloud-hosted
- Installation is a single line/trivial
- Page is a guide/informational piece

### **Don't Include How to Use When:**
- Tool is self-explanatory (most games, simple utilities)
- Features section adequately describes usage
- Use is embedded in the installation instructions

---

## QUICK REFERENCE TABLE

| Page Type | Download | Features | Installation | How to Use | Credits | Notes |
|-----------|----------|----------|--------------|-----------|---------|-------|
| Tool | ✓ | ✓ | ✓ | ? | ✓ | ? |
| Plugin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Game | ✓ | ✓ | ✓ | ✓ (How to Play) | ✓ | ? |
| Guide | ✗ | ✗ | ✗ | ✓ (Steps) | ✓ | ? |
| Utility | ✓ | ✓ | ✓ | ? | ? | ? |
| Informational | ✗ | ✗ | ✗ | ? | ✓ | ? |

✓ = Nearly always include
? = Include if applicable
✗ = Usually omit

---

## MARKDOWN/HTML CONSISTENCY NOTES

### **Styling Elements**
- Section titles: Use `<div class="section-title">` for consistency
- Content containers: Use `<div class="card card-desc">` for uniform styling
- Links: Always add `target="_blank" rel="noopener"` for external links
- Emphasized text: Use `<strong>` for tool/feature names, NOT `**markdown**`

### **Typography**
- First mention of a tool name: `<strong>ToolName</strong>`
- Buttons/UI elements: `<strong>Button Name</strong>`
- File paths: `<code>/path/to/file</code>`
- Key terms: `<strong>term</strong>` not ALL CAPS

### **Lists**
- Bullet points: Use `<ul><li>` (unordered, features, notes)
- Steps: Use `<ol><li>` (ordered, installation, how-to)
- Description lists: Use `<dl><dt><dd>` (FAQ, problem→solution pairs)

---

## SUMMARY RULES

1. **Download is always first** - No exceptions
2. **Features and Installation are core** - Include unless there's a strong reason (guide/informational pages)
3. **Section order matters** - Follow the standard ordering unless the page type dictates otherwise
4. **Be ruthless about omissions** - Don't add sections just because they exist; only include if they add value
5. **Credits are nearly universal** - Add unless it's a solo project with no dependencies
6. **Notes and How-to-Use are conditional** - Only when there's actual content that adds value
7. **Copy your closest match** - When in doubt, find a similar page and use its structure as your template
