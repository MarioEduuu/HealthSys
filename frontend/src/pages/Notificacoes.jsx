import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { api, getApiErrorMessage } from '../services/api'

function formatDateTime(value) {
  return value ? new Date(value).toLocaleString('pt-BR') : '-'
}

function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  async function loadNotifications() {
    setIsLoading(true)
    setError('')

    try {
      const { data } = await api.get('/api/notifications')
      setNotificacoes(data)
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel carregar as notificacoes.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  async function markAsRead(id) {
    setError('')
    setFeedback('')

    try {
      await api.patch(`/api/notifications/${id}/read`)
      setFeedback('Notificacao marcada como lida.')
      await loadNotifications()
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel atualizar a notificacao.',
        ),
      )
    }
  }

  const notificacoesNaoLidas = notificacoes.filter(
    (notificacao) => notificacao.status !== 'LIDA',
  ).length
  const notificacoesLidas = notificacoes.length - notificacoesNaoLidas

  return (
    <AppShell
      title="Notificacoes"
      subtitle="Eventos gerados pelo backend a partir da triagem e do fluxo clinico."
      label="Fila de alertas"
      summary={[
        {
          label: 'Total de eventos',
          value: notificacoes.length,
          caption: 'Notificacoes persistidas no sistema',
        },
        {
          label: 'Nao lidas',
          value: notificacoesNaoLidas,
          caption: 'Itens que ainda pedem confirmacao da equipe',
        },
        {
          label: 'Ja lidas',
          value: notificacoesLidas,
          caption: 'Alertas que ja foram processados visualmente',
        },
      ]}
      actions={
        <button className="button-ghost" type="button" onClick={loadNotifications}>
          Atualizar lista
        </button>
      }
    >
      {feedback ? <div className="feedback feedback-success">{feedback}</div> : null}
      {error ? <div className="feedback feedback-error">{error}</div> : null}

      <section className="list-card">
        <h2 className="panel-title">Fila de notificacoes</h2>
        <p className="panel-copy">
          Consulte os eventos persistidos e marque cada item como lido.
        </p>

        {isLoading ? (
          <div className="empty-state">Carregando notificacoes...</div>
        ) : notificacoes.length === 0 ? (
          <div className="empty-state">Nenhuma notificacao encontrada.</div>
        ) : (
          <div className="list">
            {notificacoes.map((notificacao) => (
              <article className="list-item" key={notificacao.id}>
                <div className="list-item-header">
                  <strong>{notificacao.titulo}</strong>
                  <div
                    className={
                      notificacao.status === 'LIDA'
                        ? 'status-badge status-success'
                        : 'status-badge status-warning'
                    }
                  >
                    {notificacao.status}
                  </div>
                </div>

                <p className="helper-text">{notificacao.mensagem}</p>

                <div className="detail-row">
                  <div className="detail-chip">{formatDateTime(notificacao.dataEnvio)}</div>
                  {notificacao.pacienteId ? (
                    <div className="detail-chip">Paciente #{notificacao.pacienteId}</div>
                  ) : null}
                </div>

                {notificacao.status !== 'LIDA' ? (
                  <div className="button-row">
                    <button
                      className="button-secondary"
                      type="button"
                      onClick={() => markAsRead(notificacao.id)}
                    >
                      Marcar como lida
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  )
}

export default Notificacoes
