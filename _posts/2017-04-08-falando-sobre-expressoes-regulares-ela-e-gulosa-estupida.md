---
layout: post
pageid: "post-regex-8"
lang: pt
comments: true
series: "Falando sobre Expressões Regulares"
title: "Ela é gulosa... Estúpida!"
description: "Hora de descobrir que os quantificadores clássicos são gulosos."
date: 2017-04-08 18:45:00 -0300
author: Eric Yuzo
categories: regex
---
E aí pessoas!

Estou de volta pra continuar de onde paramos no [post sobre as chaves]({{ site.baseurl }}{% link _posts/2017-04-04-falando-sobre-expressoes-regulares-ai-vem-as-chaves-chaves-chaves.md %}) e incrementar um pouco mais nossa regex marota pra capturar URLs.

Nossa regex está assim:

![imagem ilustrando matching de url]({{ "/img/posts/2017-04-08-matching-url-1.png" | prepend: site.baseurl }})

Hoje eu quero que ela seja capaz de capturar URLs com domínios sem o ".xx" no final, como aquelas que terminam em ".com", ".org", ".co", etc.

Como de costume, hora de refletir...

Eu já mostrei que o `?` tem a habilidade de tornar um elemento opcional. Mas não é bem isso que eu quero. Pensando bem até é, mas não com o limite de um único caractere. O que eu queria é que todo o bloco fosse opcional. Ou aparecem todos juntos, ou não aparece ninguém.

Sabemos o que queremos. É um excelente começo. A próxima questão é: será que é possível fazer isso em uma regex?

Com certeza. Podemos utilizar os **parênteses** para **agrupar** elementos dentro da regex. Os grupos servem para determinar o **escopo** de alguns operadores. Por exemplo, se colocarmos um quantificador após um grupo, seu efeito vale para **todo o grupo**, como se o grupo fosse um único elemento na expressão.

Já podemos atualizar nossa expressão. A ideia é agrupar o trecho final `\.[a-z]{2}` e torná-lo opcional:

![imagem ilustrando matching de url sem .xx no final]({{ "/img/posts/2017-04-08-matching-url-2.png" | prepend: site.baseurl }})

Show de bola!

Muitos sites permitem a omissão do subdomínio "www.". Pra aceitar estes sites, podemos usar os parênteses em conjunto com o interrogação e tornar o `www\.` opcional:

![imagem ilustrando matching de url com www opcional]({{ "/img/posts/2017-04-08-matching-url-3.png" | prepend: site.baseurl }})

Funciona que é uma beleza!... Mas pera um pouco! Viram aquilo?

![imagem destacando matching com metade da url]({{ "/img/posts/2017-04-08-matching-metade.png" | prepend: site.baseurl }})

Hmmm... Um falso-positivo... Que beleza...

Eu não vou alterar a regex pra parar de capturar este caso porque eu quero evitar a fadiga ~~(Os invejosos dirão que eu não sei resolver o problema)~~. Mas a análise da razão deste match será muito proveitosa para nós.

Bora tentar entender o que aconteceu:

![imagem destacando os trechos do matching]({{ "/img/posts/2017-04-08-analise-matching.png" | prepend: site.baseurl }})

A imagem acima destaca os trechos da regex que deram match com os trechos da URL. Vamos analisar por partes:

1. `https?:\/\/` captura o trecho **"http://"**;
2. `(www\.)?` não captura nada. Por ser um trecho opcional, tudo OK;
3. `[a-z-]{3,}\.` captura o trecho **"www."**;
4. `[a-z]{2,3}` captura o trecho **"ab"**;
5. `(\.[a-z]{2})?` captura o trecho **".co"**. Por ser o fim da regex, o match é bem-sucedido.

![Por que o "(www\.)?" não capturou o "www."?]({{ "/img/posts/2017-04-08-pq-nao-capturou-www-1.jpeg" | prepend: site.baseurl }})

Excelente pergunta!

Para entender o que está acontecendo de fato, precisamos conhecer uma característica dos operadores quantificadores: eles são **gulosos** por natureza.

Quando digo que os quantificadores são gulosos, quero dizer que eles tentam capturar o **maior trecho** que conseguirem, dentro dos limites permitidos. A regra se aplica a todos os quantificadores que vimos nos posts anteriores: `?`, `+`, `*` e `{n,m}`.

![Agora que eu não entendi nada! Se o '?' é guloso, por que ele abriu mão do "www."?]({{ "/img/posts/2017-04-08-pq-nao-capturou-www-2.jpeg" | prepend: site.baseurl }})

Muito boa sacada! Mas muita hora nessa calma, eu já estava chegando lá.

A questão é que uma expressão regular é bem-sucedida apenas se todos os seus componentes forem bem-sucedidos. Se qualquer parte integrante da expressão falhar em capturar o que deve, toda a expressão falha.

Os quantificadores são gulosos, mas não são egoístas a ponto de sacrificar todo mundo apenas pra saciar sua gula. Se capturar o máximo possível significa condenar algum companheiro ao insucesso, o quantificador opta por capturar menos do que lhe é permitido.

Pra clarear as ideias, eu usei toda a minha habilidade artística pra preparar, no Paint, uma imagem que retrata como seria o mundo se os quantificadores fossem egoístas e se colocassem acima do sucesso da missão:

![imagem ilustrando o mundo com quantificadores egoístas]({{ "/img/posts/2017-04-08-fluxo-quantificador-guloso-1.png" | prepend: site.baseurl }})

Como podem ver, a partir do momento que o `(www\.)?` captura o trecho _"www."_, ele condena a expressão regular inteira ao fracasso.

Agora vejam uma imagem retratando o mundo real:

![imagem ilustrando o mundo real]({{ "/img/posts/2017-04-08-fluxo-quantificador-guloso-2.png" | prepend: site.baseurl }})

Esta imagem retrata o que está acontecendo de fato com nossa regex, onde o `(www\.)?` abre mão de sua gulodice em prol do sucesso de todo o conjunto.

Interessante, não?

Assim, eu encerro o assunto dos quantificadores e me despeço da nossa querida regex pra matching de URLs.

Pois é, hora de desapegar. No próximo post, escreveremos novas expressões e conheceremos uma nova categoria de operadores.

Mas não posso fechar o post antes de atualizar a tabela de operadores:

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
  </tbody>
</table>

Valeu pessoas! Até a próxima!

Falou...

---

<span class="previous-post">[Aí vem as Chaves... Chaves... Chaves... <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({{ site.baseurl }}{% link _posts/2017-04-04-falando-sobre-expressoes-regulares-ai-vem-as-chaves-chaves-chaves.md %})</span> <span class="next-post">[<img class="icon32" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> O que foi que ele disse?]({{ site.baseurl }}{% link _posts/2017-04-13-falando-sobre-expressoes-regulares-o-que-foi-que-ele-disse.md %})</span>
