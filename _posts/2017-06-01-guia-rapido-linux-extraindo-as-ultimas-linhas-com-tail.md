---
layout: post
comments: true
postid: "guia-linux-tail"
series: "Guia Rápido Linux"
title: "Extraindo as últimas linhas com tail"
description: "Guia rápido para extrair as linhas finais de um arquivo usando o tail."
language: pt
date: 2017-06-01 18:15:00 -0300
author: Eric Yuzo
categories: [linux, shell]
---
Para extrair as últimas linhas de um arquivo qualquer, podemos usar o `tail`:

```bash
tail [ARQUIVO]
```

Exemplo:

![imagem mostrando o tail em ação]({{ "/img/posts/2017-06-01-tail.png" | prepend: site.baseurl }})

Podemos ver que o `tail` listou as 10 últimas linhas do arquivo [linhas.txt]({{ "/downloads/2017/06/01/linhas.txt" | prepend: site.baseurl }}), que possui 20 linhas.

Exibir as 10 últimas linhas é o comportamento padrão do `tail`. Entretanto, podemos usar a opção `-n` para especificar o número de linhas que devem ser extraídas:

![imagem mostrando o tail com opção -n]({{ "/img/posts/2017-06-01-tail-n.png" | prepend: site.baseurl }})

Agora que passamos a opção `-n 5` para o `tail`, ele retornou apenas as 5 últimas linhas.

### Para saber mais.

A maioria das distribuições Linux aceita que o `n` seja omitido. Assim, podemos especificar o número diretamente após o `-`:

![imagem mostrando o tail com a opção -NÚMERO]({{ "/img/posts/2017-06-01-tail-numero.png" | prepend: site.baseurl }})

Veja que `tail -5` tem o mesmo efeito de `tail -n 5`.

#### Usando tail para extrair o conteúdo a partir da linha especificada.

Quando usamos a opção `-n`, podemos adicionar um `+` antes do número para que o `tail` comece a extração a partir da linha especificada:

![imagem mostrando o tail exibindo o conteúdo a partir da linha especificada]({{ "/img/posts/2017-06-01-tail-n-numero.png" | prepend: site.baseurl }})

Na imagem, vemos que `tail -n +5` retornou todo o conteúdo a partir da 5ª linha.

Eu utilizo muito este recurso para remover a linha de cabeçalho de arquivos CSV. Como o cabeçalho costuma vir na primeira linha, eu posso removê-lo com `tail -n +2 arquivo.csv`, que me retorna o conteúdo da 2ª linha em diante.
