import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { api, getApiErrorMessage } from '../services/api'

const initialProntuarioForm = { historicoClinico: '', observacoesGerais: '' }
const initialConsultaForm = { dataConsulta: '', descricao: '', conduta: '' }
const initialExameForm = { tipoExame: '', dataExame: '', resultado: '' }
const initialMedicamentoForm = { nome: '', dosagem: '', frequencia: '', duracao: '' }
const initialVacinaForm = { nomeVacina: '', dataAplicacao: '' }

function formatDateTime(value) {
  return value ? new Date(value).toLocaleString('pt-BR') : '-'
}

function Prontuario() {
  const [pacientes, setPacientes] = useState([])
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [prontuario, setProntuario] = useState(null)
  const [recordMissing, setRecordMissing] = useState(false)
  const [prontuarioForm, setProntuarioForm] = useState(initialProntuarioForm)
  const [consultaForm, setConsultaForm] = useState(initialConsultaForm)
  const [exameForm, setExameForm] = useState(initialExameForm)
  const [medicamentoForm, setMedicamentoForm] = useState(initialMedicamentoForm)
  const [vacinaForm, setVacinaForm] = useState(initialVacinaForm)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  async function loadPatients() {
    try {
      const { data } = await api.get('/api/patients')
      setPacientes(data)
      if (!selectedPatientId && data.length > 0) {
        setSelectedPatientId(String(data[0].id))
      }
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, 'Nao foi possivel carregar os pacientes.'),
      )
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const selectedPatient = pacientes.find(
    (paciente) => String(paciente.id) === selectedPatientId,
  )
  const totalConsultas = prontuario?.consultas?.length ?? 0
  const totalExames = prontuario?.exames?.length ?? 0
  const totalMedicamentos = prontuario?.medicamentos?.length ?? 0
  const totalVacinas = prontuario?.vacinas?.length ?? 0

  async function loadProntuario(patientId = selectedPatientId) {
    if (!patientId) {
      return
    }

    setIsBusy(true)
    setError('')
    setFeedback('')

    try {
      const { data } = await api.get(`/api/medical-records/patient/${patientId}`)
      setProntuario(data)
      setProntuarioForm({
        historicoClinico: data.historicoClinico ?? '',
        observacoesGerais: data.observacoesGerais ?? '',
      })
      setRecordMissing(false)
    } catch (requestError) {
      if (requestError?.response?.status === 404) {
        setProntuario(null)
        setRecordMissing(true)
        setProntuarioForm(initialProntuarioForm)
        setFeedback('Paciente sem prontuario. Preencha o formulario para criar.')
      } else {
        setError(
          getApiErrorMessage(
            requestError,
            'Nao foi possivel carregar o prontuario.',
          ),
        )
      }
    } finally {
      setIsBusy(false)
    }
  }

  async function handleSaveProntuario(event) {
    event.preventDefault()
    if (!selectedPatientId) {
      setError('Selecione um paciente para continuar.')
      return
    }

    setError('')
    setFeedback('')

    try {
      const payload = {
        pacienteId: Number(selectedPatientId),
        historicoClinico: prontuarioForm.historicoClinico,
        observacoesGerais: prontuarioForm.observacoesGerais,
      }

      const { data } = recordMissing || !prontuario
        ? await api.post('/api/medical-records', payload)
        : await api.put(`/api/medical-records/${prontuario.id}`, {
            historicoClinico: prontuarioForm.historicoClinico,
            observacoesGerais: prontuarioForm.observacoesGerais,
          })

      setProntuario(data)
      setRecordMissing(false)
      setFeedback('Prontuario salvo com sucesso.')
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, 'Nao foi possivel salvar o prontuario.'),
      )
    }
  }

  async function handlePost(endpoint, form, successMessage, reset, shouldReload = false) {
    if (!prontuario && !endpoint.includes('/vacinas')) {
      setError('Crie ou carregue um prontuario antes de continuar.')
      return
    }

    try {
      const response = await api.post(endpoint, form)
      if (shouldReload) {
        await loadProntuario()
      } else {
        setProntuario(response.data)
      }
      reset()
      setFeedback(successMessage)
      setError('')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Nao foi possivel salvar o registro.'))
    }
  }

  return (
    <AppShell
      title="Prontuario"
      subtitle="Historico clinico, consultas, exames, medicamentos e vacinas do paciente."
      label="Historico clinico"
      summary={[
        {
          label: 'Paciente em foco',
          value: selectedPatient?.nome ?? 'Selecione um paciente',
          caption: 'Registro clinico exibido na tela',
        },
        {
          label: 'Status do prontuario',
          value: prontuario ? 'Carregado' : recordMissing ? 'Ainda nao criado' : 'Nao carregado',
          caption: 'Situacao atual do historico clinico',
        },
        {
          label: 'Itens clinicos',
          value: totalConsultas + totalExames + totalMedicamentos + totalVacinas,
          caption: 'Consultas, exames, medicamentos e vacinas do paciente',
        },
      ]}
      actions={
        <>
          <select
            value={selectedPatientId}
            onChange={(event) => setSelectedPatientId(event.target.value)}
          >
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nome}
              </option>
            ))}
          </select>
          <button className="button-ghost" type="button" onClick={() => loadProntuario()}>
            {isBusy ? 'Carregando...' : 'Carregar prontuario'}
          </button>
        </>
      }
    >
      {feedback ? <div className="feedback feedback-success">{feedback}</div> : null}
      {error ? <div className="feedback feedback-error">{error}</div> : null}

      <section className="grid-two">
        <article className="form-card">
          <h2 className="panel-title">
            {recordMissing || !prontuario ? 'Criar prontuario' : 'Editar prontuario'}
          </h2>
          <form className="form-grid" onSubmit={handleSaveProntuario}>
            <div className="field">
              <label htmlFor="prontuario-historico">Historico clinico</label>
              <textarea
                id="prontuario-historico"
                rows="5"
                value={prontuarioForm.historicoClinico}
                onChange={(event) =>
                  setProntuarioForm((current) => ({
                    ...current,
                    historicoClinico: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="field">
              <label htmlFor="prontuario-observacoes">Observacoes gerais</label>
              <textarea
                id="prontuario-observacoes"
                rows="3"
                value={prontuarioForm.observacoesGerais}
                onChange={(event) =>
                  setProntuarioForm((current) => ({
                    ...current,
                    observacoesGerais: event.target.value,
                  }))
                }
              />
            </div>

            <div className="button-row">
              <button className="button" type="submit">
                Salvar prontuario
              </button>
            </div>
          </form>
        </article>

        <article className="list-card">
          <h2 className="panel-title">Resumo do paciente</h2>
          {!prontuario ? (
            <div className="empty-state">Nenhum prontuario carregado.</div>
          ) : (
            <div className="stack-block">
              <div className="detail-row">
                <div className="detail-chip">{prontuario.pacienteNome}</div>
                <div className="detail-chip">Criado: {formatDateTime(prontuario.createdAt)}</div>
              </div>
              <article className="note-card">
                <strong>Historico clinico</strong>
                <p>{prontuario.historicoClinico}</p>
              </article>
              <article className="note-card">
                <strong>Observacoes</strong>
                <p>{prontuario.observacoesGerais || 'Sem observacoes gerais.'}</p>
              </article>
            </div>
          )}
        </article>
      </section>

      <section className="grid-two">
        <article className="panel">
          <h2 className="panel-title">Consulta</h2>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault()
              handlePost(
                `/api/medical-records/${prontuario?.id}/consultas`,
                consultaForm,
                'Consulta adicionada com sucesso.',
                () => setConsultaForm(initialConsultaForm),
              )
            }}
          >
            <div className="field">
              <label htmlFor="consulta-data">Data e hora</label>
              <input
                id="consulta-data"
                type="datetime-local"
                value={consultaForm.dataConsulta}
                onChange={(event) =>
                  setConsultaForm((current) => ({
                    ...current,
                    dataConsulta: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="field">
              <label htmlFor="consulta-descricao">Descricao</label>
              <textarea
                id="consulta-descricao"
                rows="3"
                value={consultaForm.descricao}
                onChange={(event) =>
                  setConsultaForm((current) => ({
                    ...current,
                    descricao: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="field">
              <label htmlFor="consulta-conduta">Conduta</label>
              <textarea
                id="consulta-conduta"
                rows="2"
                value={consultaForm.conduta}
                onChange={(event) =>
                  setConsultaForm((current) => ({
                    ...current,
                    conduta: event.target.value,
                  }))
                }
              />
            </div>
            <button className="button-secondary" type="submit">
              Adicionar consulta
            </button>
          </form>
        </article>

        <article className="panel">
          <h2 className="panel-title">Exame</h2>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault()
              handlePost(
                `/api/medical-records/${prontuario?.id}/exames`,
                exameForm,
                'Exame adicionado com sucesso.',
                () => setExameForm(initialExameForm),
              )
            }}
          >
            <div className="field">
              <label htmlFor="exame-tipo">Tipo</label>
              <input
                id="exame-tipo"
                type="text"
                value={exameForm.tipoExame}
                onChange={(event) =>
                  setExameForm((current) => ({
                    ...current,
                    tipoExame: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="field">
              <label htmlFor="exame-data">Data e hora</label>
              <input
                id="exame-data"
                type="datetime-local"
                value={exameForm.dataExame}
                onChange={(event) =>
                  setExameForm((current) => ({
                    ...current,
                    dataExame: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="field">
              <label htmlFor="exame-resultado">Resultado</label>
              <textarea
                id="exame-resultado"
                rows="3"
                value={exameForm.resultado}
                onChange={(event) =>
                  setExameForm((current) => ({
                    ...current,
                    resultado: event.target.value,
                  }))
                }
              />
            </div>
            <button className="button-secondary" type="submit">
              Adicionar exame
            </button>
          </form>
        </article>
      </section>

      <section className="grid-two">
        <article className="panel">
          <h2 className="panel-title">Medicamento</h2>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault()
              handlePost(
                `/api/medical-records/${prontuario?.id}/medicamentos`,
                medicamentoForm,
                'Medicamento adicionado com sucesso.',
                () => setMedicamentoForm(initialMedicamentoForm),
              )
            }}
          >
            <div className="form-row">
              <div className="field">
                <label htmlFor="medicamento-nome">Nome</label>
                <input
                  id="medicamento-nome"
                  type="text"
                  value={medicamentoForm.nome}
                  onChange={(event) =>
                    setMedicamentoForm((current) => ({
                      ...current,
                      nome: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="medicamento-dosagem">Dosagem</label>
                <input
                  id="medicamento-dosagem"
                  type="text"
                  value={medicamentoForm.dosagem}
                  onChange={(event) =>
                    setMedicamentoForm((current) => ({
                      ...current,
                      dosagem: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="medicamento-frequencia">Frequencia</label>
                <input
                  id="medicamento-frequencia"
                  type="text"
                  value={medicamentoForm.frequencia}
                  onChange={(event) =>
                    setMedicamentoForm((current) => ({
                      ...current,
                      frequencia: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="medicamento-duracao">Duracao</label>
                <input
                  id="medicamento-duracao"
                  type="text"
                  value={medicamentoForm.duracao}
                  onChange={(event) =>
                    setMedicamentoForm((current) => ({
                      ...current,
                      duracao: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            <button className="button-secondary" type="submit">
              Adicionar medicamento
            </button>
          </form>
        </article>

        <article className="panel">
          <h2 className="panel-title">Vacina</h2>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault()
              handlePost(
                `/api/patients/${selectedPatientId}/vacinas`,
                vacinaForm,
                'Vacina adicionada com sucesso.',
                () => setVacinaForm(initialVacinaForm),
                true,
              )
            }}
          >
            <div className="field">
              <label htmlFor="vacina-nome">Nome</label>
              <input
                id="vacina-nome"
                type="text"
                value={vacinaForm.nomeVacina}
                onChange={(event) =>
                  setVacinaForm((current) => ({
                    ...current,
                    nomeVacina: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="field">
              <label htmlFor="vacina-data">Data</label>
              <input
                id="vacina-data"
                type="date"
                value={vacinaForm.dataAplicacao}
                onChange={(event) =>
                  setVacinaForm((current) => ({
                    ...current,
                    dataAplicacao: event.target.value,
                  }))
                }
                required
              />
            </div>
            <button className="button-secondary" type="submit">
              Registrar vacina
            </button>
          </form>
        </article>
      </section>

      {prontuario ? (
        <section className="grid-two">
          <article className="list-card">
            <h2 className="panel-title">Consultas e exames</h2>
            <div className="list">
              {prontuario.consultas.map((consulta) => (
                <article className="list-item" key={`consulta-${consulta.id}`}>
                  <strong>Consulta em {formatDateTime(consulta.dataConsulta)}</strong>
                  <p className="helper-text">{consulta.descricao}</p>
                </article>
              ))}
              {prontuario.exames.map((exame) => (
                <article className="list-item" key={`exame-${exame.id}`}>
                  <strong>{exame.tipoExame}</strong>
                  <p className="helper-text">{formatDateTime(exame.dataExame)}</p>
                </article>
              ))}
              {prontuario.consultas.length === 0 && prontuario.exames.length === 0 ? (
                <div className="empty-state">Nenhuma consulta ou exame cadastrado.</div>
              ) : null}
            </div>
          </article>

          <article className="list-card">
            <h2 className="panel-title">Medicamentos e vacinas</h2>
            <div className="list">
              {prontuario.medicamentos.map((medicamento) => (
                <article className="list-item" key={`med-${medicamento.id}`}>
                  <strong>{medicamento.nome}</strong>
                  <div className="detail-row">
                    <div className="detail-chip">{medicamento.dosagem}</div>
                    <div className="detail-chip">{medicamento.frequencia}</div>
                    <div className="detail-chip">{medicamento.duracao}</div>
                  </div>
                </article>
              ))}
              {prontuario.vacinas.map((vacina) => (
                <article className="list-item" key={`vac-${vacina.id}`}>
                  <strong>{vacina.nomeVacina}</strong>
                  <p className="helper-text">{vacina.dataAplicacao}</p>
                </article>
              ))}
              {prontuario.medicamentos.length === 0 && prontuario.vacinas.length === 0 ? (
                <div className="empty-state">Nenhum medicamento ou vacina cadastrado.</div>
              ) : null}
            </div>
          </article>
        </section>
      ) : null}
    </AppShell>
  )
}

export default Prontuario
