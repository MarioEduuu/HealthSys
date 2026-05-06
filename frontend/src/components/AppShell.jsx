import { NavLink, useNavigate } from 'react-router-dom'
import { clearAuthSession, getStoredUser } from '../utils/auth'

const navigationItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    caption: 'Indicadores',
    code: 'D',
  },
  {
    to: '/pacientes',
    label: 'Pacientes',
    caption: 'Cadastros',
    code: 'P',
  },
  {
    to: '/prontuario',
    label: 'Prontuario',
    caption: 'Historico',
    code: 'R',
  },
  {
    to: '/triagens',
    label: 'Triagem',
    caption: 'Risco',
    code: 'T',
  },
  {
    to: '/notificacoes',
    label: 'Notificacoes',
    caption: 'Alertas',
    code: 'N',
  },
  {
    to: '/relatorios',
    label: 'Relatorios',
    caption: 'Gestao',
    code: 'G',
  },
  {
    to: '/usuarios',
    label: 'Usuarios',
    caption: 'Acessos',
    code: 'U',
  },
]

function AppShell({
  title,
  subtitle,
  label = 'Operacao hospitalar',
  actions,
  summary = [],
  children,
}) {
  const navigate = useNavigate()
  const user = getStoredUser()

  function handleLogout() {
    clearAuthSession()
    navigate('/login')
  }

  return (
    <div className="healthsys-page lovable-page">
      <div className="lovable-shell">
        <aside className="lovable-sidebar">
          <div className="lovable-brand">
            <div className="lovable-brand-mark">H</div>
            <div>
              <strong>HealthSys</strong>
              <span>Gestao Hospitalar</span>
            </div>
          </div>

          <nav className="lovable-nav" aria-label="Modulos do sistema">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'lovable-nav-link lovable-nav-link-active' : 'lovable-nav-link'
                }
              >
                <div className="lovable-nav-icon">{item.code}</div>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.caption}</span>
                </div>
              </NavLink>
            ))}
          </nav>

          <div className="lovable-user-card">
            <div className="lovable-avatar">
              {(user?.nome ?? 'AD')
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div className="lovable-user-copy">
              <strong>{user?.nome ?? 'Admin'}</strong>
              <span>{user?.perfil ?? 'Administrador'}</span>
            </div>
            <button className="lovable-logout" type="button" onClick={handleLogout} aria-label="Sair">
              Sair
            </button>
          </div>
        </aside>

        <main className="lovable-main">
          <header className="lovable-header">
            <div>
              <p className="lovable-kicker">{label}</p>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>

            {actions ? <div className="lovable-actions">{actions}</div> : null}
          </header>

          {summary.length > 0 ? (
            <section className="lovable-summary-grid">
              {summary.map((item) => (
                <article className="lovable-summary-card" key={`${item.label}-${item.value}`}>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                  <span>{item.caption}</span>
                </article>
              ))}
            </section>
          ) : null}

          <div className="lovable-content">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default AppShell
