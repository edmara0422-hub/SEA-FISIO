# SEA Store-Ready - Device Matrix

## Objetivo

Garantir que o app funcione com qualidade em celular, tablet e desktop, em iOS/Android/Web.

## Breakpoints base

- `mobile-sm`: 320x568
- `mobile-md`: 360x800
- `mobile-lg`: 414x896
- `tablet-portrait`: 768x1024
- `tablet-landscape`: 1024x768
- `desktop-md`: 1366x768
- `desktop-lg`: 1920x1080

## Matriz minima de testes

| Classe | Sistema | Navegador/App | Resolucao | Prioridade |
| --- | --- | --- | --- | --- |
| Mobile | Android 13+ | Chrome + App nativo | 360x800 | Alta |
| Mobile | iOS 17+ | Safari + App nativo | 390x844 | Alta |
| Tablet | Android 13+ | Chrome + App nativo | 800x1280 | Alta |
| Tablet | iPadOS 17+ | Safari + App nativo | 820x1180 | Alta |
| Desktop | macOS | Chrome/Safari | 1440x900 | Media |
| Desktop | Windows | Chrome/Edge | 1366x768 | Media |

## Itens obrigatorios por classe

### Mobile

- Hit area minima de 44x44 px em botoes.
- Sem overflow horizontal em nenhuma tela.
- Conteudo principal acima da dobra em telas 360x800.
- Safe area aplicada (top/bottom) para notch e barra gestual.

### Tablet

- Layout de 2 colunas onde fizer sentido clinico (painel + simulacao).
- Sidebar/menus sem sobrepor grafico principal.
- Tipografia minima legivel a distancia (>=14px texto base).

### Desktop

- Uso eficiente de largura com max-width por secao.
- Atalhos de teclado em formularios extensos.
- Estados de loading e erro visiveis sem bloquear fluxo.

## Criterios de aceite globais

- CLS visual baixo (sem salto de layout perceptivel).
- Navegacao completa por toque e teclado.
- Sem travamento ao alternar orientacao portrait/landscape.
- Tempo de abertura percebida < 3s em rede 4G media.
