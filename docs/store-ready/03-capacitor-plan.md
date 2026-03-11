# SEA Store-Ready - Plano Native (Capacitor)

## Objetivo

Empacotar o app web atual para iOS e Android com minimo retrabalho, mantendo uma base unica de codigo.

## Estrategia recomendada para este projeto

Como o app usa rotas de API do Next.js, a abordagem mais segura e usar app hospedado (web app em producao) dentro do container nativo.

- Web app fica deployado (ex: Vercel).
- Capacitor abre a URL de producao via webview.
- APIs continuam funcionando no backend do Next.

## Fase 1 - Preparacao Web

- Confirmar build de producao sem erro: `npm run build`.
- Definir URL base para assets e rotas.
- Revisar manifest e icones para uso mobile.

## Fase 2 - Setup Capacitor

1. Instalar dependencias:
   - `npm i @capacitor/core @capacitor/cli`
   - `npm i -D @capacitor/assets`
2. Inicializar Capacitor:
   - `npx cap init SEA com.sea.app`
3. Adicionar plataformas:
   - `npm i @capacitor/android @capacitor/ios`
   - `npx cap add android`
   - `npx cap add ios`
4. Configurar `capacitor.config` para app hospedado:
   - `server.url = https://seu-dominio-do-sea`
   - `server.cleartext = false`

## Fase 3 - Pipeline de build

- Criar script de sync das plataformas:
  - `npx cap sync`
- Abrir IDE nativas:
  - `npx cap open android`
  - `npx cap open ios`

## Fase 4 - Plugins nativos (somente se necessario)

- Push notifications.
- Biometria/login seguro.
- File system para export clinico.
- Haptics e status bar.

## Fase 5 - Publicacao

### Android

- Gerar AAB release no Android Studio.
- Subir em Internal Testing no Play Console.

### iOS

- Gerar Archive no Xcode.
- Distribuir via TestFlight antes da App Store.

## Riscos conhecidos

- Next.js app router exige atencao em rotas e assets no webview.
- Modulos 3D pesados podem exigir downgrade grafico em devices de entrada.
- Permissoes nativas devem ser estritamente minimas para facilitar aprovacao.

## Opcao alternativa (nao recomendada para fase atual)

Usar build estatico (`output: 'export'`) e `webDir` local. Essa opcao nao cobre bem APIs do Next e tende a exigir retrabalho arquitetural.

## Criterio de sucesso

- Mesmo app em Web + Android + iOS com comportamento consistente nas telas criticas.
