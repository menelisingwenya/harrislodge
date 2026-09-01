import styled, { css, keyframes } from 'styled-components';
import { harrisTheme } from '@/theme';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const fadeInAnimation = css`
  animation: ${fadeIn} 220ms ease-out both;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.25rem;
`;

export const Section = styled.section`
  padding: 3rem 0;

  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth?: boolean;
  $rounded?: boolean;
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: ${harrisTheme.colors.primary};
    color: ${harrisTheme.colors.white};
    &:hover:not(:disabled) {
      background: ${harrisTheme.colors.primaryLight};
      box-shadow: 0 4px 12px rgba(0, 106, 86, 0.3);
    }
  `,
  accent: css`
    background: ${harrisTheme.colors.accent};
    color: ${harrisTheme.colors.white};
    &:hover:not(:disabled) {
      background: ${harrisTheme.colors.accentLight};
      box-shadow: 0 4px 12px rgba(217, 126, 38, 0.3);
    }
  `,
  outline: css`
    background: transparent;
    color: ${harrisTheme.colors.primary};
    border: 1.5px solid ${harrisTheme.colors.primary};
    &:hover:not(:disabled) {
      background: ${harrisTheme.colors.primary};
      color: ${harrisTheme.colors.white};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${harrisTheme.colors.primary};
    &:hover:not(:disabled) {
      background: ${harrisTheme.colors.slate[100]};
    }
  `,
  danger: css`
    background: #dc2626;
    color: ${harrisTheme.colors.white};
    &:hover:not(:disabled) {
      background: #b91c1c;
    }
  `,
};

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    padding: 0.375rem 0.875rem;
    font-size: 0.8125rem;
    font-weight: 500;
    gap: 0.35rem;
  `,
  md: css`
    padding: 0.5625rem 1.125rem;
    font-size: 0.9375rem;
    font-weight: 500;
    gap: 0.5rem;
  `,
  lg: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    gap: 0.6rem;
  `,
  xl: css`
    padding: 0.9375rem 2rem;
    font-size: 1.0625rem;
    font-weight: 600;
    gap: 0.75rem;
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: ${(p) => (p.$rounded ? harrisTheme.borderRadius.full : harrisTheme.borderRadius.lg)};
  transition: all ${harrisTheme.transitions.base};
  cursor: pointer;
  line-height: 1.2;
  letter-spacing: 0.01em;
  width: ${(p) => (p.$fullWidth ? '100%' : 'auto')};

  ${(p) => variantStyles[p.$variant]}
  ${(p) => sizeStyles[p.$size]}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${harrisTheme.colors.accent};
    outline-offset: 2px;
  }
`;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  rounded?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth,
      rounded,
      loading,
      icon,
      iconPosition = 'left',
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => (
    <StyledButton
      ref={ref}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $rounded={rounded}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px',
            height: size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px',
            border: `2px solid currentColor`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: `${spin} 0.7s linear infinite`,
          }}
        />
      ) : (
        icon && iconPosition === 'left' && <span>{icon}</span>
      )}
      {!loading && children}
      {!loading && icon && iconPosition === 'right' && <span>{icon}</span>}
    </StyledButton>
  )
);
Button.displayName = 'Button';

interface StyledCardProps {
  $hover?: boolean;
  $padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const paddingMap = {
  none: '0',
  sm: '0.75rem',
  md: '1.25rem',
  lg: '1.75rem',
  xl: '2.25rem',
};

export const Card = styled.div<StyledCardProps>`
  background: ${harrisTheme.colors.white};
  border-radius: ${harrisTheme.borderRadius['2xl']};
  box-shadow: ${harrisTheme.shadows.card};
  padding: ${(p) => paddingMap[p.$padding ?? 'md']};
  border: 1px solid ${harrisTheme.colors.slate[200]};
  transition: all ${harrisTheme.transitions.slow};

  ${(p) =>
    p.$hover &&
    css`
      cursor: pointer;
      &:hover {
        box-shadow: ${harrisTheme.shadows.cardHover};
        transform: translateY(-2px);
        border-color: ${harrisTheme.colors.slate[300]};
      }
    `}
`;

export const Badge = styled.span<{ $tone: 'primary' | 'accent' | 'slate' | 'success' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: ${harrisTheme.borderRadius.full};
  line-height: 1;

  ${(p) =>
    p.$tone === 'primary' &&
    css`
      background: rgba(1, 47, 19, 0.08);
      color: ${harrisTheme.colors.primary};
    `}
  ${(p) =>
    p.$tone === 'accent' &&
    css`
      background: rgba(249, 115, 22, 0.1);
      color: ${harrisTheme.colors.accentDark};
    `}
  ${(p) =>
    p.$tone === 'slate' &&
    css`
      background: ${harrisTheme.colors.slate[100]};
      color: ${harrisTheme.colors.slate[700]};
    `}
  ${(p) =>
    p.$tone === 'success' &&
    css`
      background: rgba(22, 163, 74, 0.1);
      color: #15803d;
    `}
  ${(p) =>
    p.$tone === 'warning' &&
    css`
      background: rgba(234, 179, 8, 0.1);
      color: #a16207;
    `}
`;

interface InputBaseProps {
  $hasError?: boolean;
}

const inputBase = css<InputBaseProps>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  font-family: inherit;
  border-radius: ${harrisTheme.borderRadius.lg};
  border: 1.5px solid
    ${(p) => (p.$hasError ? '#dc2626' : harrisTheme.colors.slate[300])};
  background: ${harrisTheme.colors.white};
  color: ${harrisTheme.colors.slate[900]};
  transition: all ${harrisTheme.transitions.base};
  outline: none;
  line-height: 1.4;

  &::placeholder {
    color: ${harrisTheme.colors.slate[400]};
  }

  &:focus {
    border-color: ${harrisTheme.colors.primary};
    box-shadow: 0 0 0 3px rgba(1, 47, 19, 0.1);
  }

  &:disabled {
    background: ${harrisTheme.colors.slate[100]};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const Input = styled.input<InputBaseProps>`
  ${inputBase}
`;

export const Select = styled.select<InputBaseProps>`
  ${inputBase}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.25rem;
`;

export const Textarea = styled.textarea<InputBaseProps>`
  ${inputBase}
  resize: vertical;
  min-height: 96px;
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${harrisTheme.colors.slate[700]};
  margin-bottom: 0.375rem;
  letter-spacing: 0.01em;
`;

export const FieldError = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.3rem;
  font-weight: 500;
`;

export interface FieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({ label, error, required, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <FieldLabel>
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </FieldLabel>
      )}
      {children}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${harrisTheme.colors.slate[200]};
  margin: 1.25rem 0;
`;

export const Spinner = styled.span<{ $size?: 'sm' | 'md' | 'lg'; $color?: string }>`
  display: inline-block;
  width: ${(p) => (p.$size === 'sm' ? '16px' : p.$size === 'lg' ? '32px' : '22px')};
  height: ${(p) => (p.$size === 'sm' ? '16px' : p.$size === 'lg' ? '32px' : '22px')};
  border: 2.5px solid ${(p) => p.$color ?? harrisTheme.colors.slate[200]};
  border-top-color: ${(p) => p.$color ?? harrisTheme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

export const DrawerBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 40;
  backdrop-filter: blur(2px);
  ${fadeInAnimation};
`;

interface StyledDrawerProps {
  $position?: 'right' | 'bottom' | 'left';
  $width?: string;
}

export const Drawer = styled.aside<StyledDrawerProps>`
  position: fixed;
  z-index: 50;
  background: ${harrisTheme.colors.white};
  display: flex;
  flex-direction: column;
  max-width: 100vw;

  ${(p) =>
    p.$position === 'right' &&
    css`
      top: 0;
      right: 0;
      height: 100vh;
      width: ${p.$width ?? '480px'};
      max-width: 100vw;
      box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15);
      animation: ${keyframes`
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      `} 260ms cubic-bezier(0.16, 1, 0.3, 1);

      @media (max-width: 640px) {
        width: 100vw;
      }
    `}

  ${(p) =>
    p.$position === 'bottom' &&
    css`
      left: 0;
      right: 0;
      bottom: 0;
      max-height: 92vh;
      border-radius: ${harrisTheme.borderRadius['2xl']} ${harrisTheme.borderRadius['2xl']} 0 0;
      box-shadow: ${harrisTheme.shadows.drawer};
      animation: ${keyframes`
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      `} 280ms cubic-bezier(0.16, 1, 0.3, 1);
    `}

  ${(p) =>
    p.$position === 'left' &&
    css`
      top: 0;
      left: 0;
      height: 100vh;
      width: ${p.$width ?? '480px'};
      max-width: 100vw;
      box-shadow: 8px 0 30px rgba(0, 0, 0, 0.15);
      animation: ${keyframes`
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      `} 260ms cubic-bezier(0.16, 1, 0.3, 1);

      @media (max-width: 640px) {
        width: 100vw;
      }
    `}
`;

export interface DrawerPanelProps {
  open: boolean;
  onClose: () => void;
  position?: 'right' | 'bottom' | 'left';
  width?: string;
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  onAction?: {
    label: string;
    onClick: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
  };
}

export function DrawerPanel({
  open,
  onClose,
  position = 'right',
  width,
  title,
  subtitle,
  onAction,
  children,
}: DrawerPanelProps) {
  if (!open) return null;
  return (
    <>
      <DrawerBackdrop onClick={onClose} />
      <Drawer $position={position} $width={width} role="dialog" aria-modal="true">
        {title && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: `1px solid ${harrisTheme.colors.slate[200]}`,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h3 style={{ marginBottom: subtitle ? '0.25rem' : 0, fontSize: '1.375rem' }}>
                {title}
              </h3>
              {subtitle && (
                <p style={{ fontSize: '0.875rem', color: harrisTheme.colors.slate[500] }}>
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close drawer"
              style={{
                flexShrink: 0,
                width: '36px',
                height: '36px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: harrisTheme.borderRadius.lg,
                color: harrisTheme.colors.slate[600],
                transition: `all ${harrisTheme.transitions.base}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = harrisTheme.colors.slate[100];
                e.currentTarget.style.color = harrisTheme.colors.slate[900];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = harrisTheme.colors.slate[600];
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>{children}</div>
        {onAction && (
          <div
            style={{
              padding: '1rem 1.5rem 1.5rem',
              borderTop: `1px solid ${harrisTheme.colors.slate[200]}`,
              background: harrisTheme.colors.slate[50],
              borderBottomLeftRadius: position === 'bottom' ? harrisTheme.borderRadius['2xl'] : 0,
              borderBottomRightRadius: position === 'bottom' ? harrisTheme.borderRadius['2xl'] : 0,
            }}
          >
            <Button
              variant={onAction.variant ?? 'accent'}
              size="lg"
              fullWidth
              onClick={onAction.onClick}
              disabled={onAction.disabled}
              loading={onAction.loading}
            >
              {onAction.label}
            </Button>
          </div>
        )}
      </Drawer>
    </>
  );
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon = 'mdi:information-outline', title, message, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        background: '#FFFFFF',
        borderRadius: harrisTheme.borderRadius.xl,
        border: `1px dashed ${harrisTheme.colors.slate[300]}`,
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: `${harrisTheme.colors.primary}10`,
          color: harrisTheme.colors.primary,
          display: 'grid',
          placeItems: 'center',
          fontSize: '28px',
          marginBottom: '1rem',
        }}
      >
        <span className="iconify" data-icon={icon}></span>
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: harrisTheme.colors.charcoal, marginBottom: '0.35rem' }}>
        {title}
      </h3>
      {message && (
        <p style={{ fontSize: '0.9rem', color: harrisTheme.colors.slate[500], maxWidth: '420px', lineHeight: 1.5 }}>
          {message}
        </p>
      )}
      {action && (
        <div style={{ marginTop: '1.25rem' }}>
          <Button variant="outline" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

