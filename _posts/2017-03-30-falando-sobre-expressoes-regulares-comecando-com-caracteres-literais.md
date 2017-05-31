---
layout: post
comments: true
series: "Falando sobre Expressões Regulares"
title: "Começando com Caracteres Literais"
description: "Primeiro contato com expressões regulares."
author: Eric Yuzo
categories: regex
---
E aí pessoas!

Estou de volta pra falar um pouco mais sobre expressões regulares. Assunto que iniciei no post de [introdução]({{ site.baseurl }}{% link _posts/2017-03-29-falando-sobre-expressoes-regulares-introducao.md %}).

A partir de agora, pra economizar teclas e aumentar a vida útil do meu teclado, vou me referir às expressões regulares como **regex** (do inglês, **reg**ular **ex**pression). É bem comum encontrar pessoas usando este termo e é bem útil também como palavra chave na hora de _"googlar"_.

Dados nomes e apelidos aos bois, é hora de conhecermos a ferramenta que fará parte das demonstrações.

Eu fiquei pensando um pouco sobre qual seria a melhor ferramenta pra demonstrar na prática o funcionamento das expressões. Passou pela cabeça usar uma linguagem de programação, como _Python_, mas adicionaria um pré-requisito, que seria ter _Python_ instalado. Pensei também em mostrar os exemplos usando o _egrep_, mas quem usa _Windows_ teria que instalar algum emulador de ferramentas _Unix_. Por mais simples que seja a instalação de qualquer uma delas, eu queria uma solução ainda mais simples. No fim, acabei encontrando uma plataforma bem interessante que me pareceu o modo mais acessível pra qualquer leitor do blog poder acompanhar os exemplos. Se trata do [RegExr](http://regexr.com/), uma plataforma para testes de regex online desenvolvida pelo [Grant Skinner](https://github.com/gskinner) (gostaria de poder fazer um comentário vibrante sobre ele agora, mas não conheço a peça, então fica pra próxima, sorry pal). Nela também é possível aprender mais sobre regex em um dos diversos guias presentes na própria plataforma.

Eu usarei o _RegExr_ durante as demonstrações dos conceitos. Apesar disto, nada impede que vocês usem qualquer outra ferramenta com suporte a expressões regulares.

Já que estamos no assunto, tem um ponto que quero destacar.

Primeiro, permitam-me contar uma curiosidade sobre a minha região.

Eu moro em São Vicente (SP), uma cidade da baixada santista. Aqui na baixada, nós vamos em qualquer padaria e pedimos um _pão de cará_, recebemos o produto e saímos felizes e contentes. ~~Vale ressaltar que na receita do nosso pão de cará não vai cará (isso mesmo, no pão de cará não tem cará, hahaha).~~ Legal! Se eu for pra cidade de São Paulo (lugar bacana, trabalhei por lá um tempo) e pedir um pão de cará, vão me olhar com uma cara esquisita e pensar que eu sou um retardado. Porque lá não existe esse negócio de pão de cará!

Eu contei esta historinha porque no mundo das expressões regulares temos um fenômeno parecido. Eu havia mencionado que as expressões regulares estão em "tudo que é lugar", no sentido de que um grande conjunto de ferramentas e linguagens de programação suportam o uso de regex. Dentro de uma regex, alguns termos tem significado especial, e existem termos especiais que estão presentes em algumas ferramentas, mas que simplesmente não existem (quero dizer, não tem nenhum significado especial) em outras ferramentas.

![Ah, fala sério! Cada vez que eu mudar de ferramenta, vou ter que aprender uma sintaxe nova?]({{ "/img/posts/2017-03-30-fala-serio.jpeg" | prepend: site.baseurl }})

Nada de pânico! Existem sim algumas diferenças nos termos especiais, mas não é um caos generalizado. Assim como acontece em nosso idioma, há uma base central de termos fundamentais que são bem consistentes e usados da mesma maneira em todos os lugares. O importante é aprender esta base, que será suficiente pra fazer muita coisa (muita coisa mesmo). Os recursos especiais que uma ferramenta oferece costumam ser recursos adicionais que facilitam sua utilização.

Sem mais delongas, hora de fazer matchings! \o/

Lembram da frase do glorioso Chico que usei no post anterior? Pois é, vou utilizá-la de novo. Pra quem não leu a primeira parte, a frase está aí:

> Eu gostaria de ser monge, mas a profissão de monge no Brasil não dá dinheiro.

Primeiro, vou copiar e colar a frase no campo _Text_ do _RegExr_. Em seguida, no campo _Expression_, vou prencher com a expressão `monge` (ignore a / no início e o /g no fim, eles fazem parte da sintaxe, apenas preencha a expressão entre as duas barras):

![imagem ilustrando matching da regex "monge"]({{ "/img/posts/2017-03-30-regexr-1.png" | prepend: site.baseurl }})

Como podem ver, o RegExr usa expressões regulares pra fazer uma busca e dá um destaque nos termos que dão match (meio estranho o termo, mas se o aplicativo de pegação usa, por que não eu?).

Neste primeiro exemplo, passamos a expressão `monge` e o _Regexr_ encontrou 2 grupos de caracteres dentro da string que deram match com nossa expressão.

Eu comentei sobre termos que tem significado especial dentro da regex. Pois não é o caso de nenhum dos caracteres da expressão `monge`. Os caracteres que não possuem um significado especial, são tratados como **literais**, isto é, eles batem apenas com um caractere igual a ele mesmo. Por exemplo, "m" bate apenas com "m", "o" bate apenas com "o", "n" bate apenas com "n" e assim por diante.

Outra coisa, uma regex pode ser formada por múltiplos elementos, de modo que um trecho da string deve bater com a expressão regular inteira. A expressão `monge` só dá match com a string "monge". Por exemplo, altere a expressão de `monge` para `monges` e veja o que acontece:

![imagem ilustrando matching da regex "monges"]({{ "/img/posts/2017-03-30-regexr-2.png" | prepend: site.baseurl }})

Não houve match, pois não existe a sequência "monges" na string.

E a busca não se limita a palavras completas, a regex vai considerar como match quaisquer trechos que batam com o padrão descrito na expressão, como apenas `mon`:

![imagem ilustrando matching da regex "mon"]({{ "/img/posts/2017-03-30-regexr-3.png" | prepend: site.baseurl }})

Lindo, não? Pra hoje, já está de bom tamanho. No próximo post veremos alguns dos tais caracteres especiais.

Valeu pessoas!

Falou...

---

<span class="previous-post">[Introdução <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({{ site.baseurl }}{% link _posts/2017-03-29-falando-sobre-expressoes-regulares-introducao.md %})</span> <span class="next-post">[<img class="icon32" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> Primeiros Metacaracteres]({{ site.baseurl }}{% link _posts/2017-03-31-falando-sobre-expressoes-regulares-primeiros-metacaracteres.md %})</span>
