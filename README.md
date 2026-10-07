# Petino Petshop · Site

Landing page de alta conversão para o **Petino PetShop** (Nova Palhoça, Palhoça - SC).
HTML, CSS e JavaScript puros: não precisa de build nem de dependências.

```
petino-petshop/
├── index.html          ← página
├── styles.css          ← todo o visual (temas azul-marinho e azul-claro + verde-limão da marca)
├── script.js           ← configuração, interações, bolhas de sabão e visualização da foto
└── assets/img/         ← logo, favicon, imagem de compartilhamento e foto da fachada
    ├── fachada-*.webp  ← 800/1200/1920 px (o navegador escolhe) e 3840 px (4K, aberta em tela cheia)
    └── pets/           ← golden, shih tzu, chihuahua e gato com fundo transparente
```

## Rodar localmente

Abra com um servidor local (o mapa precisa de `http://`):

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

Para publicar, envie a pasta inteira para qualquer hospedagem estática
(GitHub Pages, Netlify, Vercel, Hostinger…).

## Fotos dos pets

As quatro fotos enviadas (fundo verde) tiveram o fundo removido por chroma key, com o verde medido em cada foto,
separação de cor na espuma translúcida, remoção do reflexo verde e limpeza das bordas. As faixas brancas acima e
abaixo também foram cortadas. Cada pet tem contorno de sombreamento escuro e sombra projetada (`--pet-shadow`).

| Pet | Onde aparece | Arquivo |
|---|---|---|
| Golden de touca | Topo do site (hero), saindo do círculo | `assets/img/pets/golden.webp` |
| Shih tzu de óculos | Sentado em cima do cartão do Pacote de Banhos | `assets/img/pets/shihtzu.webp` |
| Chihuahua de óculos | Espiando por trás do formulário de agendamento | `assets/img/pets/chihuahua.webp` |
| Gato de toalha | Convite final "Seu pet merece esse carinho" | `assets/img/pets/gato.webp` |

Cada uma tem uma versão `-sm` com metade do tamanho; o navegador baixa só a necessária.

## Foto da fachada (seção "Você acompanha tudo pelo vidro")

A foto enviada (455×486) foi ampliada por IA (Real-ESRGAN) para 4K (3840×4102). O site carrega a versão do tamanho
certo para cada tela; ao clicar na foto, abre a visualização em tela cheia com a versão 4K, e um novo clique amplia
para ver os detalhes (Esc ou × fecha). Letreiros pequenos que já eram ilegíveis na foto original não ganham leitura
com a ampliação: para máxima nitidez, substitua por uma foto original em alta resolução com os mesmos nomes de arquivo.

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
