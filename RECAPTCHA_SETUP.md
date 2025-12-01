# Configuração do reCAPTCHA

## Para habilitar o reCAPTCHA em produção:

1. **Acesse o Google reCAPTCHA Console:**
   - Vá para: https://www.google.com/recaptcha/admin
   - Faça login com sua conta Google

2. **Crie um novo site:**
   - Clique em "Adicionar"
   - Escolha reCAPTCHA v2 (checkbox)
   - Digite seu domínio (ex: hallofjersey.com)

3. **Obtenha as chaves:**
   - **Chave do site (pública)** - para o frontend
   - **Chave secreta (privada)** - para o backend

4. **Configure no arquivo .env:**
   ```env
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY="sua-chave-publica-aqui"
   RECAPTCHA_SECRET_KEY="sua-chave-secreta-aqui"
   ```

5. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

## Status atual:
- ✅ **Desenvolvimento**: reCAPTCHA desabilitado (facilita testes)
- ⚠️ **Produção**: reCAPTCHA será obrigatório quando as chaves forem configuradas

## Comportamento:
- Sem chaves configuradas: reCAPTCHA não aparece
- Com chaves configuradas: reCAPTCHA obrigatório para envio dos formulários