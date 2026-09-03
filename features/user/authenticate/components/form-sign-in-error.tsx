import { PhoneIcon, TriangleAlertIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormWrapper } from '@/components/form-wrapper'

export const FormSignInError = () => {
  const onClick = () =>
    window.open(
      'https://wa.me/5527998311970?text=Olá!%20Estou%20com%20problemas%20para%20fazer%20login.',
      '_blank',
    )

  return (
    <FormWrapper
      title="Oops! Alguma coisa deu errado"
      description="Tente fazer o login novamente."
      redirectTo="Entrar"
      url="/entrar"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 justify-center">
          <TriangleAlertIcon className="text-destructive" />
          <p>
            Verifique seus dados de conta, caso não tenta sucesso, entre em
            contato com suporte.
          </p>
        </div>
        <Button className="w-full" onClick={onClick}>
          <PhoneIcon className="size-4" /> Falar com suporte
        </Button>
      </div>
    </FormWrapper>
  )
}
