---
layout: post
comments: true
series: "Falando sobre Expressões Regulares"
title: "Introdução"
description: "Pequena analogia que mostra uma motivação para o uso de expressões regulares."
author: Eric Yuzo
categories: regex
---
E aí pessoas!

Depois de um longo tempo de hibernação, estou de volta com uma série de posts onde vou falar um pouco sobre as expressões regulares (ER) e seu uso em algumas ferramentas.

Eu uso muito as expressões regulares em atividades de rotina, principalmente no editor de texto e também  para buscar arquivos baseado no conteúdo. Eu também trabalhei um bom tempo com processamento de texto, parsing e matching de strings, que foi onde realmente pude entender melhor o que é possível fazer com expressões regulares. Mas não se enganem pelas minhas palavras, apesar de eu ter um pouco de experiência, eu estou bem... bem longe de poder dizer que sou um especialista em ER. Mas é um recurso que eu gosto bastante e está presente em tudo que é lugar, desde ferramentas pra edição de texto (como vi, Sublime Text, ...), ferramentas de processamento de texto (como grep, sed, awk, ...), até nas APIs das principais linguagens de programação do mercado. Será bem prazeroso falar sobre o assunto e espero aprender bastante escrevendo, assim como espero que seja proveitoso pra vocês que dispensam um tempo pra ler meus posts.


Então, vamos lá. Antes de começar a falar especificamente das expressões regulares, quero parar um pouco pra pensar em algumas atividades de processamento de texto.

Considere uma ferramenta de busca simples, daquelas que eu digo o que quero e ela destaca os resultados encontrados.

Como exemplo, vou usar uma frase filosófica que um grande amigo, o Chico, disse uma vez com toda sua sabedoria:

> Eu gostaria de ser monge, mas a profissão de monge no Brasil não dá dinheiro.

A frase é simplesmente genial. Eu sou um grande fã do Chico por isto, além de ser um grande programador, é um grande filósofo. Quem o conhece sabe que esta é apenas uma dentre muitas frases lendárias que ele já disse ao longo de sua história. Mas o post de hoje não é sobre o Chico, então vamos retomar o foco da ferramenta de busca.

Imagine que eu peça pra ferramenta buscar a palavra _monge_, certo? Ela me devolveria o seguinte:

> Eu gostaria de ser `monge`, mas a profissão de `monge` no Brasil não dá dinheiro.

A ferramenta poderia ser do tipo muito avançada e permitir buscas mais flexíveis, como "me retorne todas as palavras que começam com a letra D". Neste caso o retorno seria:

> Eu gostaria `de` ser monge, mas a profissão `de` monge no Brasil não `dá` `dinheiro`.

Esta ferramenta muito avançada também poderia atender solicitações como: "procure pra mim pelas palavras que possuem exatamente 3 letras":

> Eu gostaria de `ser` monge, `mas` a profissão de monge no Brasil `não` dá dinheiro.

Hora de mudar de ferramenta! Vamos imaginar uma outra ferramenta que tem o poder de fazer permuta. Do tipo que eu falo: "Por favor, poderia trocar a palavra _monge_ pela palavra _programador_?" e ela responde: "Como você pediu com educação, eu atenderei seu pedido" e devolve o resultado:

> Eu gostaria de ser `programador`, mas a profissão de `programador` no Brasil não dá dinheiro.

Hora de sair do mundo da imaginação e concluir o raciocínio.

Olhando para as tarefas que imaginamos acima, consegue ver algum processo que seja comum à todas elas?

É justamente a fase de busca propriamente dita; a comparação de partes do texto com um padrão a ser buscado; o **matching de string**.

Tanto as ferramentas de busca (seja a simples ou a muito avançada) quanto a ferramenta da permuta procuram no texto (a frase do Chico) por um determinado padrão (a palavra _monge_, palavras com 3 letras, ...).

As ferramentas que imaginamos aqui são realmente muito avançadas, pois elas entendem bem a linguagem natural do ser humano. Mas as ferramentas do mundo real não conseguem entender nossa linguagem natural. É por isso que veremos, ao longo dos próximos vários posts, como descrever padrões semelhantes aos que imaginamos hoje usando uma sintaxe formal que as ferramentas e as APIs do mundo real entendem, as **expressões regulares**.

Valeu pessoas!

Falou...

---

<span class="next-post">[<img class="icon32" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> Começando com Caracteres Literais]({{ site.baseurl }}{% link _posts/2017-03-30-falando-sobre-expressoes-regulares-comecando-com-caracteres-literais.md %})</span>
