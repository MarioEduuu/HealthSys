import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { api, getApiErrorMessage } from '../services/api'

const initialForm = {
  pacienteId: '',
  sintomas: '',
  nivelRisco: 'MEDIO',
  status: 'ABERTA',
}

function formatDateTime(value) {
  return value ? new Date(value).toLocaleString('pt-BR') : '-'
}

function getRiskClass(risk) {
  if (risk === 'CRITICO' || risk === 'ALTO') {
    return 'status-badge status-danger'
  }

  if (risk === 'MEDIO') {
    return 'status-badge status-warning'
  }

  return 'status-badge status-success'
}

function getStatusClass(status) {
  if (status === 'FINALIZADA') {
    return 'status-badge status-success'
  }

  if (status === 'EM_ANALISE') {
    return 'status-badge status-warning'
  }

  return 'status-badge status-neutral'
}

function Triagens() {
  const [pacientes, setPacientes] = useState([])
  const [triagens, setTriagens] = useState([])
  const [form, setForm] = useState(initialForm)
  const [filterStatus, setFilterStatus] = useState('TODOS')
  const [filterRisk, setFilterRisk] = useState('TODOS')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  async function loadPatients() {
    const { data } = await api.get('/api/patients')
    setPacientes(data)
    if (!form.pacienteId && data.length > 0) {
      setForm((current) => ({ ...current, pacienteId: String(data[0].id) }))
    }
  }

  async function loadTriagens() {
    setIsLoading(true)
    setError('')

    try {
      const { data } = await api.get('/api/triages')
      setTriagens(data)
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, 'Nao foi possivel carregar as triagens.'),
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        await loadPatients()
        await loadTriagens()
      } catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            'Nao foi possivel inicializar o modulo de triagem.',
          ),
        )
        setIsLoading(false)
      }
    }

    bootstrap()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setFeedback('')

    try {
      await api.post('/api/triages', {
        ...form,
        pacienteId: Number(form.pacienteId),
      })
      setForm((current) => ({
        ...initialForm,
        pacienteId: current.pacienteId,
      }))
      setFeedback('Triagem criada com sucesso.')
      await loadTriagens()
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, 'Nao foi possivel criar a triagem.'),
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleStatusChange(id, status) {
    setError('')
    setFeedback('')

    try {
      await api.patch(`/api/triages/${id}/status`, { status })
      setFeedback('Status da triagem atualizado com sucesso.')
      await loadTriagens()
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel atualizar o status da triagem.',
        ),
      )
    }
  }

  const triagensFiltradas = triagens.filter((triagem) => {
    const statusMatch =
      filterStatus === 'TODOS' || triagem.status === filterStatus
    const riskMatch = filterRisk === 'TODOS' || triagem.nivelRisco === filterRisk
    return statusMatch && riskMatch
  })

  const triagensAbertas = triagens.filter((triagem) => triagem.status === 'ABERTA').length
  const triagensEmAnalise = triagens.filter((triagem) => triagem.status === 'EM_ANALISE').length
  const triagensFinalizadas = triagens.filter((triagem) => triagem.status === 'FINALIZADA').length

  return (
    <AppShell
      title="Triagem"
      subtitle="Registro de sintomas, classificacao de risco e atualizacao de status."
      label="Classificacao de risco"
      summary={[
        {
          label: 'Total de triagens',
          value: triagens.length,
          caption: 'Registros ativos na fila de triagem',
        },
        {
          label: 'Abertas',
          value: triagensAbertas,
          caption: 'Casos aguardando a primeira analise',
        },
        {
          label: 'Em analise',
          value: triagensEmAnalise,
          caption: 'Casos sendo acompanhados agora',
        },
        {
          label: 'Finalizadas',
          value: triagensFinalizadas,
          caption: 'Atendimentos triados ja concluidos',
        },
      ]}
      actions={
        <>
          <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
            <option value="TODOS">Todos os status</option>
            <option value="ABERTA">ABERTA</option>
            <option value="EM_ANALISE">EM_ANALISE</option>
            <option value="FINALIZADA">FINALIZADA</option>
          </select>
          <select value={filterRisk} onChange={(event) => setFilterRisk(event.target.value)}>
            <option value="TODOS">Todos os riscos</option>
            <option value="BAIXO">BAIXO</option>
            <option value="MEDIO">MEDIO</option>
            <option value="ALTO">ALTO</option>
            <option value="CRITICO">CRITICO</option>
          </select>
          <button className="button-ghost" type="button" onClick={loadTriagens}>
            Atualizar lista
          </button>
        </>
      }
    >
      <section className="grid-two">
        <article className="form-card">
          <h2 className="panel-title">Nova triagem</h2>
          <p className="panel-copy">
            Ao salvar, o backend publica o evento e gera notificacao.
          </p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="triagem-paciente">Paciente</label>
              <select
                id="triagem-paciente"
                value={form.pacienteId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    pacienteId: event.target.value,
                  }))
                }
                required
              >
                <option value="">Selecione</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="triagem-sintomas">Sintomas</label>
              <textarea
                id="triagem-sintomas"
                rows="4"
                value={form.sintomas}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sintomas: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="triagem-risco">Nivel de risco</label>
                <select
                  id="triagem-risco"
                  value={form.nivelRisco}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      nivelRisco: event.target.value,
                    }))
                  }
                >
                  <option value="BAIXO">BAIXO</option>
                  <option value="MEDIO">MEDIO</option>
                  <option value="ALTO">ALTO</option>
                  <option value="CRITICO">CRITICO</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="triagem-status">Status inicial</label>
                <select
                  id="triagem-status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="ABERTA">ABERTA</option>
                  <option value="EM_ANALISE">EM_ANALISE</option>
                  <option value="FINALIZADA">FINALIZADA</option>
                </select>
              </div>
            </div>

            {feedback ? <div className="feedback feedback-success">{feedback}</div> : null}
            {error ? <div className="feedback feedback-error">{error}</div> : null}

            <div className="button-row">
              <button className="button" type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Criar triagem'}
              </button>
            </div>
          </form>
        </article>

        <article className="list-card">
          <h2 className="panel-title">Triagens registradas</h2>
          <p className="panel-copy">
            Filtre por risco ou status e acompanhe o andamento clinico.
          </p>

          {isLoading ? (
            <div className="empty-state">Carregando triagens...</div>
          ) : triagensFiltradas.length === 0 ? (
            <div className="empty-state">Nenhuma triagem encontrada para os filtros atuais.</div>
          ) : (
            <div className="list">
              {triagensFiltradas.map((triagem) => (
                <article className="list-item" key={triagem.id}>
                  <div className="list-item-header">
                    <strong>{triagem.pacienteNome}</strong>
                    <div className={getRiskClass(triagem.nivelRisco)}>{triagem.nivelRisco}</div>
                  </div>

                  <p className="helper-text">{triagem.sintomas}</p>

                  <div className="detail-row">
                    <div className="detail-chip">{formatDateTime(triagem.dataTriagem)}</div>
                    <div className={getStatusClass(triagem.status)}>{triagem.status}</div>
                  </div>

                  <div className="button-row">
                    <button
                      className="button-ghost"
                      type="button"
                      onClick={() => handleStatusChange(triagem.id, 'EM_ANALISE')}
                    >
                      Marcar EM_ANALISE
                    </button>
                    <button
                      className="button-secondary"
                      type="button"
                      onClick={() => handleStatusChange(triagem.id, 'FINALIZADA')}
                    >
                      Finalizar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </AppShell>
  )
}

export default Triagens
