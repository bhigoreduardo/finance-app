'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { BadgeCheckIcon, LockIcon, LogOutIcon, UserIcon } from 'lucide-react'

import {
  useOpenAuthenticateAccount,
  useOpenAuthenticatePassword,
} from '@/features/user/authenticate/hooks/use-authenticate'
import { useGetUserCurrent } from '@/features/user/authenticate/api/use-get-user-current'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Container } from '@/components/container'
import { ButthonTheme, ButtonSignOut } from '@/components/button-custom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: user } = useGetUserCurrent()

  const { onOpen: onOpenAccount } = useOpenAuthenticateAccount()
  const { onOpen: onOpenPassword } = useOpenAuthenticatePassword()

  if (!user) return null

  const { name, image, isOauth } = user

  return (
    <section className="min-h-screen w-screen space-y-8">
      <div className="bg-linear-to-b from-blue-700 to-blue-500 w-full">
        <Container>
          <header className="flex items-center justify-between py-2">
            <Link href="/" className="flex items-center gap-1 text-white">
              <Image src="/logo.svg" alt="Finance App" width={32} height={32} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Finance App</span>
                <span className="truncate text-xs">Painel Administrativo</span>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <ButthonTheme />
              <ButtonSignOut />
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <Avatar className="size-8 rounded-sm">
                    <AvatarImage src={image ?? undefined} alt={name} />
                    <AvatarFallback className="rounded-sm">
                      <UserIcon />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onOpenAccount}>
                    <BadgeCheckIcon className="size-4" />
                    Conta
                  </DropdownMenuItem>
                  {!isOauth && (
                    <DropdownMenuItem onClick={onOpenPassword}>
                      <LockIcon className="size-4" />
                      Segurança
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      signOut()
                    }}
                    variant="destructive"
                  >
                    <LogOutIcon className="size-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        </Container>
      </div>
      <Container>{children}</Container>
    </section>
  )
}
