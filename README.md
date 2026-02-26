# Redes Neurais Artificiais

Aplicação educacional para visualização interativa de conceitos de redes neurais, com foco inicial em Perceptron.

## Stack

- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vitest

## Requisitos

- Node.js `^20.19.0` ou `^22.13.0` (ou `>=24`)
- npm `>=10`

## Como rodar localmente

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:8080`.

## Scripts

- `npm run dev`: inicia ambiente de desenvolvimento em `:8080`
- `npm run build`: gera build de produção
- `npm run start`: sobe o servidor de produção em `:8080`
- `npm run lint`: roda ESLint
- `npm run test`: executa testes com Vitest
- `npm run test:watch`: executa testes em modo watch

## Rotas

- `/` redireciona para `/perceptron`
- `/perceptron`
- `/adaline`
- `/mlp`
- `/svm`
