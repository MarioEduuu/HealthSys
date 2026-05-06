import axios from 'axios'
import { clearAuthSession, getToken } from '../utils/auth'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthSession()
    }

    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error, fallbackMessage) {
  if (!error?.response) {
    return `Nao foi possivel conectar ao backend em ${API_BASE_URL}.`
  }

  const data = error?.response?.data

  if (error.response?.status === 404) {
    return 'O endpoint solicitado nao foi encontrado no backend. Reinicie o Spring Boot se necessario.'
  }

  if (typeof data === 'string') {
    return data
  }

  if (data?.mensagem) {
    return data.mensagem
  }

  if (Array.isArray(data?.details) && data.details.length > 0) {
    return data.details[0]
  }

  if (data?.erro) {
    return data.erro
  }

  if (data?.message) {
    return data.message
  }

  if (data?.detail) {
    return data.detail
  }

  return fallbackMessage
}
