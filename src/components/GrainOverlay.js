import { styled } from '@mui/material/styles';


const GrainOverlay = styled('div')(({ theme, opacity = 0.05,
  bgcolor, contrast = "150%" }) => {

  const color = (theme.vars || theme).palette.background.default;

  return {
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none',
    zIndex: 9999,
    opacity: opacity,
    filter: `contrast(${contrast}) brightness(100%)`,
    backgroundColor: bgcolor || color,
    backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAMAAAAD896isAAAAAXNSR0IArs4c6QAAAFZJREFUOMtjYKAicP7/z4AGmBgoA7YVTP8fMCALMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD8BwBySAsX3v6I2gAAAABJRU5ErkJggg==")`,
    backgroundRepeat: 'repeat',
    backfaceVisibility: "hidden",
  };
});

export default GrainOverlay;