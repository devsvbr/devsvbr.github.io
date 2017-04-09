---
layout: post
title:  "Falando sobre Expressões Regulares: Eu quero um Ponto Literal e ponto final!"
author: Eric Yuzo
categories: regex
---
E aí pessoas!

Estou de volta pra falar um pouco mais sobre os metacaracteres nas expressões regulares.

A missão de hoje é criar uma regex que dê match com o domínio do blog: _"www.devsv.com.br"_.

Deixem eu me adiantar e mostrar de vez uma solução:

![imagem ilustrando matching da url do devsv]({{ "/img/posts/2017-04-01-matching-url-1.png" | prepend: site.baseurl }})

Viram? Simples demais!

![Sou zica memo molecão!! Resolvi saporra rapidão!!]({{ "/img/posts/2017-04-01-sou-zica.png" | prepend: site.baseurl }})

Tá bom... Tá bom... Até imagino o que estão pensando. E têm razão, o ponto é um _curinga_, portanto, essa regex bate com strings do tipo:

![imagem ilustrando matching da url do devsv e muito mais]({{ "/img/posts/2017-04-01-matching-url-2.png" | prepend: site.baseurl }})

Muito bom! Estão espertos! Parabéns!

![Sabem como é, né? Eu só estava testando se estavam atentos!]({{ "/img/posts/2017-04-01-1-2-3-testando.png" | prepend: site.baseurl }})

Agora temos um problema pra resolver. O ponto deve ser literalmente um ponto e não qualquer coisa.

Será que não tem como transformar o ponto em um caractere literal?

Sim, é plenamente possível! E é exatamente o que vamos fazer com a ajuda de um novo metacaractere, a `\` (barra invertida).

A barra invertida é usada para **escapar** metacaracteres. "Escapar", neste contexto, significa algo como _"tornar literal um caractere especial"_. A sintaxe é simples, basta colocar a barra invertida imediatamente à esquerda do metacaractere que queremos escapar. Pro nosso caso, `\.`.

Bora colocar a barra invertida antes dos pontos e ver o que acontece:

![imagem ilustrando matching apenas da url do devsv]({{ "/img/posts/2017-04-01-matching-url-3.png" | prepend: site.baseurl }})

Ahá! Missão dada, missão cumprida!

Como viram, com a barra invertida na frente, o ponto bateu apenas com ponto. O mesmo vale pra qualquer outro metacaractere, inclusive a própria barra invertida. Isto mesmo, pra bater com "\\", usa-se a regex `\\`.

Pra fechar, deixo a versão atualizada da tabela com os metacaracteres que vimos até agora:

<table class="table table-bordered">
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
    <tr>
      <td>\</td><td>barra invertida</td><td>torna literal o metacaractere à sua direita</td>
    </tr>
  </tbody>
</table>

No próximo post, começaremos a explorar melhor o poder das expressões regulares com metacaracteres quantificadores.

Valeu pessoas! Até a próxima!

Falou...

---

<span>[Primeiros Metacaracteres <img class="previous-post" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({{ site.baseurl }}{% link _posts/2017-03-31-falando-sobre-expressoes-regulares-primeiros-metacaracteres.md %})</span> <span class="pull-right">[<img class="next-post" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> Quantos deseja? Nenhum? Um? Ou mais?]({{ site.baseurl }}{% link _posts/2017-04-02-falando-sobre-expressoes-regulares-quantos-deseja-nenhum-um-ou-mais.md %})</span>

<br />

