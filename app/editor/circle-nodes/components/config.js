/*
 * vis节点样式相关配置
 */
export const baseNodeStyle = {
  shape: 'dot',
  size: 10,
  borderWidthSelected: 1,
  color: {
    border: '#0fd9b2',
    background: '#0fd9b2',
    highlight: {
      border: '#1eb6f8',
      background: '#1eb6f8',
    },
    hover: {
      border: '#0fd9b2',
      background: '#0fd9b2',
    },
  },
  shapeProperties: {
    borderDashes: false, // only for borders
    borderRadius: 2, // only for box shape
    interpolation: true, // only for image and circularImage shapes
    useImageSize: false, // only for image and circularImage shapes
    useBorderWithImage: false, // only for image shape
  },
};

export const baseEdgeStyle = {
  smooth: { type: 'cubicBezier' },
  selectionWidth: 1,
  color: {
    inherit: 'from',
    opacity: 1.0,
  },
};
