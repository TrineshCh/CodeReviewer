const CELL = 5;
const GAP = 1.5;
const S = CELL + GAP;
const COLOR = 'hsl(221 83% 53%)';

type Block = [number, number, number, number];

// T-Rex silhouette on a 13x10 grid
const dino: Block[] = [
  // Head
  [0, 6, 4, 1],
  [1, 5, 5, 1],
  [2, 5, 5, 1],
  [1, 8, 1, 1],    // eye (gap — will be overdrawn, use separate color logic or just skip)

  // Jaw
  [3, 6, 4, 1],

  // Neck
  [4, 4, 3, 1],
  [5, 3, 3, 1],

  // Body
  [6, 2, 5, 1],
  [7, 1, 6, 1],
  [8, 1, 6, 1],
  [9, 1, 5, 1],

  // Tail
  [7, 0, 1, 1],
  [10, 1, 4, 1],
  [11, 0, 3, 1],

  // Back spines
  [5, 6, 1, 1],
  [6, 7, 1, 1],
  [7, 7, 1, 1],

  // Tiny arms
  [6, 8, 1, 1],
  [7, 8, 1, 2],

  // Legs
  [10, 5, 1, 2],   // front leg
  [12, 4, 2, 1],   // front foot
  [10, 2, 1, 1],   // back leg upper
  [11, 3, 1, 2],   // back leg
  [12, 2, 2, 1],   // back foot
];

interface DinosaurLogoProps {
  scale?: number;
  color?: string;
  className?: string;
}

export const DinosaurLogo = ({ scale = 1, color = COLOR, className }: DinosaurLogoProps) => {
  const rects: { x: number; y: number; w: number; h: number }[] = [];

  dino.forEach(([row, col, cSpan, rSpan]) => {
    rects.push({
      x: col * S,
      y: row * S,
      w: cSpan * S - GAP,
      h: rSpan * S - GAP,
    });
  });

  const totalW = 11 * S;
  const totalH = 13 * S;
  const w = totalW * scale;
  const h = totalH * scale;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${totalW} ${totalH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={0.5}
          fill={color}
        />
      ))}
    </svg>
  );
};
