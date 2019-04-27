---
layout: post
pageid: "post-guia-linux-wc"
lang: pt
langvisible: false
comments: true
series: "Guia Rápido Linux"
title: "Contando linhas com wc"
description: "Guia rápido para contar linhas usando o programa wc."
date: 2017-05-31 14:44:00 -0300
author: Eric Yuzo
categories: [linux, shell]
---
Quando precisamos saber o número de linhas de um arquivo qualquer, recorremos ao programa `wc`, usando a seguinte sintaxe:

```bash
wc -l [ARQUIVO]
```

Exemplo:

![imagem mostrando o wc -l em ação]({{ "/img/posts/2017-05-31-wc-l.png" | prepend: site.baseurl }})

A imagem ilustra o comando `wc -l` sendo usado para contar o número de linhas do arquivo `populacao-ibge.csv`, que possui 5571 linhas.

### Para saber mais.

O programa `wc` (word count) é usado para contar o número de linhas, palavras ou bytes dos arquivos. Por padrão, ele computa os três valores, mas também podemos especificar qual contagem queremos exibir usando uma das opções:

- `-l`: conta o número de linhas;
- `-w`: conta o número de palavras;
- `-c`: conta o número de bytes.

Exemplo:

![imagem mostrando wc com diferentes opções]({{ "/img/posts/2017-05-31-wc-param.png" | prepend: site.baseurl }})

#### Fato curioso

Para contar linhas, usamos a opção `-l` (line); para contar palavras, usamos `-w` (word); já para contar os bytes usamos `-c`. Por que será?

A opção se chama `-c` porque, originalmente, ela fazia referência à contagem de caracteres. Como os encodings da época usavam 1 byte pra representar cada caractere, contar os bytes era sinônimo de contar caracteres. Porém, com os encodings mais modernos essa lógica não se aplica, uma vez que existem caracteres que são codificados com mais de 1 byte. Por isso, não dizemos mais que `-c` é usado pra contar caracteres; agora dizemos que `-c` é usado para contar bytes.

Mas assim como os encodings de caracteres evoluíram, o `wc` também evoluiu e passou a aceitar a opção `-m`, usada para contagem de caracteres, inclusive os multibytes.
