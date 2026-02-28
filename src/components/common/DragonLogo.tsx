const CELL = 5;
const GAP = 1.5;
const S = CELL + GAP;
const COLOR = 'hsl(221 83% 53%)';

// Dragon silhouette on a 14x12 grid (row, col, colSpan, rowSpan)
type Block = [number, number, number, number];

const dragon: Block[] = [
  // Head
  [0, 9, 2, 1],
  [1, 8, 3, 1],
  [2, 7, 4, 1],
  [2, 12, 1, 1],   // horn tip
  [3, 7, 3, 1],
  [3, 11, 2, 1],   // horn

  // Eye
  [1, 11, 1, 1],

  // Neck
  [4, 6, 2, 1],
  [5, 5, 2, 1],

  // Body
  [6, 3, 4, 1],
  [7, 2, 5, 1],
  [8, 1, 6, 1],
  [9, 1, 5, 1],
  [10, 2, 4, 1],

  // Wing upper
  [4, 8, 1, 1],
  [5, 8, 2, 1],
  [5, 11, 1, 1],
  [6, 8, 4, 1],
  [6, 13, 1, 1],
  [7, 9, 5, 1],
  [8, 10, 4, 1],

  // Tail
  [11, 3, 3, 1],
  [12, 5, 2, 1],
  [13, 6, 2, 1],
  [13, 9, 1, 1],   // tail tip spike
  [12, 8, 2, 1],   // tail curve

  // Legs
  [11, 1, 1, 2],   // back leg
  [11, 5, 1, 1],   // front leg
  [12, 0, 2, 1],   // back foot
  [12, 5, 1, 1],   // front foot

  // Belly spikes
  [9, 7, 1, 1],
  [10, 7, 1, 1],

  // Fire breath
  [0, 5, 1, 1],
  [0, 7, 1, 1],
  [1, 5, 2, 1],
];

interface DragonLogoProps {
  scale?: number;
  color?: string;
  className?: string;
}

export const DragonLogo = ({ scale = 1, color = COLOR, className }: DragonLogoProps) => {
  const rects: { x: number; y: number; w: number; h: number }[] = [];

  dragon.forEach(([row, col, cSpan, rSpan]) => {
    rects.push({
      x: col * S,
      y: row * S,
      w: cSpan * S - GAP,
      h: rSpan * S - GAP,
    });
  });

  const totalW = 15 * S;
  const totalH = 14 * S;
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
