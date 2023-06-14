import clsx from 'clsx';
import Box from '../Box/Box';

export type Colors = 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';

interface BadgeProps {
  color: Colors;
  rounded?: boolean;
  className?: string;
  text: string;
}

const colorMap: { [key in Colors]: number[] } = {
  gray: [100, 600],
  red: [100, 700],
  yellow: [100, 800],
  green: [100, 700],
  blue: [100, 700],
  indigo: [100, 700],
  purple: [100, 700],
  pink: [100, 700],
};

export default function Badge({ text, color, className, rounded }: BadgeProps) {
  return (
    <Box
      className={clsx(
        'inline-flex items-center px-2 py-1 text-xs font-medium',
        rounded ? 'rounded-full' : 'rounded-md',
        `bg-${color}-${colorMap[color][0]} text-${color}-${colorMap[color][1]}`,
        className
      )}
    >
      {text}
    </Box>
  );
}
