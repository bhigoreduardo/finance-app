import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { VariantProps } from 'class-variance-authority'

import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  blocked?: boolean
  asChild?: boolean
  hidden?: boolean
}

export const ButtonLabel = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { label: string; icon?: LucideIcon }
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      hidden = false,
      disabled,
      blocked,
      label,
      icon: Icon,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col">
        <Label className="text-xs text-muted-foreground mb-1 ml-1">
          {label}
        </Label>
        <Button
          ref={ref}
          className={className}
          variant={variant}
          size={size}
          asChild={asChild}
          disabled={disabled || blocked}
          {...props}
        >
          {Icon && <Icon className="size-4" />}
          {props.children}
        </Button>
      </div>
    )
  },
)
ButtonLabel.displayName = 'ButtonLabel'
