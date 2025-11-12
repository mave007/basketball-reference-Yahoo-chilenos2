# Release v2.0.17: Major Feature Additions and Critical Bug Fixes

## Summary

This PR consolidates 12 releases (v2.0.6 → v2.0.17) with critical bug fixes, new features, and significant improvements to the Basketball-Reference Yahoo Fantasy extension.

**Changes:** 10 files modified (+18,683 insertions, -63 deletions)

---

## ✨ New Features

### Series Tables with Dual YH Columns (v2.0.16)
- Added support for playoff series tables (e.g., NBA Finals)
- **Two YH columns:** `YH` (total points) and `YH/G` (per-game average)
- Auto-detects 3-letter team acronyms (GSW, BOS, LAC)

### Last 5 Games Table (v2.0.17)
- Added YH calculations for "Last 5 Games" on player pages
- Uses game log logic with individual game calculations + starter bonus

---

## 🐛 Critical Bug Fixes

### Box Scores Not Working (v2.0.15) ⭐
- **Fixed:** YH column now appears on all box score pages
- **Cause:** Code checked `games > 0` but box scores lack "G" column
- **Solution:** Changed to `minutes > 0` validation

### Game Logs Not Processing (v2.0.8-v2.0.9) ⭐
- **Fixed:** Game logs now calculate YH correctly
- **Issues resolved:**
  - Updated outdated table selectors (`pgl_basic` → `player_game_log_reg`)
  - Fixed minutes parsing for time format ("MM:SS")
  - Changed validation to `minutes > 0`

### Team Playoff Toggle (v2.0.13)
- **Fixed:** YH column now persists when switching Regular Season ↔ Playoffs
- **Solution:** Added playoff table IDs (`#per_game_stats_post`, `#totals_stats_post`)

---

## 🔧 Improvements

### Tier Configuration Consolidation (v2.0.12)
- Unified tier settings into single `TIER_CONFIG` array
- **Before:** Settings scattered across 3 code locations
- **After:** All thresholds, colors, and text colors in one table
- **Benefit:** Much easier to maintain and modify tiers

### Text Legibility (v2.0.11)
- White text now used for darkest blue (tiers 0-1) and red/orange (tiers 7-10) backgrounds
- Better contrast across all performance levels

### Debug Logging (v2.0.14)
- Comprehensive console logging with `[chilenos2 YH]` prefix
- Logs table detection, processing steps, and calculation details
- Enabled rapid diagnosis of issues

### Backward Compatibility (v2.0.10)
- Supports all playoff table ID variations: `pgl_basic_playoffs`, `player_game_log_playoffs`, `player_game_log_post`
- Works with both current and historical Basketball-Reference pages

---

## 📊 Table Support Progress

| Table Type | Before (v2.0.5) | After (v2.0.17) |
|-----------|:---------------:|:---------------:|
| Per Game Stats | ✅ | ✅ |
| Totals Stats | ✅ | ✅ |
| Game Logs | ❌ | ✅ |
| Box Scores | ❌ | ✅ |
| Team Pages (Playoffs) | ❌ | ✅ |
| Series Tables | ❌ | ✅ |
| Last 5 Games | ❌ | ✅ |

---

## 🧪 Testing

Tested against real Basketball-Reference pages:
- ✅ Game logs: `/players/*/gamelog/2025/`
- ✅ Box scores: `/boxscores/*.html`
- ✅ Series: `/playoffs/*-nba-finals-*.html`
- ✅ Team pages: `/teams/*/2025.html`
- ✅ Player pages: `/players/*/*.html`

---

## 📝 Files Modified

### Core Extension Files
- **baller.js** (+315/-63) - Main logic changes
- **manifest.json** - Version bump to 2.0.17
- **build.sh, Makefile.new** - Version sync
- **README.md** (+69 lines) - Spanish documentation updates

### Test Files (for development/regression testing)
- Box score example, series example, team page, player page, game logs

---

## ✅ Breaking Changes

**None** - All changes are backward compatible

---

## 🚀 Ready to Merge

- [x] All commits clean and descriptive
- [x] Version synchronized across all files
- [x] README.md updated (Spanish)
- [x] No breaking changes
- [x] Tested on multiple page types
- [x] Debug logging for future troubleshooting

---

**See [PR_OVERVIEW.md](PR_OVERVIEW.md) for complete technical details and commit history.**
