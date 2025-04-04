# Frontend para Sistema de Gerenciamento de Eventos

Este é o frontend para um sistema de gerenciamento de eventos, construído utilizando HTML, CSS e JavaScript.
Ele interage com um backend Java para fornecer funcionalidades como adicionar eventos, listar eventos, adicionar participantes, etc.

## Visão Geral

Este frontend oferece uma interface de usuário para as seguintes funcionalidades principais:

* **Adicionar Evento:** Permite criar novos eventos, especificando nome, data e informações de localização (CEP, número e complemento).
* **Adicionar Participante:** Permite registrar novos participantes no sistema, informando nome, e-mail e idade.
* **Listar Participantes:** Exibe uma lista de todos os participantes cadastrados.
* **Listar Eventos:** Exibe uma tabela com todos os eventos cadastrados, incluindo ID, nome, data, localização e número de participantes.
* **Buscar Evento por Nome:** Permite pesquisar detalhes de um evento específico informando o seu nome.
* **Editar Evento:** Permite carregar os detalhes de um evento existente para edição e salvar as alterações.
* **Adicionar Participante a Evento:** Permite vincular um participante já cadastrado a um evento específico, utilizando seus IDs.
* **Remover Participante de Evento:** Permite desvincular um participante de um evento específico.
* **Deletar Evento:** Permite remover um evento do sistema utilizando o seu ID.

## Tecnologias Utilizadas

* **HTML:** Estrutura da página web.
* **CSS:** Estilização visual da interface (arquivo `styles.css`).
* **JavaScript:** Lógica de interação com o usuário e comunicação com o backend (arquivo `script.js`).

## Pré-requisitos

* Um navegador web moderno (Chrome, Firefox, Edge, etc.).
* O backend Java correspondente deve estar em execução e acessível na URL configurada no arquivo `script.js`.

## Configuração

1.  **Clonar o Repositório**
2.  **Acessar os Arquivos:** Navegue até o diretório onde os arquivos `index.html`, `styles.css` e `script.js` estão localizados.
3.  **Executar o Frontend:** Abra o arquivo `index.html` diretamente no seu navegador web.

## Configuração do Backend

Este frontend foi desenvolvido para interagir com um backend Java que expõe as seguintes APIs:

* **`POST /events/v2`:** Adiciona um novo evento. Espera um corpo JSON com os campos: `name`, `date`, `cep`, `numero`, `complemento`.
* **`GET /events/v2`:** Lista todos os eventos.
* **`GET /events/v2/{eventName}`:** Busca um evento pelo nome.
* **`GET /events/v2/id/{eventId}`:** Busca um evento pelo ID para edição.
* **`PUT /events/v2/update/{eventId}`:** Atualiza um evento existente. Espera um corpo JSON com os campos a serem atualizados.
* **`PUT /events/v2/addParticipant/{participantId}/{eventName}`:** Adiciona um participante a um evento.
* **`PUT /events/v2/removeParticipant/{participantId}/{eventName}`:** Remove um participante de um evento.
* **`DELETE /events/v2/deleteEvent/{eventId}`:** Deleta um evento.
* **`POST /participant`:** Adiciona um novo participante. Espera um corpo JSON com os campos: `name`, `email`, `age`.
* **`GET /participant`:** Lista todos os participantes.

**Importante:** As URLs base (`apiUrlEvents` e `apiUrlParticipant`) estão definidas no início do arquivo `script.js`.

## Estrutura de Arquivos

├── index.html      # Arquivo HTML principal
├── styles.css      # Arquivo de estilos CSS
└── script.js       # Arquivo com a lógica JavaScript
