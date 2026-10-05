# Petino Petshop · Site

Landing page de alta conversão para o **Petino PetShop** (Nova Palhoça, Palhoça - SC).
HTML, CSS e JavaScript puros: não precisa de build nem de dependências.

```
petino-petshop/
├── index.html          ← página
├── styles.css          ← todo o visual (temas azul-marinho e azul-claro + verde-limão da marca)
├── script.js           ← configuração, interações, bolhas do cursor e animação de scroll
├── frames/             ← 300 frames do vídeo, WebP com fundo transparente
│   ├── frame_0001.webp … frame_0300.webp   ← 569×1190 (camada base do computador)
│   ├── 4k/             ← 1707×3570, recorte de quadros 4K ampliados por IA (baixados sob demanda)
│   └── mobile/         ← 426×891 (celular e tablet)
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

## Animação de scroll (sequência de frames ao fundo do site)

- **Onde ficam os frames:** a pasta `frames/` precisa estar **na mesma pasta do `index.html`**.
  Os nomes seguem o padrão `frame_0001.webp` … `frame_0300.webp`, iguais nas três subpastas.
- **Ao fundo:** os pets ficam numa camada fixa **atrás de todo o conteúdo**. Os cards e formulários passam na frente,
  e uma névoa na cor do fundo os integra à página: mais forte do lado do texto e suave nas bordas.
- **Sombra de contorno:** um contorno fino com sombra projetada dá profundidade (`--pets-shadow` no `styles.css`,
  com versões próprias para o tema marinho e o claro).
- **Pets grandes, vistos rolando:** a pilha tem ~2 alturas de tela e a rolagem "desce a câmera" do gato
  (topo da página) até o golden (fim da página), enquanto os frames avançam (0% = frame 1, 100% = frame 300).
  Ajustes no `script.js`: `zoom` (tamanho), `anchorX` (posição horizontal).
- **4K sob demanda:** os frames foram ampliados por IA (Real-ESRGAN) para 4K. Como 300 frames 4K pesariam ~60 MB,
  o site carrega primeiro uma camada leve (rolagem fluida) e, quando a rolagem desacelera, busca em 4K
  o frame atual e os vizinhos (`hiWindow`), mantendo no máximo `hiCache` frames 4K na memória.
  O 4K só é baixado em telas onde ele faz diferença (retina, monitores 2K/4K).
- **Celular/tablet:** mesmos pets ao fundo, mais discretos, com a camada `mobile/` (e `frames/` como reforço de nitidez).
- **Pré-carregamento progressivo:** primeiro carrega frames espaçados e depois preenche os intervalos,
  então a animação já funciona antes de tudo terminar.
- **Canvas responsivo:** fica nítido em telas retina e mantém a proporção do vídeo (sem distorcer).
- **`prefers-reduced-motion`:** se o visitante pediu menos movimento, aparece só um frame estático com a pilha inteira
  (os outros 299 nem são baixados) e as bolhas ficam desligadas.

Para trocar o vídeo, gere novos frames com o mesmo padrão de nome nas três resoluções e ajuste `PETINO.frames`
no topo do `script.js` (quantidade, pastas, alturas de cada camada).

```bash
# exemplo simples (sem IA): 300 frames a partir de um vídeo de 10 s
ffmpeg -i video.mp4 -vf "fps=30,scale=569:-1" -frames:v 300 frames/frame_%04d.webp
```

> Os frames atuais tiveram o fundo preto do vídeo removido (com limpeza das bordas), foram recortados na área dos pets
> (o recorte de um quadro 4K 2160×3840 é 1707×3570) e ampliados por IA. Se trocar por frames sem recorte, ajuste `focusX`.

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
