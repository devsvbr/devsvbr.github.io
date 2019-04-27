---
layout: post
pageid: "post-regex-10"
lang: pt
comments: true
series: "Falando sobre Expressões Regulares"
title: "Feliz Natal... digo... Feliz Páscoa!"
description: "Aproveitando o clima de Páscoa para apresentar novos metacaracteres."
date: 2017-04-16 19:28:00 -0300
author: Eric Yuzo
categories: regex
---
E aí pessoas!

Primeiro, eu gostaria de desejar a todos uma Feliz Páscoa!

Aproveitando o clima e o assunto, estou aqui pra mostrar 2 recursos muito interessantes das expressões regulares. Vamos lá!

No natal passado, eu mandei presentes pros chegados ~~(mentira, eu não presenteei ninguém)~~. Junto dos presentes, enviei um cartão com o texto:

> Feliz Natal! Espero que goste do presente e desejo que ganhe muitos presentes de Natal!

Agora na páscoa fiz o mesmo ~~(fiz nada)~~: mandei ovos de páscoa com um cartão, porém com a mensagem ligeiramente modificada:

> Feliz Páscoa! Espero que goste do ovo e desejo que ganhe muitos ovos de Páscoa!

Legal! Agora que os ovos já foram distribuídos, eu estou sem mais o que fazer. Então, eu resolvi que quero passar o tempo criando uma única expressão regular que capture apenas estas 2 frases. Bora escrever essa expressão?

Vamos começar pelo caso mais simples, capturar a mensagem de Natal:

![imagem ilustrando matching com mensagem de natal]({{ "/img/posts/2017-04-16-matching-natal-pascoa-1.png" | prepend: site.baseurl }})

Beleza, um matching direto com grau de novidade zero!

Agora vamos pensar em qual é a lógica que devemos usar pra incluir a segunda mensagem no match.

O que mudou na mensagem foi: "Natal" virou "Páscoa" e "presente" virou "ovo". Como devemos aceitar os dois casos, temos que dizer pra expressão que naquele pedaço do texto, ela deve dar match com "Natal" **ou** com "Páscoa", qualquer um deles. A mesma lógica vale para "presente" e "ovo".

Precisamos de um operador parecido com os operadores lógicos que usamos nas linguagens de programação: um operador **OU**. Nas expressões regulares, temos o metacaractere `|` (pipe) que faz essa função.

Sabendo disso, podemos definir as novas regras usando pipe:
* ou "Natal" ou "Páscoa" => `Natal|Páscoa`;
* ou "presente" ou "ovo" => `presente|ovo`.

Aplicando na regex:

![imagem ilustrando matching errado com mensagem de natal e pascoa]({{ "/img/posts/2017-04-16-matching-natal-pascoa-2.png" | prepend: site.baseurl }})

Ih! Deu ruim!

Pra entender o que aconteceu aqui, precisamos entender melhor como funciona o pipe dentro da expressão. A função do pipe é **dividir a regex em partes**, de modo que o match de **qualquer uma das partes** é aceito.

Acho que a explicação ainda está meio nebulosa. Pra ficar mais claro, vamos analisar a nossa própria regex e estudar o comportamento do pipe:

![imagem ilustrando análise do matching errado com mensagem de natal e pascoa]({{ "/img/posts/2017-04-16-analise-matching.png" | prepend: site.baseurl }})

A imagem mostra que os pipes dividiram a regex em 5 expressões menores e destaca os trechos que deram match com cada uma destas expressões.

Isto aconteceu porque o escopo padrão do pipe é atuar sobre a **regex inteira**. Mas podemos definir escopos menores usando os parênteses pra criar grupos. O pipe dentro de um grupo divide **apenas o grupo**, sem interferir no restante da expressão.

Então, o que temos que fazer pra resolver nosso problema é: agrupar as palavras "Natal" e "Páscoa", assim como "presente" e "ovo":

![imagem ilustrando matching com mensagem de natal e pascoa]({{ "/img/posts/2017-04-16-matching-natal-pascoa-3.png" | prepend: site.baseurl }})

Agora sim! Com o escopo bem definido, o pipe fez o **OU** nos trechos esperados.

Mas ainda tem um probleminha aí. Deixe-me adicionar alguns casos para teste:

![imagem ilustrando matching com mensagem inconsistente de natal e pascoa]({{ "/img/posts/2017-04-16-matching-natal-pascoa-4.png" | prepend: site.baseurl }})

As duas últimas frases estão meio estranhas. Não faz muito sentido uma mensagem de Feliz Natal desejando que a pessoa receba muitos ovos de Páscoa, nem uma mensagem de Páscoa desejando presentes de Natal.

Pra resolver esta questão, usaremos um recurso muito interessante das expressões regulares: os **retrovisores** (o termo original em inglês é _backreference_; em português eu gosto muito do termo retrovisor, que vi pela primeira vez no excelente livro sobre regex do [Aurélio Jargas](http://aurelio.net/regex/)).

Pra quebrar um pouco a rotina, vou mostrar primeiro a solução com os retrovisores em ação e depois explico como eles funcionam.

![imagem ilustrando matching com mensagem de natal e pascoa usando retrovisores]({{ "/img/posts/2017-04-16-matching-natal-pascoa-5.png" | prepend: site.baseurl }})

Tudo certo! Muito Bom!

Agora vamos tentar entender melhor o que são esses tais de retrovisores:

Os retrovisores são aquelas sequências com barra invertida e um número: `\1` e `\2`. Eles são o meio que usamos pra dizer pra regex que ela deve dar match com o trecho que já foi **capturado anteriormente no grupo** indicado.

Na prática, se o primeiro grupo capturar o texto "Natal", `\1` só dará match com "Natal"; se o match do primeiro grupo for "Páscoa", `\1` só dará match com "Páscoa". A mesma lógica se aplica ao segundo grupo e o retrovisor `\2`.

É importante saber que os retrovisores clássicos podem fazer referência à **no máximo 9 grupos**.

Mas por que 9 grupos?

Porque a sintaxe é barra invertida mais um único dígito, o que nos limita aos retrovisores: `\1`, `\2`, `\3`, `\4`, `\5`, `\6`, `\7`, `\8` e `\9`. Qualquer coisa que vier depois, será tratado como outro elemento da expressão. Por exemplo, a expressão `\10` significa o retrovisor `\1` seguido do `0` literal.

A título de curiosidade, posso dizer que existem alguns modos de acessar mais de 9 retrovisores em algumas ferramentas e APIs. Mas estes recursos específicos não estão no escopo deste post.

É isso aí pessoas! Este post encerra a série “Falando sobre Expressões Regulares”, mas não encerra o assunto. Nos próximos posts, mostrarei algumas aplicações práticas das expressões regulares em cenários reais.

Pra finalizar, segue a atualização da tabelinha clássica:

<table class="table">
  <thead>
    <tr>
      <th colspan="3">Itens que batem com um caractere</th>
    </tr>
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
    <tr>
      <td>\</td><td>barra invertida</td><td>torna literal o metacaractere à sua direita</td>
    </tr>
  </tbody>
  <thead>
    <tr>
      <th colspan="3">Modificadores que determinam quantidade: Quantificadores</th>
    </tr>
    <tr>
      <th>Metacaractere</th><th>Nome</th><th>Função</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>?</td><td>interrogação</td><td>torna o elemento à sua esquerda opcional</td>
    </tr>
    <tr>
      <td>*</td><td>asterisco</td><td>torna o elemento à sua esquerda opcional e permite múltiplas ocorrências</td>
    </tr>
    <tr>
      <td>+</td><td>mais</td><td>elemento à sua esquerda deve aparecer uma ou mais vezes</td>
    </tr>
    <tr>
      <td>{n,m}</td><td>chaves</td><td>elemento à sua esquerda deve aparecer no mínimo n e no máximo m vezes</td>
    </tr>
  </tbody>
  <thead>
    <tr>
      <th colspan="3">Operadores que batem com uma posição: Âncoras</th>
    </tr>
    <tr>
      <th>Metacaractere</th><th>Nome</th><th>Função</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>^</td><td>circunflexo</td><td>bate com a posição incial do texto</td>
    </tr>
    <tr>
      <td>$</td><td>cifrão</td><td>bate com a posição final do texto</td>
    </tr>
  </tbody>
  <thead>
    <tr>
      <th colspan="3">Outros (grupo dos que ficaram sem grupo)</th>
    </tr>
    <tr>
      <th>Metacaractere</th><th>Nome</th><th>Função</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>( )</td><td>parênteses</td><td>delimita escopo para outros operadores</td>
    </tr>
    <tr>
      <td>|</td><td>pipe</td><td>divide a expressão ou grupo em partes e bate com qualquer uma destas partes</td>
    </tr>
    <tr>
      <td>\1, \2, ... , \9</td><td>retrovisor</td><td>bate com o trecho capturado no grupo 1, 2, ... , 9</td>
    </tr>
  </tbody>
</table>

Valeu pessoas! Feliz Páscoa! Desejo que ganhem muitos presentes de Natal!

Falou...

---

<span class="previous-post">[O que foi que ele disse? <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({{ site.baseurl }}{% link _posts/2017-04-13-falando-sobre-expressoes-regulares-o-que-foi-que-ele-disse.md %})</span>
