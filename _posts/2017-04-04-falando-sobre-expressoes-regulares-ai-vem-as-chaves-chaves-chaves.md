---
layout: post
title:  "Falando sobre Expressões Regulares: Aí vem as Chaves... Chaves... Chaves..."
author: Eric Yuzo
categories: regex
---
E aí pessoas!

Ao longo dos últimos posts, estamos nos familiarizando com as expressões regulares enquanto criamos uma expressão que captura URLs. E a proposta pra hoje é seguir de onde paramos.

Nossa regex está aceitando qualquer domínio escrito com letras de "a" a "z", desde que terminem em ".com.br":

![imagem ilustrando matching com urls .com.br]({{ "/img/posts/2017-04-04-matching-url-1.png" | prepend: site.baseurl }})

Hora de expandir os horizontes, aceitar outros tipos de domínios como ".org.br", ".gov.br", ".net.uk", etc.

Temos que começar identificando a regra. Como comentei no post anterior, eu não conheço o padrão oficial pra definição do nome de domínio. Então, vamos fechar que no nosso cenário a regra é: "3 letras seguidas de um ponto seguido de mais 2 letras". Ok?

Uma solução rápida é incluir diversas listas de "a" a "z" em nossa expressão. Vamos tentar?

![imagem ilustrando matching de urls sem restringir em .com.br]({{ "/img/posts/2017-04-04-matching-url-2.png" | prepend: site.baseurl }})

O resultado já é satisfatório, mas a expressão ainda pode melhorar no quesito legibilidade. Até que ainda não está tão ruim, mas imagine se a regra mudasse para "30 letras seguidas de um ponto seguido de 20 letras". A expressão ficaria bizarramente enorme.

Este cenário hipotético levanta uma questão: Será que não existe um quantificador que defina a quantidade exata de vezes que o elemento deve aparecer no matching?

Não é que existe mesmo? Quem faz este serviço são as **chaves**. Com elas especificamos a quantidade usando a sintaxe `c{n}`, onde **n** é o número de vezes que o caractere **c** deve se repetir.

Vejamos como fica nossa regex reescrita para usar as chaves:

![imagem ilustrando matching de urls sem restringir em .com.br usando chaves]({{ "/img/posts/2017-04-04-matching-url-3.png" | prepend: site.baseurl }})

Show!

Temos regras bem definidas e uma regex que nos atende muito bem. Mas um requisito não é um requisito se não sofrer nenhuma alteração no meio do projeto!

O novo requisito diz que precisamos capturar também URLs no padrão da usada pela Universidade de Tóquio: "http://www.u-tokyo.ac.jp".

Ela tem 2 características que impedem o match, um hífen no meio do nome do domínio e o penúltimo bloco com apenas 2 caracteres.

Pra passar a capturá-la, precisamos mudar a regra do nome principal do domínio para aceitar letras de "a" a "z" mais o hífen, além de mudar a regra do penúltimo bloco para aceitar tanto 2 quanto 3 letras.

A primeira alteração consiste em colocar o hífen no início ou no fim da lista, para que ele seja interpretado como um caractere literal.

Para realizar a segunda alteração, precisaremos passar 2 parâmetros para as chaves. Seguindo a sintaxe `c{n,m}`, dizemos pra regex aceitar entre **n** e **m** repetições do caractere **c**. Em nosso cenário, queremos que o bloco tenha de 2 a 3 letras, então passamos a expressão `[a-z]{2,3}`.

Aplicando as duas alterações temos:

![imagem ilustrando regra que inclui url da utokyo no matching]({{ "/img/posts/2017-04-04-matching-url-4.png" | prepend: site.baseurl }})

Show! Maneiro!

Já que é pra mudar requisito, deixe-me inventar uma regra nova: o bloco principal do nome do domínio deve conter pelo menos 3 letras. Se existir algum domínio com apenas 1 ou 2 letras, só lamento!

Mais uma vez recorremos as chaves. Desta vez com a sintaxe `c{n,}`, que quer dizer que o elemento **c** deve se repetir **n** ou mais vezes. Bem parecido com o asterisco ou com o sinal de mais, com a diferença que nós definimos o limite inferior.

1... 2... 3... testando...

![imagem ilustrando matching de domínios com pelo menos 3 letras]({{ "/img/posts/2017-04-04-matching-url-5.png" | prepend: site.baseurl }})

Show! Maneiro! Maneiríssimo!

Assim, conhecemos as três faces das chaves. No próximo post conheceremos um pouco da personalidade dos quantificadores.

Antes de encerrar, não custa atualizar a tabela dos metacaracteres:

<table class="table table-bordered">
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
</table>

Valeu pessoas!

Falou...

---

<span>[Se conselho fosse bom... <img class="previous-post" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({{ site.baseurl }}{% link _posts/2017-04-03-falando-sobre-expressoes-regulares-se-conselho-fosse-bom.md %})</span> <span class="pull-right">[<img class="next-post" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> Ela é gulosa... Estúpida!]({{ site.baseurl }}{% link _posts/2017-04-08-falando-sobre-expressoes-regulares-ela-e-gulosa-estupida.md %})</span>

<br />

