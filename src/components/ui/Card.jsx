import { clsx } from 'clsx'

export function Card({ children, className = '', variant = 'default', onClick }) {
  const variants = {
    default: 'bg-white border border-gray-200',
    bordered: 'bg-white border-2 border-gray-200',
    elevated: 'bg-white border border-gray-200 shadow-sm',
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl transition-shadow duration-200',
        variants[variant],
        onClick && 'cursor-pointer hover:shadow-md',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={clsx('p-6', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={clsx('px-6 py-4 border-t border-gray-100', className)}>
      {children}
    </div>
  )
}
