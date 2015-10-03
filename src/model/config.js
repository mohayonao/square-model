// System
const CLOCK_INTERVAL = 0.5;
const CLOCK_INCREASING_FIX = 1.8;
const GRID_NUM_INIT = 8;
const ANT_NUM_INIT = 1;

// GRID Richness
const SUGAR_INIT = 10;
const SUGAR_RECOVERY_NUM = 2;

// ANT PARAM
const VIEW_WIDTH = 2;
const VIEW_INIT = 1;
const POOL_INIT = 4;
const TAKE_INIT = 8;
const APPETITE_INIT = 4;
const MOVE_RATE = 0.7;

// Dead or Arrive
const BORN_LINE_OF_POOL = POOL_INIT * 100;
const DEATH_LINE_OF_POOL = 0;

export default {
  CLOCK_INTERVAL,
  CLOCK_INCREASING_FIX,
  GRID_NUM_INIT,
  ANT_NUM_INIT,
  SUGAR_INIT,
  SUGAR_RECOVERY_NUM,
  VIEW_WIDTH,
  VIEW_INIT,
  POOL_INIT,
  TAKE_INIT,
  APPETITE_INIT,
  MOVE_RATE,
  BORN_LINE_OF_POOL,
  DEATH_LINE_OF_POOL
};
