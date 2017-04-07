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

Até aí tudo bem. Agora vamos analisar a regex do passo 3. Ela é composta por um `.+`. Este trecho bate com qualquer coisa, e “qualquer coisa” é um conjunto muito amplo de possibilidades.

Por estar muito flexível, ela captura muitos casos. Muitos deles nós realmente queremos capturar. Porém, ela apresenta muitos falso-positivos. Um falso-positivo é um caso que dá match, mas que não queremos que dê match. Por exemplo, veja o seguinte teste:

![imagem ilustrando matching de url apenas com pontos]({{ "/img/posts/2017-04-03-matching-url-1.png" | prepend: site.baseurl }})

O ponto (literal) faz parte do conjunto "qualquer coisa", entretanto a URL cheia de pontos não deveria fazer parte do matching. Vendo pelo lado bom, já temos um conjunto menor que "qualquer coisa", que é "qualquer coisa exceto o ponto". Vamos trocar o ponto (metacaractere) por uma lista negando o ponto (literal):

![imagem ilustrando correcao do matching de url apenas com pontos]({{ "/img/posts/2017-04-03-matching-url-2.png" | prepend: site.baseurl }})

Resolveu o problema do ponto, mas "qualquer coisa exceto ponto" ainda é um conjunto muito grande. Então já me adiantei e deixei mais casos que não devem dar match. Isto quer dizer que precisamos ser mais restritos.

Mas será que esta estratégia de ir adicionando caracteres na blacklist é uma boa estratégia?

Dependendo do caso, pode ser a solução mais viável. Mas pro nosso caso não rola. Seria muito cansativo encontrar todos os caracteres que devem ser banidos.

A solução do nosso problema passa pela definição de quais caracteres são permitidos na URL. Cá entre nós, eu não sei qual é a regulamentação que define o padrão dos nomes de domínio. Então, vamos assumir que o domínio deve ser composto apenas de letras minúsculas. Pronto, esta é a regra que tá valendo pro nosso cenário.

Agora que definimos um conjunto bem específico dos caracteres permitidos, basta transcrever a regra na sintaxe das expressões regulares. Quando eu [apresentei os colchetes]({{ site.baseurl }}{% link _posts/2017-03-31-falando-sobre-expressoes-regulares-primeiros-metacaracteres.md %}), eu havia comentado sobre a possibilidade de incluir faixas de caracteres usando o hífen. Pois é este recurso que vamos usar pra representar as letras de "a" até "z" em nossa regex:

![imagem ilustrando matching de url mais restrito]({{ "/img/posts/2017-04-03-matching-url-3.png" | prepend: site.baseurl }})

Bem melhor! Temos uma regex mais restrita, e o principal: mais sólida, que atende melhor os requisitos!

Para concluir, eu sei que dizem que se conselho fosse bom, seria vendido e não distribuído de graça. Mas como eu não sou do tipo empresário opressor, eu gostaria de deixar alguns conselhos gratuitos.

Procurem restringir as opções de matching sempre que possível, claro que seguindo os requisitos do sistema. Não quero dizer que o ponto ou as listas muito grandes nunca devam ser utilizadas, mas que sejam utilizadas com consciência.

Outro ponto importante é que não basta testar apenas casos que devem dar matching, teste também os casos que não devem entrar no matching, confirme que eles não são capturados de fato. Afinal, a expressão regular falha ao deixar escapar um trecho que ela deveria capturar (falso-negativo), mas também falha ao capturar o que não deveria (falso-positivo).

Pequenas ações como estas podem evitar um problema de mau funcionamento de um sistema que usa regex, quando algum usuário conseguir surpreender a todos com uma entrada de dados bizarra no sistema.

É isso aí! Chega de filosofia computacional!

Espero vê-los no próximo post, onde voltarei para os quantificadores.

Valeu pessoas!

Falou...

---

<span>[Quantos deseja? Nenhum? Um? Ou mais? ![(anterior)]({{ "/img/icon/previous.png" | prepend: site.baseurl }})]({{ site.baseurl }}{% link _posts/2017-04-02-falando-sobre-expressoes-regulares-quantos-deseja-nenhum-um-ou-mais.md %})</span> <span class="pull-right">[![(próximo)]({{ "/img/icon/next.png" | prepend: site.baseurl }}) Aí vem as Chaves... Chaves... Chaves...]({{ site.baseurl }}{% link _posts/2017-04-04-falando-sobre-expressoes-regulares-ai-vem-as-chaves-chaves-chaves.md %})</span>

<br />

