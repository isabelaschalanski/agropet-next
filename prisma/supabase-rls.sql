-- Rodar UMA vez no Supabase: SQL Editor → New query → colar → Run
-- (depois do  npx prisma db push, que cria as tabelas)
--
-- Liga o RLS (Row Level Security) em todas as tabelas. Sem nenhuma regra (policy),
-- ninguém consegue ler nem gravar pela API pública do Supabase.
-- O site continua funcionando, porque ele usa o Prisma, que entra como dono das tabelas.
-- Isso protege, por exemplo, as senhas e os dados dos clientes.

DO $$
DECLARE t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END $$;

-- Conferir: todas as linhas devem mostrar rowsecurity = true
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
