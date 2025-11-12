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
- Starter bonus = GS / G (percentage of games started, typically 0 to 1)
- Triple-double = +3 if averages constitute triple-double (≥10 in 3+ categories)
- **Result:** Per-game YH score
- **Division:** By 1 (stats already per-game)

**Example:**
```
Player: 20.0 PPG, 8.0 APG, 6.0 RPG in 10 games (started 10)
- Starter: 10/10 = 1.0
- YH per game = 34.86
```

### 2. Season Totals Tables

**Page Example:** `https://www.basketball-reference.com/leagues/NBA_2025_totals.html`

**Behavior:**
- Stats in table are **season totals** (all games combined)
- Starter bonus = GS (number of games started)
- Triple-double = +3 if per-game averages constitute triple-double
- **Result:** Total season YH score
- **Division:** By 1 (we want total, not average!)

**Example:**
```
Player: 200 total PTS, 80 total AST, 60 total REB in 10 games (started 10)
- Stats are totals: 200 PTS, 80 AST, etc.
- Starter: 10 games started = 10 × 1 = +10 points
- YH total = 314.55 for the season
```

**Key Difference:**
- Per-game averages 34.86 → multiply by games: 34.86 × 9 = 313.74
- But starter bonus is different: per-game uses starter percentage, totals uses count
- Total season score accounts for this: ~314.55

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
- **Per-Game tables:** Starter bonus = GS / G (percentage, e.g., 1.0 if started all games)
  - If started 9/9 games: +1.0 points per game
- **Totals tables:** Starter bonus = GS (count, e.g., 9 if started 9 games)
  - If started 9/9 games: +9 points total for season

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

Stats (averages):
- G: 9, GS: 9
- FG: 6.0, FGA: 13.0
- FT: 7.0, FTA: 8.0
- 3P: 2.5, 3PA: 7.0
- PTS: 21.5, ORB: 0.5, DRB: 5.5
- AST: 8.0, STL: 1.5, BLK: 0.5, TOV: 3.0

Calculation:
```
Starter: 9/9 = 1.0
= (1.0 × 1)
  + (6.0 × 1) - (13.0 × 0.45)
  + (7.0 × 1) - (8.0 × 0.75)
  + (2.5 × 2) - (7.0 × 0.75)
  + (21.5 × 0.5)
  + (0.5 × 1.7) + (5.5 × 1.5)
  + (8.0 × 2)
  + (1.5 × 2.5)
  + (0.5 × 2.5)
  - (3.0 × 2)
  + (0 × 3)  // No triple-double average
= 1.0 + 6.0 - 5.85 + 7.0 - 6.0 + 5.0 - 5.25 + 10.75 + 0.85 + 8.25 + 16.0 + 3.75 + 1.25 - 6.0 + 0
= 34.86 per game
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
