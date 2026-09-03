import { toast } from 'sonner'
import { useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    'Esse e-mail já está cadastrado. Entre com email e senha para acessar.',
  AccessDenied: 'Acesso negado. Verifique as permissões da sua conta Google.',
  OAuthSignin: 'Não foi possível iniciar o login com Google. Tente novamente.',
  OAuthCallback: 'Falha na autenticação com Google. Tente novamente.',
}

export const FormSocialAuthenticate = () => {
  const searchParams = useSearchParams()

  const onClick = (provider: 'user-google-credentials') => {
    signIn(provider, {
      callbackUrl: '/',
    })
  }

  useEffect(() => {
    const error = searchParams.get('error')
    if (!error) return

    toast.error(errorMessages[error] ?? 'Erro ao autenticar. Tente novamente.')
  }, [searchParams])

  return (
    <div>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick('user-google-credentials')}
      >
        <FcGoogle className="size-4" /> Acessar com Google
      </Button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        ou
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  )
}
