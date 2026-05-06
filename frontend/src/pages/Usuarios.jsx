import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { api, getApiErrorMessage } from '../services/api'

const initialForm = {
  nome: '',
  email: '',
  senha: '',
  perfil: 'PROFISSIONAL_SAUDE',
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  async function loadUsuarios() {
    setIsLoading(true)
    setError('')

    try {
      const { data } = await api.get('/api/users')
      setUsuarios(data)
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel carregar a lista de usuarios.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  const totalUsuarios = usuarios.length
  const usuariosAtivos = usuarios.filter((usuario) => usuario.ativo).length
  const usuariosInativos = totalUsuarios - usuariosAtivos

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setFeedback('')

    try {
      await api.post('/api/auth/register', form)
      setForm(initialForm)
      setFeedback('Usuario criado com sucesso.')
      await loadUsuarios()
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel cadastrar o usuario.',
        ),
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleToggleStatus(usuario) {
    setError('')
    setFeedback('')

    try {
      await api.patch(`/api/users/${usuario.id}/status`, {
        ativo: !usuario.ativo,
      })
      setFeedback('Status do usuario atualizado com sucesso.')
      await loadUsuarios()
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Nao foi possivel atualizar o status do usuario.',
        ),
      )
    }
  }

  return (
    <AppShell
      title="Usuarios"
      subtitle="Cadastro de perfis, listagem de acessos e alteracao de status."
      label="Controle de acesso"
      summary={[
        {
          label: 'Total de usuarios',
          value: totalUsuarios,
          caption: 'Contas cadastradas no sistema',
        },
        {
          label: 'Usuarios ativos',
          value: usuariosAtivos,
          caption: 'Perfis habilitados para uso imediato',
        },
        {
          label: 'Usuarios inativos',
          value: usuariosInativos,
          caption: 'Contas que estao temporariamente bloqueadas',
        },
      ]}
      actions={
        <button className="button-ghost" type="button" onClick={loadUsuarios}>
          Atualizar lista
        </button>
      }
    >
      <section className="grid-two">
        <article className="form-card">
          <h2 className="panel-title">Novo usuario</h2>
          <p className="panel-copy">
            Use o mesmo endpoint de registro para criar acessos adicionais.
          </p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="usuario-nome">Nome</label>
              <input
                id="usuario-nome"
                type="text"
                value={form.nome}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
                placeholder="Profissional responsavel"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="usuario-email">E-mail</label>
              <input
                id="usuario-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="profissional@healthsys.com"
                required
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="usuario-senha">Senha</label>
                <input
                  id="usuario-senha"
                  type="password"
                  value={form.senha}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      senha: event.target.value,
                    }))
                  }
                  placeholder="123456"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="usuario-perfil">Perfil</label>
                <select
                  id="usuario-perfil"
                  value={form.perfil}
                  onChange={(event) =>
                    setForm((current) => ({
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

            {feedback ? (
              <div className="feedback feedback-success">{feedback}</div>
            ) : null}

            {error ? <div className="feedback feedback-error">{error}</div> : null}

            <div className="button-row">
              <button className="button" type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Cadastrar usuario'}
              </button>
            </div>
          </form>
        </article>

        <article className="list-card">
          <h2 className="panel-title">Usuarios cadastrados</h2>
          <p className="panel-copy">
            Visualize perfil e status de cada conta ativa no sistema.
          </p>

          {isLoading ? (
            <div className="empty-state">Carregando usuarios...</div>
          ) : usuarios.length === 0 ? (
            <div className="empty-state">Nenhum usuario cadastrado ainda.</div>
          ) : (
            <div className="list">
              {usuarios.map((usuario) => (
                <article className="list-item" key={usuario.id}>
                  <div className="list-item-header">
                    <strong>{usuario.nome}</strong>
                    <div className="detail-chip">{usuario.perfil}</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-chip">{usuario.email}</div>
                    <div className={usuario.ativo ? 'status-badge status-success' : 'status-badge status-danger'}>
                      {usuario.ativo ? 'ATIVO' : 'INATIVO'}
                    </div>
                  </div>

                  <div className="button-row">
                    <button
                      className={usuario.ativo ? 'button-danger' : 'button-ghost'}
                      type="button"
                      onClick={() => handleToggleStatus(usuario)}
                    >
                      {usuario.ativo ? 'Desativar' : 'Reativar'}
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

export default Usuarios
