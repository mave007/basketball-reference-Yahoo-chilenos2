// ============================================================================
// Constants and Configuration
// ============================================================================

const CALC_TYPE = {
  BOXSCORE: 1,
  PLAYER_GAMELOG: 2,
  PER_GAME: 3,
  TOTALS: 4
};

const TIER_TYPE = {
  PER_GAME: 0,
  TOTALS: 1
};

// Yahoo Fantasy League Scoring Configuration
// Source: https://basketball.fantasysports.yahoo.com/nba/2170/settings
const SCORING_CONFIG = {
  '2024-25': {
    starter: 1,
    fga: -0.45,
    fg: 1,
    fta: -0.75,
    ft: 1,
    threeP: 2,
    threePA: -0.75,
    pts: 0.5,
    orb: 1.7,
    drb: 1.5,
    ast: 2,
    stl: 2.5,
    blk: 2.5,
    tov: -2,
    tripleDouble: 3
  }
};

// Default to current season
const CURRENT_SEASON = '2024-25';

// Color tiers using ColorBrewer diverging scheme (colorblind-safe)
// http://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=11
const TIER_THRESHOLDS = {
  perGame: [0, 12, 16, 20, 23, 27, 31, 36, 40, 45, Infinity],
  totals: [0, 1000, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3200, Infinity]
};

const TIER_COLORS = [
  '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
  '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'
];

// Table selectors for different page types
const TABLE_SELECTORS = {
  headers: '#stats thead tr, #playoffs_totals thead tr, #totals thead tr, ' +
           '#totals_stats thead tr, #per_game thead tr, #per_game_stats thead tr, ' +
           '#projection thead tr, #playoffs_per_game thead tr, #stats_games thead tr, ' +
           '#pgl_basic thead tr, #pgl_basic_playoffs thead tr',

  perGameRows: '#playoffs_totals tbody tr, #totals tbody tr, #totals_stats tbody tr, ' +
               '#per_game tbody tr, #per_game_stats tbody tr, #projection tbody tr, ' +
               '#playoffs_per_game tbody tr, #stats_games tbody tr, #per_game tfoot tr, ' +
               '#playoffs_per_game tfoot tr',

  gameLogRows: '#pgl_basic tbody tr, #pgl_basic_playoffs tbody tr',

  boxScoreTables: 'table[id^="box-"][id$="-basic"]'
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate average of array values
 */
const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((a, b) => Number(a) + Number(b), 0);
  return (sum / values.length).toFixed(2);
};

/**
 * Calculate median of array values
 */
const calculateMedian = (values) => {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);

  if (sorted.length % 2) {
    return sorted[half];
  }
  return (Number(sorted[half - 1]) + Number(sorted[half])) / 2.0;
};

/**
 * Check if stat value is a double (>= 10)
 */
const isDouble = (stat) => stat >= 10;

/**
 * Determine tier based on score value
 */
const getTier = (value, tierType = TIER_TYPE.PER_GAME) => {
  const thresholds = tierType === TIER_TYPE.TOTALS
    ? TIER_THRESHOLDS.totals
    : TIER_THRESHOLDS.perGame;

  for (let i = 0; i < thresholds.length - 1; i++) {
    if (value >= thresholds[i] && value < thresholds[i + 1]) {
      return i;
    }
  }
  return 0;
};

/**
 * Get color for tier
 */
const getColorForTier = (tier) => {
  return TIER_COLORS[tier] || TIER_COLORS[0];
};

/**
 * Get text color based on background tier
 */
const getTextColor = (tier) => {
  return tier > 6 ? '#ffffff' : '#000000';
};

// ============================================================================
// StatRow Class
// ============================================================================

class StatRow {
  constructor(row) {
    this.row = row;
    this.table = row.closest('table');
    this.headerCache = null;
  }

  /**
   * Build index cache for header columns
   */
  buildHeaderIndex() {
    if (this.headerCache) return this.headerCache;

    try {
      const headerRow = this.table.querySelector('thead tr:not(.over_header)');
      if (!headerRow) return {};

      const headers = Array.from(headerRow.querySelectorAll('th'));
      this.headerCache = {};

      headers.forEach((th, index) => {
        const stat = th.getAttribute('data-stat') || th.textContent.trim();
        this.headerCache[stat] = index;
      });

      return this.headerCache;
    } catch (error) {
      console.warn('Failed to build header index:', error);
      return {};
    }
  }

  /**
   * Get column index for a stat category
   */
  getIndex(category) {
    try {
      const headerIndex = this.buildHeaderIndex();

      // Try direct match first
      if (headerIndex[category] !== undefined) {
        return headerIndex[category];
      }

      // Fallback: search by text content
      const headerRow = this.table.querySelector('thead tr:not(.over_header)');
      if (!headerRow) return -1;

      const headers = Array.from(headerRow.querySelectorAll('th'));
      const index = headers.findIndex(th => th.textContent.trim() === category);

      return index;
    } catch (error) {
      console.warn(`Failed to get index for ${category}:`, error);
      return -1;
    }
  }

  /**
   * Get numeric value for a stat category
   */
  getValue(category) {
    try {
      const index = this.getIndex(category);
      if (index === -1) return 0;

      const cells = this.row.querySelectorAll('td');
      const cell = cells[index];

      if (!cell) return 0;

      const value = Number(cell.textContent.trim());
      return isNaN(value) ? 0 : value;
    } catch (error) {
      console.warn(`Failed to get value for ${category}:`, error);
      return 0;
    }
  }

  /**
   * Get text value for a category (for non-numeric data)
   */
  getText(category) {
    try {
      const index = this.getIndex(category);
      if (index === -1) return '';

      const cells = this.row.querySelectorAll('td');
      const cell = cells[index];

      return cell ? cell.textContent.trim() : '';
    } catch (error) {
      console.warn(`Failed to get text for ${category}:`, error);
      return '';
    }
  }

  /**
   * Get number of games played
   */
  getGames() {
    return this.getValue('G');
  }

  /**
   * Get minutes played
   */
  getMinutes() {
    return this.getValue('MP');
  }

  /**
   * Get games started
   */
  getStartedGames() {
    return this.getValue('GS');
  }

  /**
   * Calculate Yahoo Fantasy League score
   */
  calculateYH(calcType = CALC_TYPE.PER_GAME, index = 0, config = SCORING_CONFIG[CURRENT_SEASON]) {
    try {
      let games = 1;
      let starter = 1;
      const startedGames = this.getStartedGames();
      const totalGames = this.getGames();

      // Determine starter status based on calculation type
      switch (calcType) {
        case CALC_TYPE.BOXSCORE:
          // In box scores, first 5 players are starters
          starter = index < 6 ? 1 : 0;
          break;

        case CALC_TYPE.PLAYER_GAMELOG:
          // In game logs, check if player started
          starter = isNaN(startedGames) ? 0 : startedGames;
          break;

        case CALC_TYPE.PER_GAME:
          // For per-game stats, use starter percentage
          starter = totalGames > 0 ? startedGames / totalGames : 0;
          break;

        case CALC_TYPE.TOTALS:
          // For totals, use number of games started (each start = +1 point)
          starter = startedGames;
          games = 1; // Don't divide - we want total season score, not per-game average
          break;
      }

      // Get stat values
      const pts = this.getValue('PTS');
      const ast = this.getValue('AST');
      const stl = this.getValue('STL');
      const blk = this.getValue('BLK');
      const trb = this.getValue('TRB');

      // Check for triple-double
      let tripleDouble = 0;
      if (calcType === CALC_TYPE.TOTALS) {
        // For totals, check if per-game averages constitute a triple-double
        // We don't have game-by-game data, so this is an approximation
        const totalGames = this.getGames();
        if (totalGames > 0) {
          const statsPerGame = [pts/totalGames, ast/totalGames, stl/totalGames, blk/totalGames, trb/totalGames];
          const doubles = statsPerGame.filter(isDouble).length;
          // If they average a triple-double, give bonus once for the season
          tripleDouble = doubles >= 3 ? 1 : 0;
        }
      } else {
        // For per-game, divide by games first
        const statsPerGame = [pts, ast, stl, blk, trb].map(s => s / games);
        const doubles = statsPerGame.filter(isDouble).length;
        tripleDouble = doubles >= 3 ? 1 : 0;
      }

      // Calculate Yahoo Fantasy score
      const score = (
        (starter * config.starter) +
        (this.getValue('FGA') * config.fga) +
        (this.getValue('FG') * config.fg) +
        (this.getValue('FTA') * config.fta) +
        (this.getValue('FT') * config.ft) +
        (this.getValue('3P') * config.threeP) +
        (this.getValue('3PA') * config.threePA) +
        (pts * config.pts) +
        (this.getValue('ORB') * config.orb) +
        (this.getValue('DRB') * config.drb) +
        (ast * config.ast) +
        (stl * config.stl) +
        (blk * config.blk) +
        (this.getValue('TOV') * config.tov) +
        (tripleDouble * config.tripleDouble)
      ) / games;

      return parseFloat(score.toFixed(2));
    } catch (error) {
      console.error('Failed to calculate YH score:', error);
      return 0;
    }
  }
}

// ============================================================================
// DOM Manipulation Functions
// ============================================================================

/**
 * Add YH header to table
 */
const addYHHeader = (headerRow) => {
  const th = document.createElement('th');
  th.setAttribute('data-stat', 'YH_score');
  th.setAttribute('align', 'center');
  th.className = 'tooltip';
  th.setAttribute('tip', 'Yahoo Fantasy League chilenos2');
  th.textContent = 'YH';
  headerRow.appendChild(th);
};

/**
 * Add YH cell to row
 */
const addYHCell = (row, value, tier) => {
  const td = document.createElement('td');
  const bgColor = getColorForTier(tier);
  const textColor = getTextColor(tier);

  td.setAttribute('bgcolor', bgColor);
  td.setAttribute('align', 'right');
  td.style.color = textColor;
  td.textContent = value;

  row.appendChild(td);
};

/**
 * Process per-game and totals tables
 */
const processPerGameTables = () => {
  try {
    // Add headers
    document.querySelectorAll(TABLE_SELECTORS.headers).forEach(header => {
      addYHHeader(header);
    });

    // Process rows
    document.querySelectorAll(TABLE_SELECTORS.perGameRows).forEach(row => {
      // Skip thead rows that might be in tbody
      if (row.classList.contains('thead')) return;

      const statRow = new StatRow(row);
      const games = statRow.getGames();

      if (games > 0) {
        const minutes = statRow.getMinutes();
        let yhScore, tier;

        // Determine if this is totals or per-game based on minutes
        if (minutes > 60) {
          // Totals table
          yhScore = statRow.calculateYH(CALC_TYPE.TOTALS, 0);
          tier = getTier(yhScore, TIER_TYPE.TOTALS);
        } else {
          // Per-game table
          yhScore = statRow.calculateYH(CALC_TYPE.PER_GAME, 0);
          tier = getTier(yhScore, TIER_TYPE.PER_GAME);
        }

        addYHCell(row, yhScore, tier);
      }
    });
  } catch (error) {
    console.error('Failed to process per-game tables:', error);
  }
};

/**
 * Process game log tables
 */
const processGameLogTables = () => {
  try {
    const yhValues = [];

    document.querySelectorAll(TABLE_SELECTORS.gameLogRows).forEach(row => {
      // Skip thead rows
      if (row.classList.contains('thead')) return;

      const statRow = new StatRow(row);
      const games = statRow.getGames();

      if (games > 0) {
        const yhScore = statRow.calculateYH(CALC_TYPE.PLAYER_GAMELOG, 0);
        yhValues.push(yhScore);

        const minutes = statRow.getMinutes();
        const tierType = minutes > 60 ? TIER_TYPE.TOTALS : TIER_TYPE.PER_GAME;
        const tier = getTier(yhScore, tierType);

        addYHCell(row, yhScore, tier);
      }
    });

    // Add summary row with stats
    if (yhValues.length > 0) {
      const tbody = document.querySelector('#pgl_basic tbody');
      if (tbody) {
        const summaryRow = document.createElement('tr');
        summaryRow.style.backgroundColor = '#00FF00';
        summaryRow.innerHTML = `
          <td><strong>YH</strong></td>
          <td>Promedio</td>
          <td>${calculateAverage(yhValues)}</td>
          <td></td>
          <td>Min</td>
          <td>${Math.min(...yhValues)}</td>
          <td></td>
          <td>Max</td>
          <td>${Math.max(...yhValues)}</td>
        `;
        tbody.appendChild(summaryRow);
      }
    }
  } catch (error) {
    console.error('Failed to process game log tables:', error);
  }
};

/**
 * Process box score tables
 */
const processBoxScoreTables = () => {
  try {
    const url = window.location.pathname;

    // Only run on box score pages
    if (!url.includes('/boxscores/')) return;

    document.querySelectorAll('table').forEach(table => {
      const tableId = table.getAttribute('id');

      // Check if this is a box score table
      if (!tableId || !tableId.startsWith('box-') || !tableId.endsWith('-basic')) {
        return;
      }

      // Add header
      const headerRow = table.querySelector('thead tr:not(.over_header)');
      if (headerRow) {
        addYHHeader(headerRow);
      }

      // Process rows
      let playerIndex = 0;
      const rows = table.querySelectorAll('tbody tr, tfoot tr');

      rows.forEach(row => {
        // Skip thead rows in tbody
        if (row.classList.contains('thead')) return;

        const statRow = new StatRow(row);
        const games = statRow.getGames();

        if (games > 0) {
          const playerName = statRow.getText('Starters') || statRow.getText('Player');

          // Skip team totals and reserves headers
          if (playerName === 'Team Totals' || playerName === 'Reserves') {
            row.appendChild(document.createElement('td')); // Add empty cell
            playerIndex = 0; // Reset counter after starters
            return;
          }

          playerIndex++;
          const yhScore = statRow.calculateYH(CALC_TYPE.BOXSCORE, playerIndex);

          const minutes = statRow.getMinutes();
          const tierType = minutes > 60 ? TIER_TYPE.TOTALS : TIER_TYPE.PER_GAME;
          const tier = getTier(yhScore, tierType);

          addYHCell(row, yhScore, tier);
        }
      });
    });
  } catch (error) {
    console.error('Failed to process box score tables:', error);
  }
};

// ============================================================================
// Main Initialization
// ============================================================================

/**
 * Initialize the extension when DOM is ready
 */
const initialize = () => {
  try {
    processPerGameTables();
    processGameLogTables();
    processBoxScoreTables();
  } catch (error) {
    console.error('Failed to initialize Yahoo Fantasy League extension:', error);
  }
};

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
