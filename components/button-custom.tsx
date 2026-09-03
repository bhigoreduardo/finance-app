import { useTheme } from 'next-themes'
import { signOut } from 'next-auth/react'
import { LogOutIcon, MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ButthonTheme() {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      size="icon"
      className="text-white"
    >
      <MoonIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <SunIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export const ButtonSignOut = () => {
  const handleSignOut = () => {
    signOut()
  }

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      size="icon"
      className="text-white"
    >
      <LogOutIcon className="size-4" />
    </Button>
  )
}
