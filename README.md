# Petino Petshop · Site

Landing page de alta conversão para o **Petino PetShop** (Nova Palhoça, Palhoça - SC).
HTML, CSS e JavaScript puros: não precisa de build nem de dependências.

```
petino-petshop/
├── index.html          ← página
├── styles.css          ← todo o visual (tema azul-claro + verde-limão da marca)
├── script.js           ← configuração, interações, bolhas do cursor e animação de scroll
├── frames/             ← 300 frames do vídeo (540×960, WebP com fundo transparente)
│   ├── frame_0001.webp … frame_0300.webp
│   └── mobile/         ← os mesmos 300 frames em 288×512 (celular e tablet)
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
- **Desktop (≥ 1100 px):** a animação fica numa coluna **fixa na lateral direita**. O conteúdo do site
  deixa espaço para ela, e o frame avança suavemente conforme a página desce
  (0% de rolagem = frame 1, 100% = frame 300).
- **Celular/tablet:** aparece uma mini janela flutuante à direita depois do topo da página.
  Ela usa os frames leves de `frames/mobile/` e pode ser fechada no ×.
- **Pré-carregamento progressivo:** primeiro carrega frames espaçados e depois preenche os intervalos,
  então a animação já funciona antes de tudo terminar. Uma barrinha verde mostra o progresso.
- **Canvas responsivo:** fica nítido em telas retina e mantém a proporção do vídeo (9:16, sem distorcer).
- **`prefers-reduced-motion`:** se o visitante pediu menos movimento, aparece só um frame estático
  (os outros 299 nem são baixados) e as bolhas do cursor ficam desligadas.

Para trocar o vídeo, gere novos frames com o mesmo padrão de nome e ajuste `PETINO.frames`
no topo do `script.js` (quantidade, pasta, extensão).

```bash
# exemplo: 300 frames a partir de um vídeo de 10 s
ffmpeg -i video.mp4 -vf "fps=30,scale=540:-1" -frames:v 300 frames/frame_%04d.webp
```

> Os frames atuais tiveram o fundo preto do vídeo removido, para os pets "flutuarem" sobre o fundo do site.

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
