import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

type BaseProps = {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type LinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type Props = ButtonProps | LinkProps

const styles: Record<string, React.CSSProperties> = {
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    textDecoration: 'none',
    border: '1.5px solid',
  },
}

const sizeMap = {
  sm: { padding: '8px 16px', fontSize: '13px' },
  md: { padding: '12px 24px', fontSize: '15px' },
  lg: { padding: '16px 32px', fontSize: '17px' },
}

const variantMap = {
  primary: {
    background: 'var(--orange)',
    color: 'white',
    borderColor: 'var(--orange-shadow)',
    boxShadow: '0 3px 0 var(--orange-shadow)',
    transform: 'translateY(-2px)',
  },
  secondary: {
    background: 'var(--bg-surface)',
    color: 'var(--text)',
    borderColor: 'var(--border)',
    boxShadow: '0 3px 0 var(--border)',
    transform: 'translateY(-2px)',
  },
}

export default function Button3D(props: Props) {
  const { variant = 'primary', size = 'md', ...rest } = props
  const style = {
    ...styles.base,
    ...sizeMap[size],
    ...variantMap[variant],
  }

  if ('href' in rest && rest.href) {
    const { href, children, ...anchorProps } = rest as LinkProps
    return (
      <a href={href} style={style} {...anchorProps}>
        {children}
      </a>
    )
  }

  const { children, ...buttonProps } = rest as ButtonProps
  return (
    <button style={style} {...buttonProps}>
      {children}
    </button>
  )
}
