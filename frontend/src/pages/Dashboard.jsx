import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { api, getApiErrorMessage } from '../services/api'

const initialSummary = {
  totalUsuariosAtivos: 0,
  totalPacientes: 0,
  totalTriagensAbertas: 0,
  totalNotificacoesNaoLidas: 0,
  totalProntuarios: 0,
}

const modules = [
  {
    title: 'Usuarios',
    description: 'Cadastre novos perfis, acompanhe status e organize acessos.',
    to: '/usuarios',
  },
  {
    title: 'Pacientes',
    description: 'Busca por nome, edicao e remocao.',
    to: '/pacientes',
  },
  {
    title: 'Prontuario',
    description: 'Historico clinico, consultas, exames, medicamentos e vacinas.',
    to: '/prontuario',
  },
  {
    title: 'Triagem',
    description: 'Registre sintomas, risco e acompanhe o status do atendimento.',
    to: '/triagens',
  },
  {
    title: 'Notificacoes',
    description: 'Consulte eventos gerados pela triagem e marque como lidos.',
    to: '/notificacoes',
  },
  {
    title: 'Relatorios',
    description: 'Cards gerenciais resumindo o estado atual da plataforma.',
    to: '/relatorios',
  },
]

function Dashboard() {
  const [summary, setSummary] = useState(initialSummary)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadSummary() {
    setIsLoading(true)
    setError('')

    try {
      const { data } = await api.get('/api/dashboard/summary')
      setSummary(data)
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel carregar os indicadores do dashboard.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [])

  return (
    <AppShell
      title="Dashboard hospitalar"
      subtitle="Acompanhe os principais indicadores da operacao hospitalar em tempo real."
      label="Central de operacao"
      summary={[
        {
          label: 'Usuarios ativos',
          value: summary.totalUsuariosAtivos,
          caption: 'Contas autorizadas para operar o sistema',
        },
        {
          label: 'Pacientes',
          value: summary.totalPacientes,
          caption: 'Cadastros ativos na base hospitalar',
        },
        {
          label: 'Triagens abertas',
          value: summary.totalTriagensAbertas,
          caption: 'Casos que ainda exigem acompanhamento',
        },
        {
          label: 'Notificacoes',
          value: summary.totalNotificacoesNaoLidas,
          caption: 'Alertas aguardando leitura da equipe',
        },
      ]}
      actions={
        <button className="button-ghost" type="button" onClick={loadSummary}>
          {isLoading ? 'Atualizando...' : 'Atualizar indicadores'}
        </button>
      }
    >
      {error ? <div className="feedback feedback-error">{error}</div> : null}

      <section className="module-grid">
        {modules.map((module) => (
          <article className="panel module-card" key={module.to}>
            <h2 className="panel-title">{module.title}</h2>
            <p className="panel-copy">{module.description}</p>
            <Link className="button" to={module.to}>
              Abrir modulo
            </Link>
          </article>
        ))}
      </section>
    </AppShell>
  )
}

export default Dashboard
