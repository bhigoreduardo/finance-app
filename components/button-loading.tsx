import * as React from 'react'
import { Loader2Icon } from 'lucide-react'
import { VariantProps } from 'class-variance-authority'

import { Button, buttonVariants } from '@/components/ui/button'

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  blocked?: boolean
  asChild?: boolean
}

export const ButtonLoading = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, disabled, blocked, ...props },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        className={className}
        variant={variant}
        size={size}
        asChild={asChild}
        disabled={disabled || blocked}
        {...props}
      >
        {disabled || blocked ? (
          <>
            {!blocked ? (
              <>
                <Loader2Icon className="animate-spin size-4 text-slate-300" />
                Aguarde...
              </>
            ) : (
              props.children
            )}
          </>
        ) : (
          props.children
        )}
      </Button>
    )
  },
)
ButtonLoading.displayName = 'ButtonLoading'
