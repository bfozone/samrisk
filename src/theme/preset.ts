import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const RiskAppPreset = definePreset(Aura, {
  primitive: {
    // Brand red ramp - from #ee000c
    brand: {
      50: '#fff1f1',
      100: '#ffe0e1',
      200: '#ffc7c8',
      300: '#fa959a',
      400: '#e87c78',
      500: '#ee000c',
      600: '#b80009',
      700: '#7a000a',
      800: '#430002',
      900: '#2a0001',
      950: '#190001',
    },
    // Neutral ramp - from actual site greys
    shark: {
      50: '#f7f8fa',
      100: '#e7eaec',
      200: '#d5d7d9',
      300: '#CCCED0',
      400: '#939ca1',
      500: '#778187',
      600: '#616b72',
      700: '#3c3f40',
      800: '#2b2e36',
      900: '#20242a',
      950: '#15171d',
    },
    fontFamily: {
      default: 'Inter, Helvetica, Arial, sans-serif',
      code: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    borderRadius: {
      none: '0',
      xs: '4px',
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
  },
  semantic: {
    primary: {
      50: '{shark.50}',
      100: '{shark.100}',
      200: '{shark.200}',
      300: '{shark.300}',
      400: '{shark.400}',
      500: '{shark.500}',
      600: '{shark.600}',
      700: '{shark.700}',
      800: '{shark.800}',
      900: '{shark.900}',
      950: '{shark.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{shark.900}',
          inverseColor: '#ffffff',
          hoverColor: '{shark.800}',
          activeColor: '{shark.950}',
        },
        highlight: {
          background: '{shark.50}',
          focusBackground: '{shark.100}',
          color: '{shark.900}',
          focusColor: '{shark.950}',
        },
        surface: {
          0: '#ffffff',
          50: '{shark.50}',
          100: '{shark.100}',
          200: '{shark.200}',
          300: '{shark.300}',
          400: '{shark.400}',
          500: '{shark.500}',
          600: '{shark.600}',
          700: '{shark.700}',
          800: '{shark.800}',
          900: '{shark.900}',
          950: '{shark.950}',
        },
      },
      dark: {
        primary: {
          color: '{brand.400}',
          inverseColor: '{shark.900}',
          hoverColor: '{brand.300}',
          activeColor: '{brand.200}',
        },
        highlight: {
          background: 'color-mix(in srgb, {brand.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {brand.400}, transparent 76%)',
          color: '{brand.300}',
          focusColor: '{brand.200}',
        },
        surface: {
          0: '#ffffff',
          50: '{shark.50}',
          100: '{shark.100}',
          200: '{shark.200}',
          300: '{shark.300}',
          400: '{shark.400}',
          500: '{shark.500}',
          600: '{shark.600}',
          700: '{shark.700}',
          800: '{shark.800}',
          900: '{shark.900}',
          950: '{shark.950}',
        },
      },
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '{shark.900}',
              hoverBackground: '{shark.800}',
              activeBackground: '{shark.950}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              borderColor: '{shark.900}',
              hoverBorderColor: '{shark.800}',
              activeBorderColor: '{shark.950}',
            },
            secondary: {
              background: '#ffffff',
              hoverBackground: '{shark.50}',
              activeBackground: '{shark.100}',
              color: '{shark.900}',
              hoverColor: '{shark.900}',
              activeColor: '{shark.900}',
              borderColor: '{shark.200}',
              hoverBorderColor: '{shark.300}',
              activeBorderColor: '{shark.400}',
            },
          },
        },
      },
      root: {
        fontWeight: '600',
        transitionDuration: '0.2s',
      },
    },
    card: {
      root: {
        background: '#ffffff',
        shadow: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
      },
      body: {
        padding: '1.5rem',
      },
    },
    inputtext: {
      root: {
        borderColor: '{shark.300}',
        hoverBorderColor: '{shark.400}',
        focusBorderColor: '{shark.900}',
        invalidBorderColor: '{brand.500}',
        paddingX: '0.875rem',
        paddingY: '0.625rem',
      },
    },
    select: {
      root: {
        borderColor: '{shark.300}',
        hoverBorderColor: '{shark.400}',
        focusBorderColor: '{shark.900}',
        invalidBorderColor: '{brand.500}',
      },
    },
    textarea: {
      root: {
        borderColor: '{shark.300}',
        hoverBorderColor: '{shark.400}',
        focusBorderColor: '{shark.900}',
        invalidBorderColor: '{brand.500}',
      },
    },
    datatable: {
      root: {
        borderColor: '{shark.200}',
      },
      headerCell: {
        borderColor: '{shark.200}',
        background: '{shark.50}',
      },
      bodyCell: {
        borderColor: '{shark.200}',
      },
    },
    tag: {
      root: {
        fontWeight: '600',
      },
    },
    checkbox: {
      root: {
        borderColor: '{shark.300}',
      },
    },
    radiobutton: {
      root: {
        borderColor: '{shark.300}',
      },
    },
  },
})

export default RiskAppPreset

// ECharts palette - consistent with brand
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
}
