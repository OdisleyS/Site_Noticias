# Projeto: Site de Notícias com RSS Feed

Este é um projeto de um site de notícias que consome RSS Feed, desenvolvido com **Spring Boot** no backend e **Next.js** no frontend. O backend utiliza um banco de dados **PostgreSQL** para gerenciar informações.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js  
- **Backend:** Spring Boot  
- **Banco de Dados:** PostgreSQL  

---

## 🚀 Como Executar o Projeto

### Frontend

1. **Instale as dependências do projeto**:  
   Execute o comando `npm install`.

2. **Instale o Next.js**:  
   Execute o comando `npm install next`.

3. **Inicie o servidor de desenvolvimento**:  
   Execute o comando `npm run dev`.  

   O frontend estará disponível em `http://localhost:3000`.

---

### Backend

1. **Configure o banco de dados**:  
   - Certifique-se de que o **PostgreSQL** está instalado e rodando.  
   - Crie um banco de dados para o projeto.

2. **Configure as credenciais no arquivo `application.properties`**:  
   Localizado em `src/main/resources/application.properties`.  
   Configure os campos abaixo:  
   - `spring.datasource.url=jdbc:postgresql://<SEU_HOST>:<SUA_PORTA>/<SEU_BANCO>`  
   - `spring.datasource.username=postgres`  
   - `spring.datasource.password=postgres`  
   - `spring.application.name=atividade1`  

3. **Execute o backend**:  
   Use sua IDE ou execute o comando `./mvnw spring-boot:run`.  

   O backend estará disponível em `http://localhost:8080`.

---

## 📂 Estrutura do Projeto

- **Frontend:** Implementado com Next.js para uma interface moderna e responsiva.  
- **Backend:** Desenvolvido com Spring Boot, responsável por consumir o RSS Feed e fornecer dados ao frontend.  
- **Banco de Dados:** Armazena informações relacionadas às notícias e usuários.  

---

## 📌 Configurações Adicionais

### Alterar URL do Banco de Dados

No arquivo `application.properties`, localize e altere o seguinte campo:  
`spring.datasource.url=jdbc:postgresql://<SEU_HOST>:<SUA_PORTA>/<SEU_BANCO>`  

Substitua `<SEU_HOST>`, `<SUA_PORTA>` e `<SEU_BANCO>` pelas informações do seu banco.

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para utilizá-lo e modificá-lo.

---

## 🧑‍💻 Contribuição

- **Everson Menezes Santos**  
- **Gabriel Carvalho Santos:**  
- **Odisley Nascimento Santos:** 

---

