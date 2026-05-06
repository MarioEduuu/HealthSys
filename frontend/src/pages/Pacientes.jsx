import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { api, getApiErrorMessage } from '../services/api'

const initialPacienteForm = {
  nome: '',
  dataNascimento: '',
  sexo: 'MASCULINO',
  telefone: '',
  email: '',
  endereco: '',
}

const MAX_PHONE_DIGITS = 11
const PHONE_FORMATTED_LENGTH = 16
const MAX_ADDRESS_LENGTH = 200
const TODAY = new Date().toISOString().slice(0, 10)

function formatSexo(sexo) {
  const labels = {
    MASCULINO: 'Masculino',
    FEMININO: 'Feminino',
    OUTRO: 'Outro',
  }

  return labels[sexo] ?? sexo
}

function onlyDigits(value) {
  return value.replace(/\D/g, '').slice(0, MAX_PHONE_DIGITS)
}

function formatPhone(value) {
  const digits = onlyDigits(value)

  if (!digits) {
    return ''
  }

  if (digits.length <= 2) {
    return `(${digits}`
  }

  if (digits.length <= 3) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`
}

function normalizeDateInput(value) {
  const [year = '', month = '', day = ''] = value.split('-')
  const normalizedYear = year.replace(/\D/g, '').slice(0, 4)
  const normalizedMonth = month.replace(/\D/g, '').slice(0, 2)
  const normalizedDay = day.replace(/\D/g, '').slice(0, 2)

  return [normalizedYear, normalizedMonth, normalizedDay]
    .filter(Boolean)
    .join('-')
    .slice(0, 10)
}

function normalizePacientePayload(form) {
  return {
    ...form,
    nome: form.nome.trim(),
    telefone: formatPhone(form.telefone),
    email: form.email.trim() || null,
    endereco: form.endereco.trim(),
  }
}

function Pacientes() {
  const [pacientes, setPacientes] = useState([])
  const [form, setForm] = useState(initialPacienteForm)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  async function loadPacientes(nome = '') {
    setIsLoading(true)
    setError('')

    try {
      const endpoint = nome.trim()
        ? `/api/patients/search?nome=${encodeURIComponent(nome.trim())}`
        : '/api/patients'
      const { data } = await api.get(endpoint)
      setPacientes(data)
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel carregar a lista de pacientes.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPacientes()
  }, [])

  function resetForm() {
    setForm(initialPacienteForm)
    setEditingId(null)
  }

  function handleDateChange(value) {
    setForm((current) => ({
      ...current,
      dataNascimento: normalizeDateInput(value),
    }))
  }

  function handlePhoneChange(value) {
    setForm((current) => ({
      ...current,
      telefone: formatPhone(value),
    }))
  }

  function handleAddressChange(value) {
    setForm((current) => ({
      ...current,
      endereco: value.slice(0, MAX_ADDRESS_LENGTH),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setFeedback('')
    setError('')

    try {
      if (onlyDigits(form.telefone).length !== MAX_PHONE_DIGITS) {
        setError('Informe um telefone com 11 digitos, no formato (85) 9 9999-9999.')
        return
      }

      const payload = normalizePacientePayload(form)

      if (editingId) {
        await api.put(`/api/patients/${editingId}`, payload)
        setFeedback('Paciente atualizado com sucesso.')
      } else {
        await api.post('/api/patients', payload)
        setFeedback('Paciente cadastrado com sucesso.')
      }

      resetForm()
      await loadPacientes(searchTerm)
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel salvar o paciente.',
        ),
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deseja realmente excluir este paciente?')) {
      return
    }

    setError('')
    setFeedback('')

    try {
      await api.delete(`/api/patients/${id}`)
      if (editingId === id) {
        resetForm()
      }
      setFeedback('Paciente removido com sucesso.')
      await loadPacientes(searchTerm)
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel excluir o paciente.',
        ),
      )
    }
  }

  function handleEdit(paciente) {
    setEditingId(paciente.id)
    setForm({
      nome: paciente.nome ?? '',
      dataNascimento: paciente.dataNascimento ?? '',
      sexo: paciente.sexo ?? 'MASCULINO',
      telefone: formatPhone(paciente.telefone ?? ''),
      email: paciente.email ?? '',
      endereco: (paciente.endereco ?? '').slice(0, MAX_ADDRESS_LENGTH),
    })
    setFeedback('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSearch(event) {
    event.preventDefault()
    await loadPacientes(searchTerm)
  }

  const totalPacientes = pacientes.length
  const statusFormulario = editingId ? 'Edicao em andamento' : 'Cadastro aberto'

  return (
    <AppShell
      title="Pacientes"
      subtitle="CRUD completo com busca por nome, edicao e exclusao integradas ao backend."
      label="Gestao assistencial"
      summary={[
        {
          label: 'Pacientes visiveis',
          value: totalPacientes,
          caption: searchTerm ? 'Resultado do filtro atual por nome' : 'Lista atual carregada do backend',
        },
        {
          label: 'Modo do formulario',
          value: statusFormulario,
          caption: editingId ? 'Um registro esta pronto para ajuste' : 'Pronto para receber um novo cadastro',
        },
        {
          label: 'Busca ativa',
          value: searchTerm ? searchTerm : 'Sem filtro',
          caption: 'Use a busca para localizar rapidamente um cadastro',
        },
      ]}
      actions={
        <>
          <button className="button-ghost" type="button" onClick={() => loadPacientes(searchTerm)}>
            Atualizar lista
          </button>
          {editingId ? (
            <button className="button-danger" type="button" onClick={resetForm}>
              Cancelar edicao
            </button>
          ) : null}
        </>
      }
    >
      <section className="grid-two">
        <article className="form-card">
          <h2 className="panel-title">
            {editingId ? `Editar paciente #${editingId}` : 'Novo paciente'}
          </h2>
          <p className="panel-copy">
            Preencha os dados essenciais do cadastro e envie para o banco.
          </p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="paciente-nome">Nome</label>
              <input
                id="paciente-nome"
                type="text"
                value={form.nome}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
                placeholder="Joao Silva"
                required
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="paciente-data">Data de nascimento</label>
                <input
                  id="paciente-data"
                  type="date"
                  min="1900-01-01"
                  max={TODAY}
                  maxLength={10}
                  value={form.dataNascimento}
                  onChange={(event) => handleDateChange(event.target.value)}
                  onInput={(event) => {
                    event.currentTarget.value = normalizeDateInput(event.currentTarget.value)
                  }}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="paciente-sexo">Sexo</label>
                <select
                  id="paciente-sexo"
                  value={form.sexo}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sexo: event.target.value,
                    }))
                  }
                >
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="paciente-telefone">Telefone</label>
                <input
                  id="paciente-telefone"
                  type="text"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={PHONE_FORMATTED_LENGTH}
                  pattern="\\(\\d{2}\\) \\d \\d{4}-\\d{4}"
                  value={form.telefone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  placeholder="(85) 9 9999-9999"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="paciente-email">E-mail</label>
                <input
                  id="paciente-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="paciente@email.com"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="paciente-endereco">Endereço</label>
              <input
                id="paciente-endereco"
                type="text"
                value={form.endereco}
                maxLength={MAX_ADDRESS_LENGTH}
                onChange={(event) => handleAddressChange(event.target.value)}
                placeholder="Rua, numero e bairro"
              />
              <small className="field-hint">
                {form.endereco.length}/{MAX_ADDRESS_LENGTH} caracteres
              </small>
            </div>

            {feedback ? (
              <div className="feedback feedback-success">{feedback}</div>
            ) : null}

            {error ? <div className="feedback feedback-error">{error}</div> : null}

            <div className="button-row">
              <button className="button" type="submit" disabled={isSaving}>
                {isSaving
                  ? 'Salvando...'
                  : editingId
                    ? 'Salvar alteracoes'
                    : 'Cadastrar paciente'}
              </button>
            </div>
          </form>
        </article>

        <article className="list-card">
          <div className="toolbar">
            <div>
              <h2 className="panel-title">Lista atual</h2>
              <p className="panel-copy">
                Consulte os cadastros ou filtre pelo nome do paciente.
              </p>
            </div>

            <form className="search-row" onSubmit={handleSearch}>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nome"
              />
              <button className="button-ghost" type="submit">
                Buscar
              </button>
            </form>
          </div>

          {isLoading ? (
            <div className="empty-state">Carregando pacientes...</div>
          ) : pacientes.length === 0 ? (
            <div className="empty-state">
              Nenhum paciente encontrado para o filtro atual.
            </div>
          ) : (
            <div className="list">
              {pacientes.map((paciente) => (
                <article className="list-item" key={paciente.id}>
                  <div className="list-item-header">
                    <strong>{paciente.nome}</strong>
                    <div className="detail-chip">ID {paciente.id}</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-chip">
                      Nascimento: {paciente.dataNascimento}
                    </div>
                    <div className="detail-chip">
                      Sexo: {formatSexo(paciente.sexo)}
                    </div>
                    <div className="detail-chip">
                      Telefone: {paciente.telefone}
                    </div>
                    {paciente.email ? (
                      <div className="detail-chip">Email: {paciente.email}</div>
                    ) : null}
                  </div>

                  {paciente.endereco ? (
                    <p className="helper-text">{paciente.endereco}</p>
                  ) : null}

                  <div className="button-row">
                    <button
                      className="button-ghost"
                      type="button"
                      onClick={() => handleEdit(paciente)}
                    >
                      Editar
                    </button>
                    <button
                      className="button-danger"
                      type="button"
                      onClick={() => handleDelete(paciente.id)}
                    >
                      Excluir
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

export default Pacientes
