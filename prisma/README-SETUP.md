# Setup do Banco de Dados

## Problema
As tabelas `User`, `Cart` e `CartItem` não existem no banco de dados ainda.

## Solução Rápida (Recomendada)

Execute no terminal:

```bash
npm run db:setup
```

Isso vai:
1. Aplicar todas as migrations pendentes
2. Regenerar o Prisma Client

## Solução Manual

### Opção 1: Usar Prisma Migrate

```bash
# Aplicar migrations
npx prisma migrate deploy

# Regenerar Prisma Client
npx prisma generate
```

### Opção 2: Executar SQL diretamente

Execute o arquivo `setup-database-simple.sql` no seu banco MySQL:

```bash
# Via linha de comando MySQL
mysql -h 72.60.241.215 -P 3310 -u root -p vivence_joias < prisma/setup-database-simple.sql
```

Ou copie e cole o conteúdo do arquivo `setup-database-simple.sql` no seu cliente MySQL (phpMyAdmin, MySQL Workbench, etc.).

## Verificar se funcionou

Após aplicar, reinicie o servidor Next.js e teste:
- Login/Cadastro deve funcionar
- Carrinho deve funcionar
- Não deve mais aparecer erro "table does not exist"

## Scripts Disponíveis

- `npm run db:migrate` - Aplica migrations pendentes
- `npm run db:generate` - Regenera Prisma Client
- `npm run db:setup` - Aplica migrations + regenera client
- `npm run db:reset` - ⚠️ RESETA TUDO (apaga todos os dados)
