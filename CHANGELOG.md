# Changelog

Todas as mudanças importantes do CertiID devem ser registradas neste arquivo.

O projeto usa versionamento semântico:

- `MAJOR`: mudança grande ou incompatível.
- `MINOR`: nova funcionalidade sem quebrar o sistema.
- `PATCH`: correção pequena ou ajuste sem nova funcionalidade.

## [1.1.0] - 2026-05-14

### Adicionado

- Configurações gerais da agência salvas no Supabase.
- Edição completa de usuários na aba Configurações > Usuários.
- Campos administrativos no perfil do usuário: vínculo, parceiro, documento, telefone, cidade e observações.
- Permissões por checkbox para definir quais áreas cada usuário pode acessar.
- Migration `sql/settings_users_permissions_migration.sql`.

### Corrigido

- Botão Salvar Alterações da aba Geral agora persiste os dados.
- Canetinha da aba Usuários deixou de editar somente o perfil e passou a editar o cadastro completo.

### Banco de Dados

- Nova tabela `app_settings`.
- Novas colunas em `profiles` para vínculos e permissões.
- Trigger de novos usuários atualizada para preencher permissões iniciais.

## [1.0.0] - 2026-05-14

### Adicionado

- Fluxo de aprovação de novos usuários.
- Novos cadastros nascem inativos e aguardam liberação do administrador.
- Manual de atualização do projeto.
- README central com links úteis.

