export const chartColors = {
  // Brand colors
  red: '#ee000c',
  redDark: '#b80009',
  rose: '#e87c78',
  charcoal: '#20242a',
  grey: '#778187',
  border: '#d5d7d9',

  // Category colors (from brand illustrations)
  teal: '#61828E',
  tealDark: '#2C5969',
  olive: '#A5B077',
  oliveDark: '#586038',
  sand: '#D6CBB8',
  sandDark: '#c8b9a0',
  amber: '#EAA159',
  amberDark: '#e38121',

  // Category backgrounds (light tints)
  tealBg: '#DFE6E9',
  roseBg: '#FCEBEB',
  oliveBg: '#E6E7E1',
  sandBg: '#F7F5F1',
  amberBg: '#FBECDE',

  // Functional
  positive: '#A5B077',
  negative: '#ee000c',
  warning: '#EAA159',
  info: '#61828E',

  // Series palette for multi-series charts (red reserved for negative semantics)
  series: [
    '#2C5969', // teal
    '#A5B077', // olive
    '#EAA159', // amber
    '#61828E', // light teal
    '#e87c78', // rose
    '#586038', // dark olive
    '#e38121', // dark amber
    '#ee000c', // red (last - avoid as default series color)
  ],

  // Dark mode series palette (lightened for contrast on dark backgrounds)
  seriesDark: [
    '#4a9bb0',
    '#bec993',
    '#f0b573',
    '#7ea0ad',
    '#f09590',
    '#7a8650',
    '#f5a94a',
    '#f44c55',
  ],
}
