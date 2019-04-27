---
layout: post
pageid: "post-regex-9"
lang: pt
comments: true
series: "Falando sobre Expressões Regulares"
title: "O que foi que ele disse?"
description: "Conhecendo metacaracteres âncoras."
date: 2017-04-13 14:01:00 -0300
author: Eric Yuzo
categories: regex
---
E aí pessoas!

Eu gostaria de começar agradecendo mais uma vez ao Chico por ter autorizado a exposição do diálogo presente neste post. Valeu molecão! É nóis!

Agora, deixe-me contar a história:

> Estávamos no ônibus eu e o Chico...

![imagem do Professor Girafales dizendo que o burro vai na frente!]({{ "/img/posts/2017-04-13-o-burro-vai-na-frente.jpeg" | prepend: site.baseurl }})

P.S.: Se não entendeu a imagem, procure no YouTube por "Eu e Quico, Quico e eu".

Voltando à história:

> Estávamos eu e o Chico no busão, subindo a serra em direção a São Paulo pela Rodovia dos Imigrantes. Estávamos de boa, trocando uma ideia, até que ele pergunta:
>
> Chico: - Não sabia que era permitido pular de asa delta aqui na serra.
>
> Eu olhei pela janela e não encontrei nada. Curioso, eu questionei o Chico:
>
> Eric: - Onde é que tu tá vendo uma asa delta?
>
> Chico aponta pra suposta asa delta e fala:
>
> Chico: - Ali pô!
>
> Eu olho, começo a rachar o bico e falo:
>
> Eric: - Porra Chico! Aquilo ali é um URUBU!

Sensacional! Eu ri muito, senti como se o meu pâncreas fosse saltar pra fora do corpo de tanta risada.

Enfim... Esta historinha será o texto onde faremos os matchings de hoje.

Para começar, vamos colar o texto no RegExr e procurar pelo "Chico":

![imagem ilustrando matching com "Chico"]({{ "/img/posts/2017-04-13-matching-chico-1.png" | prepend: site.baseurl }})

Como podem ver, eu enumerei as linhas, pra facilitar sua identificação. A cor azul indica que houve algum match na linha e a cor vermelha indica que não houve nenhum match na linha.

A missão pra hoje é descobrir quais são as linhas que contém o que foi que o Chico disse, as falas dele. Sendo mais específico, queremos identificar as linhas 2 e 6.

Vamos pensar sobre o padrão que temos que capturar...

As linhas que representam as falas começam com o nome da pessoa seguido de ":" (dois pontos). Portanto, as falas do chico começam com `Chico:`. Vamos ver como fica na regex:

![imagem ilustrando matching com "Chico:"]({{ "/img/posts/2017-04-13-matching-chico-2.png" | prepend: site.baseurl }})

Estamos quase lá! Conseguimos match nas duas linhas que começam com "Chico:". Mas também houve um match no final da linha 3.

O que está faltando, é um meio de informar pra regex que ela deve dar match na string "Chico:" somente no **ínicio** da linha.

Para passar esta informação pra expressão, nós utilizamos o metacaractere `^` (circunflexo), cuja função é bater com a **posição inicial** da linha.

Isto mesmo, o circunflexo é do tipo que bate com uma determinada **posição**, por isto, é classificado como um operador **posicional**. Diversas fontes usam o termo **âncora** para se referir a este tipo de operador. Ambos são válidos, fique a vontade pra chamá-lo com o nome que achar melhor.

Sabendo que o circunflexo bate com o início da linha, vamos adicioná-lo à expressão:

![imagem ilustrando matching fail com "^Chico:"]({{ "/img/posts/2017-04-13-matching-chico-fail.png" | prepend: site.baseurl }})

~~Aí deu erro, mas na minha máquina funciona!~~

Não houve match. Mas não se preocupem, a regex não está errada e o RegExr não está bugado. É simplesmente uma questão de configuração.

O padrão do circunflexo no RegExr é bater com a posição inicial do texto como um todo, independente da linha. Para que o circunflexo considere o início de cada nova linha, precisamos passar para o modo multilinha. Fazemos isso marcando a opção **multiline** no menu **flags**. Veja na figura abaixo:

![imagem ilustrando flag multiline sendo setada no RegExr"]({{ "/img/posts/2017-04-13-regexr-flag-m.png" | prepend: site.baseurl }})

Com o multiline ativo, temos o match conforme esperado:

![imagem ilustrando matching com "^Chico:"]({{ "/img/posts/2017-04-13-matching-chico-3.png" | prepend: site.baseurl }})

A missão de hoje não foi comprida e já está cumprida.

Mas não quero encerrar sem mostrar o oposto do circunflexo, que é o `$` (cifrão). Se o circunflexo bate com o início da linha, o cifrão bate com o **fim** da linha.

Pra ver como age o cifrão, vamos aplicar a regex `[A-Za-z]+\.` pra capturar as palavras que antecedem um ponto qualquer:

![imagem ilustrando matching com ponto]({{ "/img/posts/2017-04-13-matching-ponto-1.png" | prepend: site.baseurl }})

Vemos 3 trechos que deram match. Agora, vamos alterar a expressão pra capturar as palavras que antecedem um ponto final:

![imagem ilustrando matching com ponto no fim da linha]({{ "/img/posts/2017-04-13-matching-ponto-2.png" | prepend: site.baseurl }})

Com o cifrão no final, a regex capturou apenas o "serra.", pois ele está no fim da linha.

Vale lembrar que, assim como o circunflexo, o cifrão só tem efeito em cada linha se a _flag multiline_ estiver marcada. Isso quando estamos falando do RegExr, que usa a API do JavaScript. Algumas APIs e ferramentas já apresentam esse comportamento por padrão, sem a necessidade de setar nenhum flag. Na dúvida, sempre consulte a documentação da ferramenta que estiver usando.

É isso aí pessoas! Hora do café!

Mas primeiro... Tabela de operadores atualizada:

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
  </tbody>
</table>

Valeu e Falou...

---

<span class="previous-post">[Ela é gulosa... Estúpida! <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({{ site.baseurl }}{% link _posts/2017-04-08-falando-sobre-expressoes-regulares-ela-e-gulosa-estupida.md %})</span> <span class="next-post">[<img class="icon32" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> Feliz Natal... digo... Feliz Páscoa!]({{ site.baseurl }}{% link _posts/2017-04-16-falando-sobre-expressoes-regulares-feliz-natal-digo-feliz-pascoa.md %})</span>
