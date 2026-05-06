import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { api, getApiErrorMessage } from '../services/api'

const initialSummary = {
  totalUsuariosAtivos: 0,
  totalPacientes: 0,
  totalTriagensAbertas: 0,
  totalNotificacoesNaoLidas: 0,
  totalProntuarios: 0,
}

function Relatorios() {
  const [summary, setSummary] = useState(initialSummary)
  const [error, setError] = useState('')

  async function loadSummary() {
    setError('')

    try {
      const { data } = await api.get('/api/dashboard/summary')
      setSummary(data)
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel carregar os relatorios resumidos.',
        ),
      )
    }
  }

  useEffect(() => {
    loadSummary()
  }, [])

  return (
    <AppShell
      title="Relatorios"
      subtitle="Painel simples de apoio gerencial com indicadores do backend."
      label="Visao gerencial"
      summary={[
        {
          label: 'Usuarios ativos',
          value: summary.totalUsuariosAtivos,
          caption: 'Base atual de acessos autorizados',
        },
        {
          label: 'Pacientes',
          value: summary.totalPacientes,
          caption: 'Volume total de cadastros persistidos',
        },
        {
          label: 'Prontuarios',
          value: summary.totalProntuarios,
          caption: 'Historicos clinicos estruturados no sistema',
        },
        {
          label: 'Alertas pendentes',
          value: summary.totalNotificacoesNaoLidas,
          caption: 'Eventos ainda sem leitura confirmada',
        },
      ]}
      actions={
        <button className="button-ghost" type="button" onClick={loadSummary}>
          Atualizar relatorio
        </button>
      }
    >
      {error ? <div className="feedback feedback-error">{error}</div> : null}

      <section className="grid-two">
        <article className="panel">
          <h2 className="panel-title">Leitura gerencial</h2>
          <p className="panel-copy">
            Este resumo permite validar rapidamente o estado do sistema durante a apresentacao.
          </p>
          <div className="list">
            <article className="list-item">
              <strong>Triagens abertas</strong>
              <p className="helper-text">
                {summary.totalTriagensAbertas} atendimentos aguardando andamento clinico.
              </p>
            </article>
            <article className="list-item">
              <strong>Notificacoes nao lidas</strong>
              <p className="helper-text">
                {summary.totalNotificacoesNaoLidas} itens ainda sem confirmacao na interface.
              </p>
            </article>
          </div>
        </article>

        <article className="panel">
          <h2 className="panel-title">Checklist de validacao</h2>
          <div className="list">
            <article className="list-item">
              <strong>Usuarios e autenticacao</strong>
              <p className="helper-text">Registro, login JWT e protecao de rotas.</p>
            </article>
            <article className="list-item">
              <strong>Pacientes e prontuario</strong>
              <p className="helper-text">CRUD, historico clinico e vacinas.</p>
            </article>
            <article className="list-item">
              <strong>Triagem e notificacoes</strong>
              <p className="helper-text">Evento gerado no backend e leitura pelo frontend.</p>
            </article>
          </div>
        </article>
      </section>
    </AppShell>
  )
}

export default Relatorios
