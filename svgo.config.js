export const SVGOConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          convertTransform: false,
          convertColors: { currentColor: 'black' },
          inlineStyles: false,
        },
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'circle:fill',
          'rect:fill',
          'polygon:fill',
          'line:stroke',
        ],
      },
    },
  ],
};
