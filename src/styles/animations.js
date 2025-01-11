export const cardFlipAnimation = `
  @keyframes cardFlip {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(180deg); }
  }
`;

export const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const bounceAnimation = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

export const glowAnimation = `
  @keyframes glow {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.3); }
  }
`; 