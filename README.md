# Petino Petshop · Site

Landing page de alta conversão para o **Petino PetShop** (Nova Palhoça, Palhoça - SC).
HTML, CSS e JavaScript puros: não precisa de build nem de dependências.

```
petino-petshop/
├── index.html          ← página
├── styles.css          ← todo o visual (temas azul-marinho e azul-claro + verde-limão da marca)
├── script.js           ← configuração, interações, bolhas do cursor e animação de scroll
├── frames/             ← 300 frames do vídeo (569×1190, WebP com fundo transparente, ~11 MB)
│   ├── frame_0001.webp … frame_0300.webp
│   └── mobile/         ← os mesmos 300 frames em 284×595 (celular e tablet, ~7 MB)
└── assets/img/         ← logo, favicon e imagem de compartilhamento
```

## Rodar localmente

Abra com um servidor local (o canvas e o mapa precisam de `http://`):

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

Para publicar, envie a pasta inteira para qualquer hospedagem estática
(GitHub Pages, Netlify, Vercel, Hostinger…).

## Animação de scroll (sequência de frames)

- **Onde ficam os frames:** a pasta `frames/` precisa estar **na mesma pasta do `index.html`**.
  Os nomes seguem o padrão `frame_0001.webp` … `frame_0300.webp`, e `frames/mobile/` tem os mesmos nomes.
- **Desktop (≥ 1100 px):** a animação fica numa coluna **fixa na lateral direita**, com os pets **bem grandes**:
  a pilha tem o dobro da altura da tela e a rolagem "desce a câmera" do gato (topo da página) até o golden
  (fim da página), enquanto os frames avançam (0% de rolagem = frame 1, 100% = frame 300).
  O tamanho é ajustável em `PETINO.frames.zoom` no `script.js` (`2` = duas telas de altura).
- **Celular/tablet:** aparece uma mini janela flutuante à direita depois do topo da página.
  Ela usa os frames leves de `frames/mobile/` e pode ser fechada no ×.
- **Pré-carregamento progressivo:** primeiro carrega frames espaçados e depois preenche os intervalos,
  então a animação já funciona antes de tudo terminar. Uma barrinha verde mostra o progresso.
- **Canvas responsivo:** fica nítido em telas retina e mantém a proporção do vídeo (9:16, sem distorcer).
- **`prefers-reduced-motion`:** se o visitante pediu menos movimento, aparece só um frame estático com a pilha inteira
  (os outros 299 nem são baixados) e as bolhas ficam desligadas.

Para trocar o vídeo, gere novos frames com o mesmo padrão de nome e ajuste `PETINO.frames`
no topo do `script.js` (quantidade, pasta, extensão).

```bash
# exemplo: 300 frames a partir de um vídeo de 10 s
ffmpeg -i video.mp4 -vf "fps=30,scale=540:-1" -frames:v 300 frames/frame_%04d.webp
```

> Os frames atuais tiveram o fundo preto do vídeo removido (com limpeza das bordas) e foram recortados na área dos pets,
> para eles "flutuarem" sobre o fundo do site. Se trocar por frames sem recorte, ajuste `crop` e `focusX` no `script.js`.

## Bolhas de sabão

- No computador, poucas bolhas pequenas seguem o cursor.
- **Clique (ou toque) em qualquer lugar:** uma bolha enche no ponteiro e estoura em gotinhas.
  Bolhas do rastro perto do clique também estouram.

## Cor de fundo (azul-marinho ou azul-claro)

O site abre em **azul-marinho**. O botão **"Fundo"** no cabeçalho troca para azul-claro, e a escolha fica salva no navegador.
Também dá para forçar pela URL: `?tema=claro` ou `?tema=marinho`.
Para definir o padrão, mude `data-theme="navy"` (ou `"light"`) na tag `<html>` do `index.html`.
Se decidirem por um só, é só remover o botão `.theme-toggle` do cabeçalho.

## Configuração rápida (topo do `script.js`)

| Campo | O que é |
|---|---|
| `whatsapp` | Número com DDI+DDD, só números. **Confirme se `554833000909` é o WhatsApp da loja.** |
| `instagram` | Link do perfil. **Confirme o @ correto.** |
| `mapsQuery` | Endereço usado no mapa, no "Como chegar" e no link das avaliações. |

Todos os botões "Agendar" abrem o WhatsApp com a mensagem pronta. O formulário monta uma mensagem
com tutor, pet, porte, serviço, adicionais, dia e período.

## Revisar antes de publicar

- Preços (pacote R$190, tosa higiênica R$15, adicionais R$30/35/45) vieram das artes do Instagram.
  Atualize no `index.html` sempre que mudarem.
- O horário aparece como "atendimento até às 19h". Se quiser, complete com os dias da semana.
- Os textos de serviço (farmácia, rações, acessórios) são genéricos; ajuste ao mix real da loja.
