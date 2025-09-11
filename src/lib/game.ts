export const generateDeck = (
    size: number = 8,
    points: number[] = Array.from({ length: 20 }, (_, i) => i + 1)
  ): number[] => {
    const randomPoints = points
      .sort(() => Math.random() - 0.5)
      .slice(0, size);
  
    const paired = randomPoints.flatMap((point) => [point, point]);
  
    for (let i = paired.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paired[i], paired[j]] = [paired[j], paired[i]];
    }
  
    return paired;
  };
  