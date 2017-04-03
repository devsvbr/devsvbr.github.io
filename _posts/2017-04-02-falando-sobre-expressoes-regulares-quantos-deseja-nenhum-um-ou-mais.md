---
layout: post
title:  "Falando sobre Expressões Regulares: Quantos deseja? Nenhum? Um? Ou mais?"
author: Eric Yuzo
categories: regex
---
E aí pessoas!

No [último post]({{ site.baseurl }}{% link _posts/2017-04-01-falando-sobre-expressoes-regulares-eu-quero-um-ponto-literal-e-ponto-final.md %}) criamos uma regex pra bater com a URL do blog. Eu gostei tanto do exemplo que resolvi continuar com ele. A ideia agora é deixar a regex mais genérica, capturando bem mais casos.

Nosso ponto de partida é a regex que bate apenas com a URL "www.devsv.com.br":

![imagem ilustrando matching da url do devsv]({{ "/img/posts/2017-04-02-matching-url-1.png" | prepend: site.baseurl }})

Primeiro, vamos fazer a regex capturar o protocolo http:

![imagem ilustrando matching da url do devsv com http]({{ "/img/posts/2017-04-02-matching-url-2.png" | prepend: site.baseurl }})

Notem que é preciso escapar as barras após o "http:", uma vez que elas fazem parte da sintaxe do RegExr (tudo o que estiver entre as barras faz parte da expressão, portanto uma barra só é considerada literal se for escapada; esta sintaxe não é exclusividade do JavaScript, outras linguagens como Ruby e ferramentas como sed e vi também delimitam uma regex com barras).

Próximo objetivo: aceitar o protocolo https:

![imagem ilustrando matching da url do devsv com https]({{ "/img/posts/2017-04-02-matching-url-3.png" | prepend: site.baseurl }})

Muito bom! Mas estamos em um processo incremental e queremos que o "http://www.devsv.com.br" continue sendo aceito no matching.

Vamos pensar um pouco... O que precisamos fazer pra bater as duas URLs?

Hmmm... O "http" está sempre lá... já o "s" pode estar presente ou não, tanto faz... o restante da regex está ok...

Bingo! Este é o ponto, tanto faz se o "s" aparece ou não aparece na URL, a regex deve capturar os 2 casos. Resumindo, o "s" é um elemento **opcional** na URL.

O metacaractere que vai nos ajudar nesta tarefa é o "?" (interrogação). Sua função é fazer com que o caractere à sua esquerda se torne **opcional**. Se queremos que "s" seja opcional, usamos a regex "s?":

![imagem ilustrando matching da url do devsv com http ou https]({{ "/img/posts/2017-04-02-matching-url-4.png" | prepend: site.baseurl }})

Bão demais!

E agora o bagulho fica louco! Porque o novo objetivo é capturar qualquer URL com domínio terminado em ".com.br".

Vish! E agora?

Mais um momento de reflexão...

![imagem pensando...]({{ "/img/posts/2017-04-02-pensando.png" | prepend: site.baseurl }})

O raciocínio é o seguinte, eu preciso capturar URLs seguindo algumas regras:

1. começa com _"http"_;
2. seguido por um _"s" opcional_;
3. seguido por _"://www."_;
4. seguido por _qualquer coisa_;
5. terminando com _".com.br"_.

As regras 1, 2, 3 e 5 já são satisfeitas na nossa regex. O problema que temos pra resolver, é a regra 4: aceitar qualquer coisa.

Já conhecemos o ponto, que vai bater com qualquer caractere. Agora precisamos de algo que multiplique as ocorrências do ponto. Algo que aceite "a" ou "aa" ou "aaa" ou "aaaaaaaaaa" e assim por diante.

Bingo de novo! Como já é previsível, essa é a hora que eu mostro mais um metacaractere. Então que seja bem vindo o "\*" (asterisco).

O asterisco (assim como o ponto de interrogação) é um metacaractere chamado de **quantificador**, pois ele não define **o que** a regex deve bater, mas define a **quantidade de vezes** que o elemento pode aparecer no matching. Falando especificamente do asterisco, seu papel na regex é permitir que o caractere imediatamente à sua esquerda apareça **nenhuma, uma ou mais vezes** no matching.

Voltando ao nosso problema, o vulgo  _"qualquer coisa"_ pode ser escrito como ".\*". Aplicando na regex, temos:

![imagem ilustrando matching de urls .com.br]({{ "/img/posts/2017-04-02-matching-url-5.png" | prepend: site.baseurl }})

Parece bonito, mas tem um porém. O "ponto seguido de asterisco" aceita **nenhuma** ocorrência de _"qualquer coisa"_, portanto a URL "http://www..com.br" é capturada no matching, veja:

![imagem ilustrando matching da url www..com.br]({{ "/img/posts/2017-04-02-matching-url-6.png" | prepend: site.baseurl }})

Existe um outro metacaractere, o "+" (mais), que faz com que a regex aceite **uma ou mais** repetições do elemento imediatamente anterior a ele. Muito parecido com o asterisco, a diferença é que ele **não** permite a ausência do elemento.

Vejamos como ele se comporta em nossa regex:

![imagem ilustrando matching correto de urls .com.br]({{ "/img/posts/2017-04-02-matching-url-7.png" | prepend: site.baseurl }})

Legal! Estamos conseguindo deixar nossa regex cada vez mais genérica. E vamos melhorá-la ainda mais. Mas agora é hora de uma pausa pro café.

Deixe-me apenas atualizar a tabela dos metacaracteres.

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
  </tbody>
</table>

Valeu pessoas! Bom café a todos! Falou...

