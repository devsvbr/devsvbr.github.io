---
layout: post
title:  "Falando sobre Expressões Regulares: Começando com Caracteres Literais"
author: Eric Yuzo
categories: regex
---
E aí pessoas!

Estou de volta pra falar um pouco mais sobre expressões regulares. Assunto que iniciei no post de [introdução]({{ site.baseurl }}{% link _posts/2017-03-29-falando-sobre-expressoes-regulares-introducao.md %}).

A partir de agora, pra economizar teclas e aumentar a vida útil do meu teclado, vou me referir às expressões regulares como **regex** (do inglês, **reg**ular **ex**pression). É bem comum encontrar pessoas usando este termo e é bem útil também como palavra chave na hora de _"googlar"_.

Dados nomes e apelidos aos bois, vamos pra parte que todo mundo gosta, a ação. Err... na verdade não, ainda tem mais um pouquinho de teoria, mas é só uma nequinha e logo vamos pra ação.

Eu fiquei pensando um pouco sobre qual seria a melhor ferramenta pra testar as expressões regulares que mostrarei nos exemplos. Passou pela cabeça usar uma linguagem de programação, mais especificamente _Python_, mas adicionaria um pré-requisito para quem acompanha os posts, que seria ter _Python_ instalado. Pensei também em mostrar os exemplos usando o _egrep_, mas quem usa _Windows_ teria que instalar algum emulador de ferramentas _Unix_. Acabei encontrando uma plataforma bem interessante que me pareceu o modo mais acessível pra qualquer leitor do blog, que é possuir um navegador com _JavaScript_ habilitado e acesso à internet. Se trata do [RegExr](http://regexr.com/), uma plataforma para testes de regex online desenvolvida pelo [Grant Skinner](https://github.com/gskinner) (gostaria de poder fazer um comentário vibrante sobre ele agora, mas não conheço a peça, então fica pra próxima, sorry pal). Nela também é possível aprender mais sobre as regex em um dos diversos guias presentes na própria plataforma.

Então, deixo como sugestão, o uso dessa plataforma. Mas nada impede que usem outra ferramenta. Só é preciso que saibam que nem tudo são flores. As expressões não possuem exatamente o mesmo conjunto de recursos em todas as plataformas. Por exemplo, as regex do _python_ possuem alguns recursos que as regex do _grep_ não possuem e vice versa. Pra você que pensou algo do tipo: "WTF? Vou ter que aprender tudo de novo quando mudar de plataforma?", eu digo pra não se preocupar, existem sim essas diferenças nos recursos, mas não é o armageddon. Existe um conjunto de recursos centrais que estão em todas as implementações mais conhecidas. São esses recursos que mostrarei ao longo dos posts. =)

Caso esteja curioso sobre o engine usado pelo _RegExr_, é o engine da API [RegExp](https://www.w3schools.com/jsref/jsref_obj_regexp.asp) do _JavaScript_.

Sem mais delongas, agora sim, vamos começar a fazer matchings! \o/

Lembram da frase do glorioso Chico que usei no post anterior? Pois é, vou utilizá-la de novo. Pra quem não leu a primeira parte, a frase está aí:

> Eu gostaria de ser monge, mas a profissão de monge no Brasil não dá dinheiro.

Primeiro, vou copiar e colar a frase no campo _Text_ do _RegExr_. Em seguida, no campo _Expression_, vou prencher com a string monge (ignore a / no início e o /g no fim, eles fazem parte da sintaxe, apenas preencha a expressão entre as duas barras). Deste modo, repetimos a simulação que fizemos no post anterior:

![imagem ilustrando matching da regex "monge"]({{ "/img/posts/2017-03-30-regexr-1.png" | prepend: site.baseurl }})

Como podem ver, ele fez o matching nas 2 palavras "monge" presentes no texto. Aí está a primeira lição: um caractere literal dá matching apenas com um caractere igual a ele. Por exemplo, o caractere "m" bate apenas com o caractere "m", "o" bate apenas com "o", etc. (Nooossa, ficou muito estranho o termo "dá matching", mas se o aplicativo de pegação usa, por que não eu?).

Um trecho da string só é considerado matching, quando bate com a expressão regular inteira. No caso da expressão "monge", ele bate apenas se houver a sequência completa "monge" dentro da string. Por exemplo, altere a expressão de _monge_ para _monges_ e veja o que acontece:

![imagem ilustrando matching da regex "monges"]({{ "/img/posts/2017-03-30-regexr-2.png" | prepend: site.baseurl }})

Não houve matching, pois não existe a sequência "monges" na string.

E a busca não se limita a palavras inteiras, a regex vai considerar como matching quaisquer trechos que batam com a sequência descrita na expressão, como apenas _mon_:

![imagem ilustrando matching da regex "mon"]({{ "/img/posts/2017-03-30-regexr-3.png" | prepend: site.baseurl }})

Antes de fechar este post, quero apenas mostrar uma aplicação prática da busca que fizemos aqui. Como uma imagem vale mais que mil palavras ~~(e eu quero preservar a vida útil do meu teclado)~~, segue a imagem:

![imagem com exemplo de busca com grep]({{ "/img/posts/2017-03-30-grep.png" | prepend: site.baseurl }})

Esta imagem mostra meu terminal _Linux_, onde uso o programa _grep_ pra buscar a string "monge" no arquivo _frase-do-chico.txt_, que contém a marcante frase. Esse exemplo é bem bobo, meramente ilustrativo, mas o _grep_ não é nada bobo. Com ele filtramos do input do terminal, apenas as linhas que dão match com a regex que passamos por parâmetro. Uma ferramenta importantíssima, principalmente pra administradores de sistemas _Unix-like_.

Lindo, não? Hahaha. Pra hoje, já está de bom tamanho. No próximo post veremos alguns truques de mágica.

Falou...

