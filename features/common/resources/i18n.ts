export function translatePasswordOptionsProps(option: PasswordOptionsProps) {
  switch (option) {
    case 'STRONG':
      return 'Forte'
    case 'GOOD':
      return 'Bom'
    default:
      return 'Fraca'
  }
}

export function translateStatus(opt: 'title' | 'description', status: string) {
  if (opt === 'description') {
    if (status === 'true') return 'Ativo'
    return 'Inativo'
  } else if (opt === 'title') {
    if (status === 'true') return 'Bloquear'
    return 'Ativar'
  }
}
