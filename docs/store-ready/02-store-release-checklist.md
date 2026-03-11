# SEA Store-Ready - Release Checklist

## 1. Produto e UX

- [ ] Fluxo de onboarding funcional em mobile e tablet.
- [ ] Home sem overlap de elementos em todos os breakpoints.
- [ ] Simulacoes com modo degradado para devices fracos.
- [ ] Mensagens de erro compreensiveis em rede ruim/offline.

## 2. Performance

- [ ] Lazy loading em modulos pesados (3D, graficos, editor).
- [ ] Imagens otimizadas e sem assets maiores que o necessario.
- [ ] Bundle inicial monitorado por rota critica.
- [ ] FPS aceitavel em telas 3D (meta: >=30 em mobile medio).

## 3. Acessibilidade

- [ ] Contraste minimo AA em telas principais.
- [ ] Focus visivel para navegacao por teclado.
- [ ] Labels e aria em inputs clinicos.
- [ ] Suporte a fonte ampliada sem quebra de layout.

## 4. Seguranca e dados

- [ ] Sem chave secreta no client.
- [ ] Politica de privacidade publicada.
- [ ] Termos de uso atualizados para contexto clinico educacional.
- [ ] Consentimento para analytics e cookies quando aplicavel.

## 5. Loja Android (Play Store)

- [ ] Build AAB assinado.
- [ ] Icones e screenshots por categoria de device.
- [ ] Politica de dados no Play Console.
- [ ] Teste interno fechado aprovado.

## 6. Loja iOS (App Store)

- [ ] Certificados e provisioning corretos.
- [ ] TestFlight com build estavel.
- [ ] Privacy Nutrition Labels preenchido.
- [ ] Revisao de permissao (camera, notificacao, etc) apenas se usada.

## 7. Observabilidade

- [ ] Captura de erro em producao ativa.
- [ ] Eventos chave de funil mapeados.
- [ ] Painel de crash-free sessions definido.
- [ ] Alertas de regressao configurados.

## Definition of Done (Release Candidate)

- [ ] Todos os itens de prioridade alta concluidos.
- [ ] Testes manuais na matriz minima executados.
- [ ] Sem bug bloqueador aberto para iOS/Android/Web.
