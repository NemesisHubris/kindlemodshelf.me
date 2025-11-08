# APKG Import Code Audit - Critical Issues Found

## 🔴 CRITICAL SEVERITY (Security & Data Loss)

### 1. **RACE CONDITION - Data Corruption**
**Location**: Line 1271-1292
**Issue**: Event handler is async but globals are mutated. Multiple rapid file selections cause concurrent imports that corrupt `allDecks`, `levels`, `selectedLevel`.
**Impact**: User loses all data
**Fix**: Add import lock/mutex

### 2. **CODE INJECTION VULNERABILITY**
**Location**: Line 1331-1333
**Issue**: `new Function(jsText)` executes arbitrary user code - basically `eval()`
**Impact**: Malicious .js file can steal localStorage, cookies, execute any JS
**Fix**: Use safer JSON-only format or sandboxed iframe

### 3. **XSS VULNERABILITY**
**Location**: Line 1551
**Issue**: `innerHTML = html` with untrusted content. If error occurs before clearing, malicious HTML persists
**Impact**: Script execution, session hijacking
**Fix**: Use DOMParser only, remove innerHTML fallback

### 4. **CDN HIJACKING - No Integrity Checks**
**Location**: Line 900-901
**Issue**: No SRI hashes on external scripts. MITM or compromised CDN = code injection
**Impact**: Attackers can inject malicious code
**Fix**: Add integrity="sha384-..." attributes

### 5. **RESOURCE EXHAUSTION**
**Location**: Line 1376
**Issue**: No file size validation. 5GB APKG crashes browser
**Impact**: Browser crash, tab crash, data loss
**Fix**: Add 50MB limit with clear error

### 6. **GLOBAL STATE CORRUPTION**
**Location**: Line 1443-1446
**Issue**: Import mutates globals immediately. If import fails halfway, state is inconsistent
**Impact**: User sees partial/corrupted data
**Fix**: Build state in local variables, only update globals on success

---

## 🟠 SEVERE (Errors & Bad UX)

### 7. **MEMORY LEAK - Global DOM Element**
**Location**: Line 1536
**Issue**: `_stripHTMLElement` created globally, never GC'd
**Impact**: Memory grows with each card import
**Fix**: Create locally in function or use DOMParser only

### 8. **MEMORY LEAK - DOMParser Documents**
**Location**: Line 1546-1548
**Issue**: New document created per card, may not GC immediately
**Impact**: 10,000 cards = 10,000 documents in memory
**Fix**: Reuse single parser, clear references

### 9. **MEMORY LEAK - ArrayBuffer**
**Location**: Line 1376-1377
**Issue**: Entire file kept in memory throughout import
**Impact**: 100MB+ APKG = browser slowdown
**Fix**: Clear references after use, use streaming if possible

### 10. **DUPLICATE DECK NAMES MERGE**
**Location**: Line 1458-1460
**Issue**: Two Anki decks named "Spanish" merge into one
**Impact**: User loses deck separation
**Fix**: Add numeric suffix for duplicates

### 11. **UNICODE SEPARATOR BUG**
**Location**: Line 1454
**Issue**: Split on `\x1f` fails if separator appears in card text
**Impact**: Card content truncated/corrupted
**Fix**: Escape separator or use different split method

### 12. **TYPE COERCION BUG**
**Location**: Line 1410
**Issue**: `String(deckData.name)` converts objects to "[object Object]"
**Impact**: Deck named "[object Object]"
**Fix**: Validate name is string before using

### 13. **NO PROGRESS INDICATION**
**Location**: Entire importAPKG function
**Issue**: Large imports (10,000+ cards) take 30+ seconds with no feedback
**Impact**: User thinks app froze, clicks multiple times
**Fix**: Add progress bar, yield to event loop

### 14. **PROMISE REJECTION - WASM Load**
**Location**: Line 1390-1392
**Issue**: If CDN fails to load .wasm file, error is cryptic
**Impact**: User gets unhelpful error
**Fix**: Catch and provide clear message

### 15. **ASYNC ERROR HANDLING**
**Location**: Line 1285
**Issue**: If importAPKG() throws after starting, file input still reset
**Impact**: Confusing error state
**Fix**: Only reset input on success

---

## 🟡 MODERATE (Edge Cases & Performance)

### 16. **DOMParser Allocation Inefficiency**
**Location**: Line 1546
**Issue**: New DOMParser created per card
**Impact**: Slower import, more memory churn
**Fix**: Reuse single parser instance

### 17. **REGEX CATASTROPHIC BACKTRACKING**
**Location**: Line 1559
**Issue**: `/<[^>]*>/g` can hang on malformed HTML like `<<<<<<<<`
**Impact**: Browser freeze
**Fix**: Use non-greedy match or limit iterations

### 18. **SQL INJECTION RISK**
**Location**: Line 1428-1433
**Issue**: Raw SQL query with no result validation
**Impact**: Malicious APKG could return unexpected data types
**Fix**: Validate result structure before using

### 19. **MISSING TYPE CHECKS**
**Location**: Line 1474
**Issue**: `.filter(f => f && f.trim())` crashes if f is number/object
**Impact**: Import fails on valid Anki decks
**Fix**: Check `typeof f === 'string'`

### 20. **DECK ID TYPE ASSUMPTION**
**Location**: Line 1455
**Issue**: Assumes deckId is valid object key
**Impact**: If deckId is Symbol or weird type, lookup fails
**Fix**: Convert to string explicitly

### 21. **INTEGER OVERFLOW** (Theoretical)
**Location**: Line 1489
**Issue**: Reduce sum could overflow at 2^53 cards
**Impact**: totalCards becomes Infinity or incorrect
**Fix**: Add sanity check (unlikely to matter)

### 22. **INCONSISTENT ERROR HANDLING**
**Location**: Throughout
**Issue**: Mix of alert() and showToast()
**Impact**: Inconsistent UX
**Fix**: Standardize on one method

### 23. **NO TIMEOUT ON ASYNC OPS**
**Location**: Line 1390
**Issue**: If sql.js hangs, no way to cancel
**Impact**: User stuck waiting
**Fix**: Add 30-second timeout

### 24. **INCOMPLETE FEATURE DETECTION**
**Location**: Line 1295-1321
**Issue**: Doesn't check FileReader, Promise, async/await
**Impact**: Could fail in unexpected browsers
**Fix**: Add comprehensive checks

### 25. **GLOBAL SCOPE POLLUTION**
**Location**: Line 1536
**Issue**: `_stripHTMLElement` in global scope
**Impact**: Naming conflicts with other code
**Fix**: Use IIFE or module scope

---

## Summary
- 🔴 Critical: 6 issues
- 🟠 Severe: 9 issues
- 🟡 Moderate: 10 issues
- **Total: 25 issues**

All issues will be fixed in the rebuild.
