---
layout: post
comments: true
series: "Falando sobre Expressões Regulares"
title: "Primeiros Metacaracteres"
description: "Hora de fazer mais que um simples matching direto."
date: 2017-03-31 11:52:00 -0300
author: Eric Yuzo
categories: regex
---
E aí pessoas!

No [último post]({{ site.baseurl }}{% link _posts/2017-03-30-falando-sobre-expressoes-regulares-comecando-com-caracteres-literais.md %}), criamos algumas expressões usando caracteres comuns e eu havia adiantado que mostraria o tal do **caractere especial**. Pois vamos lá.

Os **caracteres especiais** são conhecidos como **metacaracteres** e são os grandes responsáveis por expandir os horizontes de matching de uma regex.

Pra ver um deles em ação, considere as frases abaixo:

> Eu nao gosto de usar acentos!
>
> Eu não gosto de quem não usa acentos!

Meu objetivo aqui, é encontrar todas as palavras _"não"_ do texto. Até aqui, sem novidade, podemos especificar na regex a string que queremos encontrar:

![imagem ilustrando matching da regex "não"]({{ "/img/posts/2017-03-31-matching-nao-1.png" | prepend: site.baseurl }})

O matching direto com literais funciona muito bem. Mas eu estou no Brasil, um país de todos, então não quero excluir o carinha que não curte acentos.

Será que algum caractere especial pode nos ajudar a capturar tanto o _"não"_ quanto o _"nao"_?

Eu proponho um experimento: troque o _"a"_ por _"."_ (ponto) na regex e veja o que acontece:

![imagem ilustrando matching da regex "n.o"]({{ "/img/posts/2017-03-31-matching-nao-2.png" | prepend: site.baseurl }})

Hmmm... Muito bom, conseguimos capturar tanto o _"não"_ quanto o _"nao"_. Mas vejam só, chegamos no objetivo? Acho que não. Aquele _"nto"_ não deveria fazer parte do matching! Conseguiu ver o que o ponto está fazendo?

Olhe atentamente quais foram os caracteres que deram match com o ponto:

![imagem ilustrando os matchings do ponto]({{ "/img/posts/2017-03-31-matching-nao-3.png" | prepend: site.baseurl }})

O ponto está batendo com _"a"_, com _"ã"_ e com _"t"_. E digo mais: ele bateria com qualquer outro caractere.

Este é o significado especial do metacaractere `.`. Ele bate com qualquer caractere.

Podemos dizer que ele tem função semelhante à de uma variável. Na expressão matemática `5x + 2`, `x` pode assumir qualquer valor. Já na expressão regular `n.o`, `.` pode assumir a forma de qualquer caractere.

Vemos que é possível escrever expressões bem mais flexíveis usando o ponto. Mas pro problema que queremos resolver, ele ainda é muito permissivo.

Vamos pensar um pouco... O que é que nós precisamos pra resolver nosso problema?

Eu diria que precisamos encontrar algum modo de restringir os caracteres que são considerados como match. Algo como um metacaractere que "só dê match com `a` ou com `ã`". Concorda?

Pois existe um conjunto de metacaracteres, os **colchetes**, também chamados de **lista**, que podem nos auxiliar nesta tarefa. Dentro dos colchetes, podemos especificar a lista de caracteres que queremos bater na regex:

![imagem ilustrando matching da regex usando lista]({{ "/img/posts/2017-03-31-matching-nao-4.png" | prepend: site.baseurl }})

Ahá! Agora sim! A regex está batendo apenas o _"nao"_ e o _"não"_.

Vale ressaltar que os colchetes são usados pra definir uma lista de caracteres que podem aparecer em **uma** determinada posição. Por exemplo, a expressão `[12345]0` define que a primeira posição pode ser qualquer um dos caracteres da lista, mas apenas um deles de cada vez, e a segunda posição deve ser obrigatoriamente "0". Ou seja, a regex `[12345]0` dá match apenas com umas das sequências: _"10"_, _"20"_, _"30"_, _"40"_ ou _"50"_.

Apesar da lista valer para capturar um único caractere, podemos usar quantas listas quisermos dentro da regex. Por exemplo, para aceitar que o _"n[aã]o"_ inicie com _"N" maiúsculo_ ou _"n" minúsculo_, basta adicionar outra lista:

![imagem ilustrando matching da regex usando 2 listas]({{ "/img/posts/2017-03-31-matching-nao-5.png" | prepend: site.baseurl }})

Muito Bom!

Antes de mudar de assunto, eu quero mencionar algumas particularidades das listas:

- O "-" (hífen) pode ser usado pra definir uma **faixa** de caracteres consecutivos. Por exemplo: `[0-9]` bate com qualquer um dos dígitos numéricos da sequência de "0" a "9" ("0", "1", "2", "3", "4", "5", "6", "7", "8" ou "9").

  ![imagem ilustrando matching da regex usando lista com faixa]({{ "/img/posts/2017-03-31-colchetes-1.png" | prepend: site.baseurl }})

  P.S.: A sequência de caracteres de uma faixa são definidos de acordo com uns _"bagulho muito doido"_ com uns nomes estranhos como _"character set"_ e _"collating sequence"_ do _"locale"_. Assuntos que estão fora do escopo dos posts. Por isto, não é indicada a criação de faixas mirabolantes. Na prática, as faixas mais utilizadas são: `0-9`, `A-Z` e `a-z`.

- O "^" (circunflexo), aparecendo como **primeiro** caractere da lista, **nega** o match dos itens da lista, em outras palavras, bate com qualquer caractere que **não** esteja listado. Exemplo: `[^0-9]` bate com qualquer caractere que não seja um dígito numérico entre "0" e "9".

  ![imagem ilustrando matching da regex usando lista negada]({{ "/img/posts/2017-03-31-colchetes-2.png" | prepend: site.baseurl }})

- O caractere "-" (hífen), aparecendo como **primeiro** ou **último** elemento da lista, é interpretado como um hífen literal. Exemplo: tanto `[abc-]` quanto `[-abc]` batem com os caracteres "-", "a", "b" ou "c".

  ![imagem ilustrando matching da regex usando lista com hifen]({{ "/img/posts/2017-03-31-colchetes-5.png" | prepend: site.baseurl }})

- O caractere "]" (fecha colchetes), aparecendo como **primeiro** elemento da lista, é tratado como um literal. Exemplo: `[]abc]` bate com "]", "a", "b" ou "c".

  Aqui era o lugar onde eu postaria o print do RegExr ilustrando o exemplo acima. Mas fui trollado pela API do JavaScript. ¬¬

  No fim foi até bom porque este é um exemplo ao vivo do que eu mencionei no post anterior sobre o pão de cará... digo... sobre recursos que estão presentes em algumas implementações, mas não estão em outras. Lembram disso? Pois é, a API usada pelo RegExr não considera o "fecha colchetes" como membro da lista. Mas o grep aceita esta sintaxe, então deixo um print com o grep mesmo:

  ![imagem ilustrando matching da regex usando lista com fecha colchetes]({{ "/img/posts/2017-03-31-colchetes-3.png" | prepend: site.baseurl }})

- Os demais metacaracteres presentes dentro da lista são tratados como literais. Exemplo: `[.]` bate apenas com o caractere ".".

  ![imagem ilustrando matching da regex usando lista com metacaractere como literal]({{ "/img/posts/2017-03-31-colchetes-4.png" | prepend: site.baseurl }})

Bom pessoas, por mim eu ficaria aqui escrevendo mais e mais coisas, deixaria este post grande, enorme, um monstro. Mas não quero publicar posts muito extensos. Então vou finalizar com uma tabela resumindo os metacaracteres que vimos hoje.

<table class="table">
  <thead>
    <tr>
      <th>Metacaractere</th><th>Nome</th><th>Função</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>.</td><td>ponto</td><td>captura qualquer caractere</td>
    </tr>
    <tr>
      <td>[ ]</td><td>colchetes ou lista</td><td>captura qualquer um dos caracteres listados</td>
    </tr>
  </tbody>
</table>

Valeu pessoas! Até a próxima!

Falou...

---

<span class="previous-post">[Começando com Caracteres Literais <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({{ site.baseurl }}{% link _posts/2017-03-30-falando-sobre-expressoes-regulares-comecando-com-caracteres-literais.md %})</span> <span class="next-post">[<img class="icon32" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> Eu quero um Ponto Literal e ponto final!]({{ site.baseurl }}{% link _posts/2017-04-01-falando-sobre-expressoes-regulares-eu-quero-um-ponto-literal-e-ponto-final.md %})</span>
