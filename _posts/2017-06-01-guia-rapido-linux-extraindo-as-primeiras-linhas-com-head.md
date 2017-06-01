---
layout: post
comments: true
series: "Guia Rápido Linux"
title: "Extraindo as primeiras linhas com head"
description: "Guia rápido para extrair as linhas iniciais de um arquivo usando o head."
date: 2017-06-01 12:38:00 -0300
author: Eric Yuzo
categories: [linux, shell]
---
Para extrair as primeiras linhas de um arquivo qualquer, podemos usar o `head`:

```bash
head [ARQUIVO]
```

Exemplo:

![imagem mostrando o head em ação]({{ "/img/posts/2017-06-01-head.png" | prepend: site.baseurl }})

Podemos ver que o `head` listou as 10 primeiras linhas do arquivo [linhas.txt]({{ "/downloads/2017/06/01/linhas.txt" | prepend: site.baseurl }}), que possui 20 linhas.

Exibir as 10 primeiras linhas é o comportamento padrão do `head`. Entretanto, podemos usar a opção `-n` para especificar o número de linhas que devem ser extraídas:

![imagem mostrando o head com opção -n]({{ "/img/posts/2017-06-01-head-n.png" | prepend: site.baseurl }})

Agora que passamos a opção `-n 5` para o `head`, ele retornou apenas as 5 primeiras linhas.

### Para saber mais.

A maioria das distribuições Linux aceita que o `n` seja omitido. Assim, podemos especificar o número diretamente após o `-`:

![imagem mostrando o head com a opção -NÚMERO]({{ "/img/posts/2017-06-01-head-numero.png" | prepend: site.baseurl }})

Veja que `head -5` tem o mesmo efeito de `head -n 5`.

#### Usando head pra excluir as últimas linhas do arquivo.

Quando usamos a opção `-n`, podemos adicionar um `-` antes do número para que o `head` extraia todas as linhas exceto as últimas N linhas, onde N é o número que especificamos:

![imagem mostrando o head com opção -n excluindo as últimas linhas]({{ "/img/posts/2017-06-01-head-n-numero.png" | prepend: site.baseurl }})

Na imagem, vemos que `head -n -5` retornou 15 das 20 linhas do arquivo. Em outras palavras, ele excluiu as 5 últimas linhas.
