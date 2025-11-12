## Extensión para Chrome y Firefox de sitios Basketball-Reference y StatHead para Liga chilenos2 en Yahoo

Basado en la extensión de RotoGrinders BasketballReference.

Extensión para **Google Chrome** y **Mozilla Firefox** que agrega automáticamente la columna "**YH**" (Yahoo Fantasy Points) en las estadísticas de jugadores del sitio [Basketball-Reference.com](http://www.basketball-reference.com) y [StatHead](https://stathead.com/basketball).

**Características:**
- 🎨 Heat-map con colores adaptativos para visualizar rendimiento
- 📊 Soporte para múltiples tipos de tablas: GameLogs, Box Scores, Series de Playoffs, Últimos 5 Partidos
- ⚡ Cálculo automático en tiempo real sin necesidad de recargar
- 🎯 Bonus de titular (+1) aplicado correctamente en partidos individuales
- 📱 Compatible con páginas de jugadores, equipos, partidos y temporadas completas

### Modo de instalación:

#### Opción 1: Chrome Web Store (Recomendado)
- **Próximamente:** La extensión estará disponible en Chrome Web Store
- Instalación con un click y actualizaciones automáticas

#### Opción 2: Desarrollo/Testing (Mientras tanto)
- Si usas **Google Chrome**:
  1. Descarga o clona este repositorio
  2. Abre `chrome://extensions/`
  3. Activa "Modo de desarrollador" (Developer mode)
  4. Click en "Cargar extensión sin empaquetar" (Load unpacked)
  5. Selecciona la carpeta del repositorio

- Si usas **Mozilla Firefox**:
  1. Descarga o clona este repositorio
  2. Abre `about:debugging#/runtime/this-firefox`
  3. Click en "Cargar complemento temporal..." (Load Temporary Add-on)
  4. Selecciona el archivo `manifest.json`

#### Opción 3: Build desde código (Desarrolladores)
Ver [BUILD_GUIDE.md](BUILD_GUIDE.md) para instrucciones completas de construcción y distribución. 

#### Ejemplos de páginas compatibles:
- **GameLog** de un jugador en una temporada:
  - https://www.basketball-reference.com/players/j/jokicni01/gamelog/2025/
- **Últimos 5 Partidos** en página de jugador:
  - https://www.basketball-reference.com/players/j/jokicni01.html (ver tabla "Last 5 Games")
- **Box Score** de un partido:
  - https://www.basketball-reference.com/boxscores/201502060ATL.html
- **Series de Playoffs** (con columnas YH y YH/G):
  - https://www.basketball-reference.com/playoffs/2022-nba-finals-celtics-vs-warriors.html
- **Promedios anuales** de un jugador:
  - https://www.basketball-reference.com/players/j/jokicni01.html
- **Estadísticas de equipo** (Regular Season y Playoffs):
  - https://www.basketball-reference.com/teams/LAC/2025.html
- **Promedios temporada actual** todos los jugadores:
  - https://www.basketball-reference.com/leagues/NBA_2026_per_game.html


### Características principales (v2.0.17):
- ✅ **GameLogs**: Calcula YH por partido individual con bonus de titular (+1 por partido iniciado)
- ✅ **Últimos 5 Partidos**: Tabla "Last 5 Games" con YH para rendimiento reciente
- ✅ **Box Scores**: YH por jugador en partidos individuales
- ✅ **Series de Playoffs**: Dos columnas YH (total) y YH/G (promedio por partido)
- ✅ **Estadísticas de Temporada**: Per Game y Totals (sin bonus de titular)
- ✅ **Páginas de Equipos**: Soporte para Regular Season y Playoffs
- ✅ **Código Moderno**: Manifest V3, ES6+, sin dependencias externas
- ✅ **Colores Adaptativos**: Heat-map con texto legible en fondos oscuros

### Bugs históricos resueltos:
- [x] ~~Resultado inflado por no saber calcular si un jugador es titular o no.~~ FIXED v2.0.3-2.0.5
- [x] ~~En el boxscore de un partido, hay que ignorar el valor en "Team totals".~~ FIXED v2.0.0
- [x] ~~En Per Game parece haber 5 puntos extras.~~ FIXED
- [x] ~~Game logs no funcionan (problema con columna G y formato de minutos).~~ FIXED v2.0.8-2.0.9
- [x] ~~Box scores no muestran columna YH.~~ FIXED v2.0.15

### References:
- https://rotogrinders.com/pages/rotogrinders-daily-fantasy-browser-extensions-245335
- https://github.com/nickyvu/basketball-reference-dfs
- http://www.basketball-reference.com

### Disclaimer:
Agradecimientos a los fantasy GM de Grand Wizzard y cero32 por desarrollo y patches

### ChangeLog:
- Version 2.0.17: 20251112 **NEW FEATURE** - Added "Last 5 Games" table support - Detects table with id="last5" on player pages - Processes it like game logs with individual game YH calculations - Includes starter bonus (+1 for games started) - Appears on player pages showing recent performance
- Version 2.0.16: 20251112 **NEW FEATURE** - Added series tables support - Detects tables with 3-letter team acronyms (GSW, BOS, LAC, etc.) - Adds TWO YH columns: "YH" (totals across all games in series) and "YH/G" (per-game average = YH ÷ Games) - Perfect for playoff series analysis - Works on pages like NBA Finals series stats
- Version 2.0.15: 20251112 **CRITICAL FIX** - Fixed box score row detection - Box scores don't have a "G" (games) column, changed to check minutes > 0 instead (same fix as v2.0.8 for game logs) - YH column now appears correctly on box score pages - NOW BOX SCORES ACTUALLY WORK!
- Version 2.0.14: 20251112 **DEBUG IMPROVEMENT** - Added comprehensive debug logging to processBoxScoreTables() function - Logs now show: URL validation, total tables found, which box score tables are processed, row counts, header additions, player YH calculations, and skip reasons - Helps diagnose issues with box score page processing
- Version 2.0.13: 20251112 **CRITICAL FIX** - Added playoff table support for team pages - Extension now processes #per_game_stats_post and #totals_stats_post tables - YH column now appears correctly when toggling between Regular Season and Playoffs views on team pages
- Version 2.0.12: 20251112 **CODE REFACTOR** - Consolidated tier system into single TIER_CONFIG table - All tier thresholds (per-game/totals), background colors, and text colors now defined in one easy-to-edit structure (lines 56-89) - Replaced separate TIER_THRESHOLDS, TIER_COLORS arrays and getTextColor() logic with unified configuration - Much easier to maintain and visualize tier settings
- Version 2.0.11: 20251112 **UI IMPROVEMENT** - Improved text legibility for dark tier colors - White text now used for darkest blue backgrounds (tiers 0-1) in addition to red/orange backgrounds (tiers 7-10) - Better contrast for low-scoring performances
- Version 2.0.10: 20251112 **BACKWARD COMPATIBILITY FIX** - Added support for new playoffs table ID 'player_game_log_post' (Basketball-Reference deprecated 'player_game_log_playoffs') - Extension now supports both old and new playoff table naming conventions
- Version 2.0.9: 20251112 **CRITICAL FIX** - Fixed minutes parsing for game logs - MP stored as time string "MM:SS" not number - Updated getMinutes() to parse time format (e.g., "29:06" → 29.1 minutes) - NOW GAME LOGS ACTUALLY WORK!
- Version 2.0.8: 20251112 **CRITICAL FIX** - Fixed game log row detection - Game logs don't have a "G" (games) column, changed to check minutes > 0 instead - Now correctly processes all game log rows and calculates YH scores
- Version 2.0.7: 20251112 **CRITICAL FIX** - Updated table selectors for Basketball-Reference's new game log table IDs (changed from 'pgl_basic' to 'player_game_log_reg') - Extension now properly detects and processes game log tables
- Version 2.0.6: 20251112 **CRITICAL FIX** - Added URL match patterns for player game logs (4-6 path segments) - Extension now properly loads on game log pages like /players/h/hardeja01/gamelog/2026/
- Version 2.0.5: 20251112 Fixed game log starter detection - Now correctly handles Basketball-Reference's format change where started games show "*" instead of "1"
- Version 2.0.4: 20251112 Fixed double-counting starter bonus in Totals - Both Per-game and Totals tables now correctly have NO starter bonus (bonus only applied at individual game level in game logs and box scores)
- Version 2.0.3: 20251112 Fixed starter bonus bug - Per-game tables now correctly have NO starter bonus, fixed game log starter detection
- Version 2.0.2: 20251112 Fixed critical column indexing bug - getValue/getText now correctly query both th and td elements to match header structure, added support for reading actual triple-double counts from Totals table
- Version 2.0.1: 20251112 Fixed critical calculation bug - Totals now show season total YH score (not per-game average), starter bonus now correctly uses GS count for totals
- Version 2.0.0: 20251112 Major refactor - Manifest V3, removed jQuery dependency, modernized to ES6+, added configuration system, improved error handling, fixed Team Totals bug, optimized performance with caching
- Version 1.5.0: 20210304 Añadiendo soporte para STATHEAD e instrucciones para Firefox
- Version 1.4.1: 20191219 Ajustando HeatMap de colores
- Version 1.4.0: 20191203 Version 2019-20
- Version 1.2.0: 20151028 Agregado stats para Projections, cambio de formula a temporada 2015-2016
- Version 1.1.3: 20150312 Minor fixes, new color scheme
- Version 1.0.0: 20150219 First version

### What's New in v2.0.0:
- **Manifest V3**: Updated to latest Chrome extension standard (future-proof until 2025+)
- **Zero Dependencies**: Removed jQuery (~85KB savings), now using vanilla JavaScript
- **Modern ES6+**: Refactored with classes, arrow functions, const/let, template literals
- **Configuration System**: Easy to update scoring rules for different seasons
- **Better Code Quality**: Added error handling, JSDoc comments, constants instead of magic numbers
- **Performance**: Implemented header caching to reduce DOM queries
- **Bug Fixes**: Fixed Team Totals calculation in box scores
- **Smaller & Faster**: Reduced file size and improved load times
