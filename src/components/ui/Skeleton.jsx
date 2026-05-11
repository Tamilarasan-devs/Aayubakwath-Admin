import { clsx } from 'clsx'

export function Skeleton({ variant = 'text', width, height, className = '' }) {
  const base = 'bg-gray-200 rounded animate-pulse'

  const variants = {
    text: clsx('h-4', width ? `w-[${width}]` : 'w-32'),
    circle: 'rounded-full',
    rect: clsx('w-full', height || 'h-24'),
    card: 'w-full h-32 rounded-xl',
  }

  const sizeStyle = {}
  if (width && variant !== 'text') sizeStyle.width = width
  if (height) sizeStyle.height = height

  return (
    <div
      className={clsx(base, variants[variant], className)}
      style={sizeStyle}
    />
  )
}
