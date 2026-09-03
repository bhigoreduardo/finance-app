'use client'

import {
  LockIcon,
  UserIcon,
  MenuIcon,
  GroupIcon,
  LogOutIcon,
  BadgeCheckIcon,
  ReceiptTextIcon,
  ArrowLeftRightIcon,
  LayoutDashboardIcon,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import {
  useOpenAuthenticateAccount,
  useOpenAuthenticatePassword,
} from '@/features/user/authenticate/hooks/use-authenticate'
import { useGetUserCurrent } from '@/features/user/authenticate/api/use-get-user-current'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/container'
import { TitleMessage } from '@/components/title-custom'
import { ButthonTheme, ButtonSignOut } from '@/components/button-custom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const ROUTES = [
  {
    href: '/',
    label: 'Início',
    icon: LayoutDashboardIcon,
  },
  {
    href: '/transacoes',
    label: 'Transações',
    icon: ArrowLeftRightIcon,
  },
  {
    href: '/contas',
    label: 'Contas',
    icon: ReceiptTextIcon,
  },
  {
    href: '/categorias',
    label: 'Categorias',
    icon: GroupIcon,
  },
]

const Route = () => {
  const pathname = usePathname()

  return ROUTES.map((item, index) => (
    <Link key={index} href={item.href}>
      <Button
        variant="ghost"
        className={cn(
          'bg-white/10! text-white hover:text-white w-full',
          pathname === item.href && 'bg-white/80! text-black',
        )}
      >
        <item.icon className="size-4" /> {item.label}
      </Button>
    </Link>
  ))
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: user } = useGetUserCurrent()

  const { onOpen: onOpenAccount } = useOpenAuthenticateAccount()
  const { onOpen: onOpenPassword } = useOpenAuthenticatePassword()

  if (!user) return null

  const { name, image, isOauth } = user

  return (
    <section className="min-h-screen w-screen space-y-8">
      <div className="bg-linear-to-b from-blue-700 to-blue-500 w-full py-4">
        <Container className="space-y-6">
          <header className="flex items-center justify-between py-2">
            <Link href="/" className="flex items-center gap-1 text-white">
              <Image src="/logo.svg" alt="Finance App" width={32} height={32} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Finance App</span>
                <span className="truncate text-xs">Painel Administrativo</span>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <Sheet>
                <SheetTrigger className="lg:hidden">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-white/10! text-white hover:text-white"
                  >
                    <MenuIcon className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Navegação</SheetTitle>
                    <SheetDescription>
                      Navegue entre as páginas do painel administrativo
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 px-4">
                    <Route />
                  </nav>
                </SheetContent>
              </Sheet>
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
          <nav className="hidden lg:flex items-center gap-2">
            <Route />
          </nav>

          <TitleMessage>Bem-vindo ao painel administrativo</TitleMessage>
        </Container>
      </div>
      <Container>{children}</Container>
    </section>
  )
}
