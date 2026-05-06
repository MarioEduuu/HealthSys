import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getApiErrorMessage } from '../services/api'
import { isAuthenticated, saveAuthSession } from '../utils/auth'

const initialRegisterForm = {
  nome: '',
  email: '',
  senha: '',
  perfil: 'ADMIN',
}

const initialLoginForm = {
  email: '',
  senha: '',
}

function Login() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login')
  const [loginForm, setLoginForm] = useState(initialLoginForm)
  const [registerForm, setRegisterForm] = useState(initialRegisterForm)
  const [loginError, setLoginError] = useState('')
  const [registerFeedback, setRegisterFeedback] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  async function handleLogin(event) {
    event.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')

    try {
      const { data } = await api.post('/api/auth/login', loginForm)
      saveAuthSession(data.token, data.usuario)
      navigate('/dashboard')
    } catch (error) {
      setLoginError(
        getApiErrorMessage(error, 'Nao foi possivel realizar o login agora.'),
      )
    } finally {
      setIsLoggingIn(false)
    }
  }

  async function handleRegister(event) {
    event.preventDefault()
    setIsRegistering(true)
    setRegisterFeedback('')
    setRegisterError('')

    try {
      await api.post('/api/auth/register', registerForm)
      setRegisterFeedback('Usuario criado com sucesso. Agora voce ja pode entrar.')
      setLoginForm({
        email: registerForm.email,
        senha: registerForm.senha,
      })
      setRegisterForm(initialRegisterForm)
      setActiveTab('login')
    } catch (error) {
      setRegisterError(
        getApiErrorMessage(error, 'Nao foi possivel criar o usuario agora.'),
      )
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-banner">
          <div className="auth-brand">
            <div className="auth-brand-badge">HS</div>
            <div>
              <strong>HealthSys</strong>
              <span>Gestao hospitalar</span>
            </div>
          </div>

          <div className="auth-banner-content">
            <p className="auth-kicker">Portal de acesso</p>
            <h1>Gestao hospitalar moderna e integrada.</h1>
            <p className="auth-description">
              Cadastro de pacientes, prontuario eletronico, triagem,
              notificacoes e indicadores em uma unica plataforma.
            </p>
          </div>

          <div className="auth-banner-list">
            <div className="auth-banner-item">Autenticacao JWT integrada ao backend Spring Boot</div>
            <div className="auth-banner-item">Perfis ADMIN, PROFISSIONAL_SAUDE, RECEPCAO e GESTOR</div>
            <div className="auth-banner-item">Operacao integrada para equipes assistenciais e administrativas</div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <div>
              <h2>{activeTab === 'login' ? 'Entrar no sistema' : 'Criar usuario'}</h2>
              <p>
                {activeTab === 'login'
                  ? 'Use seu email e senha para abrir a area protegida.'
                  : 'Cadastre um novo usuario para habilitar o acesso inicial.'}
              </p>
            </div>

            <div className="auth-tabs" role="tablist" aria-label="Acoes de autenticacao">
              <button
                className={activeTab === 'login' ? 'auth-tab auth-tab-active' : 'auth-tab'}
                type="button"
                onClick={() => setActiveTab('login')}
              >
                Entrar
              </button>
              <button
                className={activeTab === 'register' ? 'auth-tab auth-tab-active' : 'auth-tab'}
                type="button"
                onClick={() => setActiveTab('register')}
              >
                Criar conta
              </button>
            </div>
          </div>

          {activeTab === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="field">
                <label htmlFor="login-email">E-mail</label>
                <input
                  id="login-email"
                  type="email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="admin@healthsys.com"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="login-senha">Senha</label>
                <input
                  id="login-senha"
                  type="password"
                  value={loginForm.senha}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      senha: event.target.value,
                    }))
                  }
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              {loginError ? (
                <div className="feedback feedback-error">{loginError}</div>
              ) : null}

              <button className="auth-submit" type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="field">
                <label htmlFor="register-nome">Nome</label>
                <input
                  id="register-nome"
                  type="text"
                  value={registerForm.nome}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      nome: event.target.value,
                    }))
                  }
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="register-email">E-mail</label>
                <input
                  id="register-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="voce@healthsys.com"
                  required
                />
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="register-senha">Senha</label>
                  <input
                    id="register-senha"
                    type="password"
                    value={registerForm.senha}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,
                        senha: event.target.value,
                      }))
                    }
                    placeholder="Crie uma senha"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="register-perfil">Perfil</label>
                  <select
                    id="register-perfil"
                    value={registerForm.perfil}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,
                        perfil: event.target.value,
                      }))
                    }
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="PROFISSIONAL_SAUDE">PROFISSIONAL_SAUDE</option>
                    <option value="RECEPCAO">RECEPCAO</option>
                    <option value="GESTOR">GESTOR</option>
                  </select>
                </div>
              </div>

              {registerFeedback ? (
                <div className="feedback feedback-success">
                  {registerFeedback}
                </div>
              ) : null}

              {registerError ? (
                <div className="feedback feedback-error">{registerError}</div>
              ) : null}

              <button
                className="auth-submit"
                type="submit"
                disabled={isRegistering}
              >
                {isRegistering ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}

export default Login
