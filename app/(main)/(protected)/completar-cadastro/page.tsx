'use client'

import { Container } from '@/components/container'
import { FormWrapperSignUpComplete } from '@/features/user/authenticate/components/form-wrapper-sign-up-complete'

export default function SignUpComplete() {
  return (
    <section className="relative bg-[url('/auth-bg.png')] bg-center bg-no-repeat bg-cover">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-0" />
      <Container className="relative z-10 min-h-screen grid grid-cols-1 justify-center items-center">
        <FormWrapperSignUpComplete />
      </Container>
    </section>
  )
}
