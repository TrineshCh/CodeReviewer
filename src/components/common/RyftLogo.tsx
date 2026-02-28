const CELL = 12;
const GAP = 3;
const S = CELL + GAP;
const COLOR = 'hsl(221 83% 53%)';

// [row, col, colSpan, rowSpan]
type Block = [number, number, number, number];

const R: Block[] = [
  [0, 0, 1, 5],  // left full vertical
  [0, 1, 2, 1],  // top bar
  [0, 3, 1, 2],  // top-right arm
  [2, 1, 2, 1],  // middle bar
  [3, 3, 1, 2],  // bottom-right leg
];

const Y: Block[] = [
  [0, 0, 1, 2],  // left arm
  [0, 3, 1, 2],  // right arm
  [2, 1, 2, 1],  // join
  [3, 1, 1, 2],  // stem
];

const F: Block[] = [
  [0, 0, 1, 5],  // left full vertical
  [0, 1, 2, 1],  // top bar
  [2, 1, 2, 1],  // middle bar
];

const T: Block[] = [
  [0, 0, 3, 1],  // top bar
  [1, 1, 1, 4],  // center stem
];

const letters = [
  { data: R, cols: 4 },
  { data: Y, cols: 4 },
  { data: F, cols: 3 },
  { data: T, cols: 3 },
];

interface RyftLogoProps {
  scale?: number;
  color?: string;
  className?: string;
}

export const RyftLogo = ({ scale = 1, color = COLOR, className }: RyftLogoProps) => {
  const LETTER_GAP = S * 1.2;
  let offsetX = 0;
  const rects: { x: number; y: number; w: number; h: number }[] = [];

  letters.forEach((letter, li) => {
    letter.data.forEach(([row, col, cSpan, rSpan]) => {
      rects.push({
        x: offsetX + col * S,
        y: row * S,
        w: cSpan * S - GAP,
        h: rSpan * S - GAP,
      });
    });
    offsetX += letter.cols * S + (li < letters.length - 1 ? LETTER_GAP : 0);
  });

  const totalW = offsetX - LETTER_GAP + letters[letters.length - 1].cols * S;
  const totalH = 5 * S;
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
          rx={1}
          fill={color}
        />
      ))}
    </svg>
  );
};
