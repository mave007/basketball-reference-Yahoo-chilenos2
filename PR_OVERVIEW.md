# Pull Request: Release v2.0.17 - Major Feature Additions and Critical Bug Fixes

## 📋 Overview

This PR consolidates 12 releases (v2.0.6 through v2.0.17) containing critical bug fixes, new features, and significant improvements to the Basketball-Reference Yahoo Fantasy extension. The changes enhance table support, fix critical calculation issues, improve maintainability, and add comprehensive debugging capabilities.

**Branch:** `claude/code-review-session-011CV38ZfJFSeJ1KRM3NQWUp`
**Base:** `master`
**Commits:** 20
**Files Changed:** 10 files (+18,683 insertions, -63 deletions)

---

## ✨ New Features

### 1. **Series Tables with Dual YH Columns** (v2.0.16)
- Added support for playoff series tables (e.g., NBA Finals statistics)
- **Two YH columns added:**
  - `YH` - Total Yahoo Fantasy Points across all games in the series
  - `YH/G` - Average Yahoo Fantasy Points per game (YH ÷ Games)
- Automatically detects tables with 3-letter team acronyms (GSW, BOS, LAC, etc.)
- Perfect for analyzing player performance across playoff series
- **Example pages:** https://www.basketball-reference.com/playoffs/2022-nba-finals-celtics-vs-warriors.html

### 2. **Last 5 Games Table Support** (v2.0.17)
- Added YH calculations for "Last 5 Games" table on player pages
- Appears on player landing pages showing recent performance
- Uses same logic as game logs (individual game calculations with starter bonus)
- Table ID: `#last5`
- **Example pages:** https://www.basketball-reference.com/players/j/jokicni01.html

---

## 🐛 Critical Bug Fixes

### 1. **Box Score Pages Not Working** (v2.0.15)
- **Problem:** YH column never appeared on box score pages
- **Root Cause:** Code checked for `games > 0` but box scores don't have a "G" (games played) column
- **Solution:** Changed validation to check `minutes > 0` instead
- **Impact:** Box scores now correctly display YH for all players
- **Example pages:** https://www.basketball-reference.com/boxscores/201502060ATL.html

### 2. **Game Logs Not Processing** (v2.0.8-v2.0.9)
- **Problem:** Game log tables not calculating YH scores
- **Root Causes:**
  - Table ID selector outdated (`pgl_basic` → `player_game_log_reg`)
  - Same `games > 0` validation issue as box scores
  - Minutes stored as time string "MM:SS" format, not numbers
- **Solutions:**
  - Updated table selectors to new Basketball-Reference IDs
  - Changed validation to `minutes > 0`
  - Enhanced `getMinutes()` to parse time format (e.g., "29:06" → 29.1)
- **Impact:** Game logs now work correctly with starter bonus applied
- **Example pages:** https://www.basketball-reference.com/players/j/jokicni01/gamelog/2025/

### 3. **Team Page Playoff Toggle Not Working** (v2.0.13)
- **Problem:** YH column disappeared when toggling from Regular Season to Playoffs view
- **Root Cause:** Playoff tables have different IDs (`#per_game_stats_post`, `#totals_stats_post`)
- **Solution:** Added playoff table selectors to initialization
- **Impact:** YH column now appears in both Regular Season and Playoffs views
- **Example pages:** https://www.basketball-reference.com/teams/LAC/2025.html

---

## 🔧 Improvements

### 1. **Tier Configuration Consolidation** (v2.0.12)
- **Before:** Tier settings scattered across 3 locations (thresholds array, colors array, getTextColor function)
- **After:** Single `TIER_CONFIG` array with all settings in one place
- **Benefits:**
  - Much easier to maintain and visualize tier settings
  - All tier thresholds, background colors, and text colors defined together
  - Reduced code duplication
- **Structure:**
```javascript
const TIER_CONFIG = [
  { minPerGame: 0,  maxPerGame: 12,  minTotals: 0,    maxTotals: 1000,
    bgColor: '#313695', textColor: '#ffffff' },  // Tier 0 - Darkest blue
  // ... 11 tiers total
  { minPerGame: 50, maxPerGame: Infinity, minTotals: 3500, maxTotals: Infinity,
    bgColor: '#a50026', textColor: '#ffffff' }   // Tier 10 - Darkest red
];
```

### 2. **Improved Text Legibility** (v2.0.11)
- **Problem:** Black text on darkest blue backgrounds (tiers 0-1) was hard to read
- **Solution:** White text now used for:
  - Darkest blue backgrounds (tiers 0-1) - low-scoring performances
  - Red/orange backgrounds (tiers 7-10) - high-scoring performances
- **Implementation:** Added explicit `textColor` property to each tier in TIER_CONFIG
- **Impact:** Better contrast across all tier colors

### 3. **Comprehensive Debug Logging** (v2.0.14)
- Added detailed console logging throughout box score processing
- **Logs include:**
  - URL validation
  - Total tables found
  - Which box score tables are being processed
  - Row counts per table
  - Header additions
  - Individual player YH calculations with minutes played
  - Skip reasons (Team Totals, no minutes, etc.)
- **Format:** All logs prefixed with `[chilenos2 YH]` for easy filtering
- **Impact:** Enabled rapid diagnosis of processing issues

### 4. **Playoff Table ID Backward Compatibility** (v2.0.10)
- **Problem:** Basketball-Reference deprecated old playoff table IDs over the years
- **Evolution:** `pgl_basic_playoffs` → `player_game_log_playoffs` → `player_game_log_post`
- **Solution:** Extension now supports ALL three naming conventions
- **Impact:** Works with both current and historical Basketball-Reference pages

---

## 🔨 Technical Changes

### Core Files Modified

#### **baller.js** (315 insertions, 63 deletions)
Major changes:
1. **TABLE_SELECTORS expansion** (lines 91-117):
   - Added `#per_game_stats_post`, `#totals_stats_post` for team playoff pages
   - Added `#player_game_log_post` for new playoff table ID
   - Added `#last5` for Last 5 Games table
   - Added `seriesTables: /^[A-Z]{3}$/` regex for series detection

2. **New function: processSeriesTables()** (lines 578-678):
   - Detects playoff series tables by 3-letter team IDs
   - Calculates both total YH and per-game average
   - Adds two separate columns with appropriate tier coloring

3. **Enhanced getMinutes()** (time string parsing):
   - Now handles both numeric values and "MM:SS" time format
   - Parses strings like "29:06" to 29.1 minutes

4. **Fixed validation logic** (multiple functions):
   - Changed from `games > 0` to `minutes > 0` check
   - Applied to both game logs and box scores

5. **Consolidated TIER_CONFIG** (lines 56-89):
   - Replaced separate arrays with single configuration object
   - Simplified getTextColor() function

#### **manifest.json** (version bump)
```json
"version": "2.0.17"
```

#### **build.sh & Makefile.new** (version sync)
```bash
VERSION="2.0.17"
```

#### **README.md** (69 insertions, documentation updates)
Updated in Spanish:
1. **Features section** - Added Last 5 Games, Series tables
2. **Examples section** - Added series and Last 5 Games URLs
3. **Bug history** - Marked game logs, box scores as fixed
4. **Changelog** - Added detailed entries for all versions v2.0.10-v2.0.17

---

## 📊 Statistics

### Version History (v2.0.6 → v2.0.17)
- **12 releases** over development cycle
- **3 critical bug fixes** (game logs, box scores, team playoff toggle)
- **2 new major features** (series tables, Last 5 Games)
- **4 improvements** (tier consolidation, text colors, debug logging, backward compatibility)

### Code Changes
- **baller.js:** ~315 lines modified (core logic)
- **Total changes:** +18,683 insertions, -63 deletions
- **Files modified:** 10 files (4 core extension files, 5 test HTML files, 1 doc file)

### Table Support Matrix
| Table Type | v2.0.5 | v2.0.17 |
|-----------|--------|---------|
| Per Game Stats | ✅ | ✅ |
| Totals Stats | ✅ | ✅ |
| Game Logs (Regular) | ❌ | ✅ |
| Game Logs (Playoffs) | ❌ | ✅ |
| Box Scores | ❌ | ✅ |
| Team Pages (Regular) | ✅ | ✅ |
| Team Pages (Playoffs) | ❌ | ✅ |
| Series Tables | ❌ | ✅ |
| Last 5 Games | ❌ | ✅ |

---

## 🧪 Testing

### Test Coverage
All changes tested against real Basketball-Reference pages:
- ✅ Game logs: `/players/j/jokicni01/gamelog/2025/`
- ✅ Box scores: `/boxscores/201502060ATL.html`
- ✅ Series tables: `/playoffs/2022-nba-finals-celtics-vs-warriors.html`
- ✅ Team pages: `/teams/LAC/2025.html` (Regular + Playoffs toggle)
- ✅ Player pages: `/players/j/jokicni01.html` (Last 5 Games)
- ✅ Season stats: `/leagues/NBA_2026_per_game.html`

### Test Files Included
For regression testing and development:
- `current-test-201502060ATL.html` - Box score example
- `current-test-2022-nba-finals-celtics-vs-warriors.html` - Series table example
- `current-test-2025.html` - Team page with playoff toggle
- `current-test-jokicni01.html` - Player page with Last 5 Games
- `current-test-player_game_log.html` - Game log examples

---

## 🚀 Deployment

### Breaking Changes
**None** - All changes are backward compatible

### Installation
Extension continues to support both manual installation methods:
1. **Chrome:** Load unpacked extension from repository
2. **Firefox:** Load temporary add-on via `about:debugging`

### Future Chrome Web Store Submission
ZIP file generation ready via:
```bash
./build.sh zip
# or
make zip
```

---

## 📝 Commit History

```
c5213a1 Actualizar README.md con instrucciones mejoradas en español
961911f v2.0.17: Add Last 5 Games table support
a1fff88 v2.0.16: Add series tables support with dual YH columns
0ba149d v2.0.15: Fix box score row detection - check minutes instead of games
cb62784 v2.0.14: Add comprehensive debug logging to box score processing
6fde412 v2.0.13: Add playoff table support for team pages
6404e00 v2.0.12: Consolidate tier system into single configuration table
b5c8a5c v2.0.11: Improve text legibility for dark tier colors
c454d1d v2.0.10: Add backward compatibility for new playoffs table ID
613e910 CRITICAL FIX: Parse time string format for minutes in game logs
6b59017 CRITICAL FIX: Game logs don't have 'G' column - use minutes instead
b3037da CRITICAL FIX: Update table selectors for new game log table IDs
```

---

## ✅ Checklist

- [x] All code changes committed and pushed
- [x] Version bumped in manifest.json, build.sh, Makefile.new
- [x] README.md updated with new features (Spanish)
- [x] Changelog updated with all versions
- [x] No breaking changes introduced
- [x] Backward compatible with old Basketball-Reference table IDs
- [x] Tested on multiple page types (game logs, box scores, series, team pages)
- [x] Debug logging added for troubleshooting
- [x] Code consolidated and refactored for maintainability

---

## 🙏 Acknowledgments

Thanks to the fantasy GM community members Grand Wizzard and cero32 for development and testing contributions throughout this release cycle.

---

## 📞 Contact

For issues or questions about this PR:
- GitHub Issues: https://github.com/mave007/basketball-reference-Yahoo-chilenos2/issues
- Extension Maintainers: GrandWizzard / cero32
