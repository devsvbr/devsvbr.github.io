---
layout: post
pubid: "post-regex-5"
langvisible: false
comments: true
series: "Falando sobre Expressões Regulares"
title: "Quantos deseja? Nenhum? Um? Ou mais?"
description: "Entendendo como as expressões regulares podem nos ajudar a encontrar textos de diferentes tamanhos."
date: 2017-04-02 10:55:00 -0300
author: Eric Yuzo
categories: regex
---
E aí pessoas!

No [último post]({{ site.baseurl }}{% link _posts/2017-04-01-falando-sobre-expressoes-regulares-eu-quero-um-ponto-literal-e-ponto-final.md %}) criamos uma regex pra bater com o domínio do blog. Eu gostei tanto do exemplo que resolvi continuar com ele. A ideia agora é expandir a regex para que passe a capturar diversas URLs.

Nosso ponto de partida é a regex que bate apenas com o domínio "www.devsv.com.br":

![imagem ilustrando matching da url do devsv]({{ "/img/posts/2017-04-02-matching-url-1.png" | prepend: site.baseurl }})

Primeiro, vamos fazer a regex capturar o protocolo http:

![imagem ilustrando matching da url do devsv com http]({{ "/img/posts/2017-04-02-matching-url-2.png" | prepend: site.baseurl }})

Notem que é preciso escapar as barras após o "http:", uma vez que elas fazem parte da sintaxe do RegExr (elas delimitam o início e o fim da expressão (análogo às aspas em volta das strings em muitas linguagens de programação), portanto uma barra só é considerada literal se for escapada; esta sintaxe não é exclusividade do JavaScript, outras linguagens como Ruby e ferramentas como sed e vi também delimitam uma regex com barras).

~~P.S.: Sem querer eu fiz um _Inception_ de parênteses no parágrafo acima. Muito louco! Ahahaha!~~

Próximo objetivo: aceitar o protocolo https:

![imagem ilustrando matching da url do devsv com https]({{ "/img/posts/2017-04-02-matching-url-3.png" | prepend: site.baseurl }})

Muito bom! Mas estamos em um processo incremental e queremos manter o match com "http://www.devsv.com.br".

Vamos pensar um pouco... O que precisamos fazer pra bater as duas URLs?

Hmmm... O "http" está sempre lá... já o "s" pode estar presente ou não, tanto faz... o restante da regex está ok...

Bingo! Este é o ponto, tanto faz se o "s" aparece ou não na URL, a regex deve capturar os 2 casos. Resumindo, o "s" é um elemento **opcional**.

O metacaractere que vai nos ajudar nesta tarefa é o `?` (interrogação). Sua função é fazer com que o caractere à sua esquerda se torne **opcional**. Se o objetivo é ter um "s" opcional, usamos a regex `s?`:

![imagem ilustrando matching da url do devsv com http ou https]({{ "/img/posts/2017-04-02-matching-url-4.png" | prepend: site.baseurl }})

Bão demais!

Hora de aumentar o grau de dificuldade! Novo objetivo: capturar qualquer URL com domínio terminado em ".com.br".

Vish! E agora?

Mais um momento de reflexão...

![imagem pensando...]({{ "/img/posts/2017-04-02-pensando.jpeg" | prepend: site.baseurl }})

O raciocínio é o seguinte, eu preciso capturar URLs seguindo algumas regras:

1. começa com _"http"_;
2. seguido por um _"s" opcional_;
3. seguido por _"://www."_;
4. seguido por _qualquer coisa_;
5. terminando com _".com.br"_.

As regras 1, 2, 3 e 5 já são satisfeitas na nossa regex. A pendência que temos pra resolver, é a regra 4: aceitar qualquer coisa.

Já conhecemos o ponto, que bate com qualquer caractere único. Mas o que precisamos é que qualquer caractere possa aparecer várias vezes. E várias vezes deve ser uma quantidade variável. Afinal, existem URLs com 3 letras, 5 letras, 8 letras, etc.

Bingo de novo! Essa é a ideia! Como já é previsível, é agora que eu mostro mais um metacaractere. Então que seja bem vindo o `*` (asterisco).

O asterisco (assim como o ponto de interrogação) é um metacaractere chamado de **quantificador**, pois ele não define **o que** a regex deve bater, mas define a **quantidade de vezes** que um elemento pode aparecer no matching. Falando especificamente do asterisco, seu papel na regex é permitir que o caractere imediatamente à sua esquerda apareça **nenhuma, uma ou mais vezes** no matching.

Voltando ao nosso problema, o vulgo  _"qualquer coisa"_ pode ser escrito como `.*`. Aplicando na regex, temos:

![imagem ilustrando matching de urls .com.br]({{ "/img/posts/2017-04-02-matching-url-5.png" | prepend: site.baseurl }})

Parece bonito, mas tem um porém. O `.*` também aceita a **ausência** de _"qualquer coisa"_, portanto a URL "http://www..com.br" é capturada no matching, veja:

![imagem ilustrando matching da url www..com.br]({{ "/img/posts/2017-04-02-matching-url-6.png" | prepend: site.baseurl }})

Existe um outro metacaractere, o `+` (mais), que faz com que a regex aceite **uma ou mais** repetições do elemento imediatamente anterior a ele. Muito parecido com o asterisco, a diferença é que ele **não** tolera a ausência do elemento.

Vejamos como ele se comporta em nossa regex:

![imagem ilustrando matching correto de urls .com.br]({{ "/img/posts/2017-04-02-matching-url-7.png" | prepend: site.baseurl }})

Legal! Estamos conseguindo deixar nossa regex cada vez mais genérica. E vamos melhorá-la ainda mais. Mas agora é hora de uma pausa pro café.

Deixe-me apenas atualizar a tabela dos metacaracteres.

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
  </tbody>
</table>

Valeu pessoas! Bom café a todos!

Falou...

---

<span class="previous-post">[Eu quero um Ponto Literal e ponto final! <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({{ site.baseurl }}{% link _posts/2017-04-01-falando-sobre-expressoes-regulares-eu-quero-um-ponto-literal-e-ponto-final.md %})</span> <span class="next-post">[<img class="icon32" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> Se conselho fosse bom...]({{ site.baseurl }}{% link _posts/2017-04-03-falando-sobre-expressoes-regulares-se-conselho-fosse-bom.md %})</span>
