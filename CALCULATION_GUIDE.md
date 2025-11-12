# Yahoo Fantasy League (YH) Calculation Guide

This document explains how the Yahoo Fantasy League scores are calculated for the chilenos2 league.

## Scoring Formula

The base formula for Yahoo Fantasy Basketball scoring is:

```
YH Score =
  + (Starter Bonus × 1)
  + (FG × 1)
  - (FGA × 0.45)
  + (FT × 1)
  - (FTA × 0.75)
  + (3P × 2)
  - (3PA × 0.75)
  + (PTS × 0.5)
  + (ORB × 1.7)
  + (DRB × 1.5)
  + (AST × 2)
  + (STL × 2.5)
  + (BLK × 2.5)
  - (TOV × 2)
  + (Triple-Double × 3)
```

## Calculation Types

The extension handles four different calculation contexts:

### 1. Per-Game Stats Tables

**Page Example:** `https://www.basketball-reference.com/leagues/NBA_2025_per_game.html`

**Behavior:**
- Stats in table are **already per-game averages**
- Starter bonus = **0** (NO starter bonus for per-game stats!)
- Triple-double = +3 if averages constitute triple-double (≥10 in 3+ categories)
- **Result:** Per-game YH score
- **Division:** By 1 (stats already per-game)

**Example:**
```
Player: 20.0 PPG, 8.0 APG, 6.0 RPG in 10 games (started 10)
- Starter: 0 (no bonus for per-game)
- YH per game = 33.86
```

**Important:** The starter bonus only applies to **season totals**, not per-game averages!

### 2. Season Totals Tables

**Page Example:** `https://www.basketball-reference.com/leagues/NBA_2025_totals.html`

**Behavior:**
- Stats in table are **season totals** (all games combined, summed from individual games)
- Starter bonus = **0** (NO bonus - already included in individual game stats)
- Triple-double = Read from "Trp-Dbl" column if available, or +3 if per-game averages constitute triple-double
- **Result:** Total season YH score
- **Division:** By 1 (we want total, not average!)

**Example:**
```
Player: 211 total PTS, 84 total AST, 47 total REB in 9 games (started 9)
- Stats are totals: 211 PTS, 84 AST, etc.
- Starter: 0 (NO bonus - individual games already had +1 each for starting)
- Triple-doubles: 1 (read from Trp-Dbl column) = +3 points
- YH total = 314.55 for the season
```

**Important:** Totals are the SUM of individual game scores. The starter bonus (+1 per game started) was already applied to each individual game, so we don't add it again to the season total!

### 3. Player Game Log

**Page Example:** `https://www.basketball-reference.com/players/h/hardeja01/gamelog/2025`

**Behavior:**
- Each row is one game
- Starter bonus = 1 if started (GS column), 0 if bench
- Triple-double = +3 if that specific game had triple-double
- **Result:** YH score for that game
- Adds summary row with average, min, max

### 4. Box Scores (Team vs Team)

**Page Example:** `https://www.basketball-reference.com/boxscores/202501010BOS.html`

**Behavior:**
- Each row is one player in one game
- Starter bonus = 1 for first 5 players (starters), 0 for bench
- Triple-double = +3 if that game had triple-double
- **Result:** YH score for that game
- Team Totals row shows "-" (not calculated)

## Common Issues & FAQs

### Q: Why are Per-Game and Totals scores different?

**A:** They measure different things!
- **Per-Game**: Average YH points per game (useful for comparing players)
- **Totals**: Total YH points for the season (useful for season-long fantasy)

Example:
- Per-Game: 34.86 (average per game)
- Totals (9 games): 314.55 (total for season)
- Note: 34.86 × 9 = 313.74 (close but not exact due to starter bonus calculation)

### Q: How is the starter bonus calculated differently?

**A:**
- **Per-Game tables:** Starter bonus = **0** (NO bonus)
  - Stats are already averaged, no additional bonus needed
- **Totals tables:** Starter bonus = **0** (NO bonus)
  - Stats are summed from individual games that already had the bonus
  - Adding it again would be double-counting!
- **Game Logs:** Starter bonus = **1** if started that specific game, **0** if bench
  - This is where the actual +1 bonus is applied
- **Box Scores:** Starter bonus = **1** for first 5 players (starters), **0** for bench
  - This is where the actual +1 bonus is applied

**Key Insight:** The +1 starter bonus is only applied at the **individual game level** (game logs and box scores). Season totals and per-game averages are derived from these game-level calculations, so they don't get an additional bonus.

### Q: Why doesn't Team Totals show a YH score?

**A:** Team totals are aggregated differently and don't represent a player's performance. The extension shows "-" for these rows.

### Q: How are triple-doubles detected?

**A:**
- **Per-Game & Game Log:** Check if that game/average has ≥10 in 3+ of: PTS, AST, STL, BLK, TRB
- **Totals:** Check if per-game averages constitute a triple-double (approximation, since we don't have game-by-game data)
- **Bonus:** +3 points per triple-double

### Q: Can I customize the scoring rules?

**A:** Yes! Edit `baller.js` lines 19-36 to modify the `SCORING_CONFIG` for your league's specific rules.

## Verification

To manually verify a calculation:

1. **Find the player's stats** on Basketball-Reference
2. **Apply the formula** above with your values
3. **Check calculation type:**
   - Minutes > 60? It's a totals table
   - Minutes ≤ 60? It's a per-game table
4. **Apply correct starter bonus:**
   - Per-game: GS / G
   - Totals: GS (count)
5. **Check for triple-double:** ≥10 in 3+ categories

## Example Calculations

### Example 1: James Harden - Per Game

Stats (averages from LAC 2025-26):
- G: 9, GS: 9
- FG: 7.11, FGA: 15.56
- FT: 5.56, FTA: 6.11
- 3P: 3.67, 3PA: 9.33
- PTS: 23.44, ORB: 0.44, DRB: 4.78
- AST: 9.33, STL: 1.0, BLK: 0.33, TOV: 4.22

Calculation:
```
Starter: 0  (NO starter bonus for per-game!)
= (0 × 1)
  + (7.11 × 1) - (15.56 × 0.45)
  + (5.56 × 1) - (6.11 × 0.75)
  + (3.67 × 2) - (9.33 × 0.75)
  + (23.44 × 0.5)
  + (0.44 × 1.7) + (4.78 × 1.5)
  + (9.33 × 2)
  + (1.0 × 2.5)
  + (0.33 × 2.5)
  - (4.22 × 2)
  + (0 × 3)  // No triple-double average
= 0 + 7.11 - 7.00 + 5.56 - 4.58 + 7.33 - 7.00 + 11.72 + 0.76 + 7.17 + 18.67 + 2.5 + 0.83 - 8.44 + 0
= 34.86 per game ✓
```

### Example 2: James Harden - Totals

Stats (season totals):
- G: 9, GS: 9
- FG: 54, FGA: 117
- FT: 63, FTA: 72
- 3P: 23, 3PA: 63
- PTS: 194, ORB: 5, DRB: 50
- AST: 72, STL: 14, BLK: 5, TOV: 27

Calculation:
```
Starter: 9 games
= (9 × 1)
  + (54 × 1) - (117 × 0.45)
  + (63 × 1) - (72 × 0.75)
  + (23 × 2) - (63 × 0.75)
  + (194 × 0.5)
  + (5 × 1.7) + (50 × 1.5)
  + (72 × 2)
  + (14 × 2.5)
  + (5 × 2.5)
  - (27 × 2)
  + (0 × 3)  // No consistent triple-double average
= 9.0 + 54.0 - 52.65 + 63.0 - 54.0 + 46.0 - 47.25 + 97.0 + 8.5 + 75.0 + 144.0 + 35.0 + 12.5 - 54.0 + 0
= 314.55 total for season
```

## Version History

- **v2.0.0**: Fixed totals calculation bug
  - Previously: Totals were divided by games (showing per-game average)
  - Now: Totals show total season score (as intended)
  - Starter bonus now correctly uses count (GS) for totals instead of binary

- **v1.6.0**: Previous behavior (bug existed)
  - Totals showed per-game averages incorrectly

---

**Need help?** Open an issue on GitHub with:
1. The page URL
2. Player name
3. Expected vs actual YH score
4. We'll verify the calculation!
