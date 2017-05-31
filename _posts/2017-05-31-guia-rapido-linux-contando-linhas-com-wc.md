---
layout: post
comments: true
series: "Guia Rápido Linux"
title: "Contando linhas com wc"
description: "Guia rápido para contar linhas usando o programa wc."
author: Eric Yuzo
categories: [linux, shell]
---
Quando precisamos saber o número de linhas de um arquivo qualquer, recorremos ao programa `wc`, usando a seguinte sintaxe:

```bash
wc -l [ARQUIVO...]
```

Exemplo:

![imagem mostrando o wc -l em ação]({{ "/img/posts/2017-05-31-wc-l.png" | prepend: site.baseurl }})

A imagem ilustra o comando `wc -l` sendo usado pra contar o número de linhas do arquivo `populacao-ibge.csv`, que possui 5571 linhas.

### Para saber mais.

O programa `wc` (word count) é usado para contar o número de linhas, palavras ou bytes dos arquivos. Por padrão, ele computa os três valores, mas também podemos especificar por parâmetro qual contagem queremos exibir.

Os parâmetros são:

- `-l`: conta o número de linhas;
- `-w`: conta o número de palavras;
- `-c`: conta o número de bytes.

Exemplo:

![imagem mostrando os parametros do wc]({{ "/img/posts/2017-05-31-wc-param.png" | prepend: site.baseurl }})

#### Fato curioso

Para contar linhas, usamos o parâmetro `-l` (line); para contar palavras, usamos o parâmetro `-w` (word); já para contar os bytes usamos o parâmetro `-c`. Por que será?

O parâmetro se chama `-c` porque, originalmente, ele fazia referência à contagem de caracteres. Como os encodings da época usavam 8 bits pra representar cada caractere, contar os bytes era o mesmo que contar caracteres. Porém, com os encodings mais modernos essa lógica não se aplica, uma vez que alguns caracteres são codificados com mais de 1 byte. Por isso, não dizemos mais que o `-c` serve pra contar caracteres; agora dizemos que ele serve para contar bytes.
