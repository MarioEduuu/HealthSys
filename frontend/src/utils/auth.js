const TOKEN_KEY = 'healthsys.token'
const USER_KEY = 'healthsys.user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

export function saveAuthSession(token, usuario) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: usuario?.id,
      nome: usuario?.nome,
      email: usuario?.email,
      perfil: usuario?.perfil,
      ativo: usuario?.ativo,
    }),
  )
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
