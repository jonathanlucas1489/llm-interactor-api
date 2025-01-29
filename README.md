## Project Overview

# ⚙️ Paggo OCR - Backend  
Este é o backend do sistema de OCR desenvolvido para o case técnico da **Paggo**. Ele processa uploads de imagens, realiza extração de texto via OCR, interage com um LLM para respostas contextuais e gerencia autenticação de usuários.  

## 🚀 Funcionalidades  
✔ Upload de imagens (via ImageKit)  
✔ Extração de texto via OCR  
✔ Interação com LLM para explicações sobre o texto extraído  
✔ Armazenamento de documentos e interações no banco de dados  
✔ Autenticação de usuários (bcrypt + JWT) 


### Prerequisites

Ensure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server

Start the server in development mode:
```bash
npm run start:dev
```

The server will run on [http://localhost:3030](http://localhost:3030) by default.

### Running Tests

Run unit tests:
```bash
npm run test
```

Run end-to-end tests:
```bash
npm run test:e2e
```

Check test coverage:
```bash
npm run test:cov
```
