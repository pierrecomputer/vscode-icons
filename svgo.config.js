export const SVGOConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          convertTransform: false,
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
