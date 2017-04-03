---
layout: post
title:  "Falando sobre Expressões Regulares: Se conselho fosse bom..."
author: Eric Yuzo
categories: regex
---
E aí pessoas!

Estou de volta pra continuar melhorando a regex que criamos [neste post]({{ site.baseurl }}{% link _posts/2017-04-02-falando-sobre-expressoes-regulares-quantos-deseja-nenhum-um-ou-mais.md %}) para capturar URLs.

Diferente dos últimos posts, minha proposta pra hoje não é apresentar nenhum metacaractere novo. A proposta pra hoje é corrigir algumas falhas que ainda não vieram à tona.

Para isto, vamos começar refletindo!

![imagem refletindo]({{ "/img/posts/2017-04-03-refletindo.png" | prepend: site.baseurl }})

Primeiro, vamos pensar sobre o que fizemos até agora, durante a criação da regex pra capturar URLs.

Em resumo, caminhamos com os seguintes passos:

1. Começamos escrevendo uma expressão pra capturar um caso bastante simples, uma URL fixa: `http:\/\/www\.devsv\.com\.br`;
2. Em seguida, flexibilizamos o trecho do protocolo pra aceitar tanto "http" quanto "https": `https?:\/\/www\.devsv\.com\.br`;
3. Por fim, flexibilizamos a parte principal do nome do domínio pra aceitar qualquer coisa: `https?:\/\/www\..+\.com\.br`.

A regex do passo 1 está bem definida, ela vai capturar "**http://www.devsv.com.br**".

No passo 2 também temos uma regex bem definida, que vai capturar ou "**http://www.devsv.com.br**" ou "**https://www.devsv.com.br**".

Até aí tudo bem. Agora vamos analisar a regex do passo 3. Ela possui um trecho com um “ponto” seguido de um “sinal de mais”. Vamos direcionar o foco para o ponto: ele bate com qualquer coisa, e “qualquer coisa” é um conjunto muito amplo de possibilidades.

Por exemplo, veja o seguinte matching:

![imagem ilustrando matching de url apenas com pontos]({{ "/img/posts/2017-04-03-matching-url-1.png" | prepend: site.baseurl }})

O ponto (literal) faz parte do conjunto "qualquer coisa", mas será que ele deveria fazer parte do matching? Receio que não. Mas veja pelo lado bom: já temos um conjunto menor que "qualquer coisa", que é "qualquer coisa exceto o ponto". Vamos trocar o ponto (metacaractere) por uma lista negando o ponto (literal):

![imagem ilustrando correcao do matching de url apenas com pontos]({{ "/img/posts/2017-04-03-matching-url-2.png" | prepend: site.baseurl }})

Resolveu o problema do ponto, mas "qualquer coisa exceto ponto" ainda é um conjunto muito grande. Então já me adiantei e deixei mais casos que não deveriam entrar no matching. Isto quer dizer que precisamos ser mais restritos.

Eu quero evitar a fadiga! E esta estratégia de ir colocando caracteres na blacklist será muito cansativa. Portanto, não rola pro nosso caso.

Vamos pensar mais um pouco...

A solução deste problema passa pela definição de quais caracteres são permitidos na URL. Cá entre nós, eu não sei qual é a regra oficial que as URLs seguem, então vamos assumir que a URL deve ser formada apenas por letras minúsculas. Para nós, esta é a regra que tá valendo.

Agora que definimos um conjunto bem específico dos caracteres permitidos, basta transcrever a regra na sintaxe das expressões regulares. Quando eu [apresentei os colchetes]({{ site.baseurl }}{% link _posts/2017-03-31-falando-sobre-expressoes-regulares-primeiros-metacaracteres.md %}), eu havia comentado sobre a possibilidade de incluir faixas de caracteres em sequência usando o hífen. Pois é este recurso que vamos usar pra representar as letras de "a" até "z" em nossa regex:

![imagem ilustrando matching de url mais restrito]({{ "/img/posts/2017-04-03-matching-url-3.png" | prepend: site.baseurl }})

Bem melhor! Temos uma regex mais restrita, e o principal: mais sólida, que reflete melhor nosso domínio!

Para concluir, eu sei que dizem que se conselho fosse bom, seria vendido e não distribuído de graça. Mas como eu não sou do tipo empresário opressor, eu gostaria de deixar alguns conselhos gratuitos.

Lembrem-se: procurem restringir as opções de matching o máximo possível, claro que seguindo as regras do seu domínio. Não digo para nunca usar ponto ou listas muito grandes, mas que os utilize com consciência. Outro ponto importante é que não basta testar apenas casos que devem dar matching, teste também os casos que não devem entrar no matching, confirme que eles não são capturados de fato. Afinal, a expressão regular falha ao deixar escapar um trecho que ela deveria capturar, mas também falha ao capturar o que não deveria. Pequenas ações como estas podem evitar um problema de mau funcionamento do sistema no futuro, quando algum usuário conseguir surpreender a todos com uma entrada de dados bizarra no sistema.

É isso aí! Chega de filosofia computacional!

Espero vê-los no próximo post, onde voltarei para os quantificadores.

Valeu pessoas! Falou...

