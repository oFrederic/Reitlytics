/**
 * UI-related constants
 */

// Layout dimensions
export const LAYOUT = {
  HEADER_HEIGHT: 48,
  SEARCH_PANEL_WIDTH_PERCENT: 25,
  BUILDING_LIST_WIDTH_PERCENT: 25,
  VISUALIZATION_WIDTH_PERCENT: 50,
  BUILDING_LIST_EXPANDED_PERCENT: 33,
  VISUALIZATION_EXPANDED_PERCENT: 67,
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation durations (in milliseconds)
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  MAP_TRANSITION: 500,
  LAYOUT_CHANGE_DELAY: 300,
} as const;

// Z-index layers
export const Z_INDEX = {
  MODAL: 1000,
  POPUP: 999,
  DROPDOWN: 998,
  TOOLTIP: 997,
  MARKER_SELECTED: 100,
  MARKER_HOVERED: 50,
  MARKER_NORMAL: 1,
} as const;

// Common UI text
export const UI_TEXT = {
  LOADING: '読み込み中...',
  NO_DATA: 'データがありません',
  ERROR_OCCURRED: 'エラーが発生しました',
  NO_BUILDINGS_FOUND: '該当する建物がありません',
  CHANGE_SEARCH_CRITERIA: '検索条件を変更してください',
  SEARCHING: '検索中...',
  SEARCH: '検索',
  RESET_SEARCH: '検索結果をリセット',
  SELECT_BUILDING_FOR_ANALYSIS: '建物を選択すると、キャップレート推移と稼働率推移が表示されます',
} as const;