---
pubid: "post-regex-pratica-1"
langvisible: false
comments: true
series: "Expressões Regulares na Prática"
title: "Filtragem de dados"
description: "Caso prático do uso de expressões regulares para filtrar dados."
date: 2017-05-30 17:35:00 -0300
author: Eric Yuzo
categories: regex
---
Fala aí pessoas!

Estou de volta pra complementar as últimas postagens sobre expressões regulares. Mas desta vez, o foco não está na parte teórica. Minha ideia é compartilhar com vocês algumas situações problema, de modo que para cada uma delas, apresentarei uma sugestão de solução fazendo uso de regex. O objetivo é mostrar exemplos práticos do emprego de expressões regulares.

Bora nessa?

Pra começar, eu quero compartilhar um tipo de tarefa que o _boss_ me pede pra fazer com frequência: filtrar dados de um arquivo texto.

Desta vez, eu preciso conseguir uma estimativa atualizada da população de cada município do estado de São Paulo que tenha nome de santo.

Muito bem. O IBGE disponibiliza esse dado de maneira pública em seu [servidor FTP](ftp://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2016/).

A questão é que o arquivo do IBGE possui a população estimada para todos os 5570 municípios brasileiros. Enquanto minha tarefa é obter apenas a população de alguns municípios de São Paulo. Sendo assim, eu preciso fazer uma filtragem no conteúdo do arquivo.

Afim de facilitar a minha vida, eu converti o arquivo disponibilizado pelo IBGE em XLS para CSV, que é um formato muito mais simples de se manipular. A metodologia de conversão não é o nosso foco, portanto deixarei o arquivo convertido disponível para download aqui: [populacao-ibge.csv]({{ "/downloads/2017/05/30/populacao-ibge.csv" | prepend: site.baseurl }}). E bora trabalhar, que o _boss_ tá esperando...

A partir de agora, seguirei utilizando ferramentas de linha de comando Linux.

Pra começar, farei uma exploração rápida usando o comando [`head`]({{ site.baseurl }}{% link _posts/2017-06-01-guia-rapido-linux-extraindo-as-primeiras-linhas-com-head.md %}):

![imagem mostrando o arquivo lido pelo head]({{ "/img/posts/2017-05-30-explorando-arquivo-head.png" | prepend: site.baseurl }})

O `head` retorna as 10 primeiras linhas do arquivo. Com uma olhada rápida, percebemos que a primeira contém o cabeçalho e as seguintes possuem os dados propriamente ditos.

O arquivo está formatado em um esquema tabular, seguindo o padrão CSV, onde os valores das colunas estão separados por vírgula. Olhando para o conteúdo bruto, não parece muito com uma tabela, mas veja como fica a visualização do mesmo arquivo quando formatado adequadamente:

![imagem mostrando o arquivo lido pelo column]({{ "/img/posts/2017-05-30-explorando-arquivo-column.png" | prepend: site.baseurl }})

Pra quem tiver interesse em entender o que foi feito, aqui vai uma breve explicação: o comando `column` é usado para formatar a entrada em colunas, afim de deixar a visualização mais agradável à vista humana. O parâmetro `-s` define o separador, que é a vírgula para o nosso caso, e o parâmetro `-t` diz que a saída deve ser apresentada em forma de tabela. Deste modo, ele quebra as colunas automaticamente quando encontrar uma vírgula e preenche os espaços em branco pra deixar a saída formatada como se fosse uma tabela. Por fim, temos um `|` que direciona a saída do `column` para o `head`, que exibe apenas as 10 primeiras linhas.

Voltando para a exploração do arquivo, vemos que a primeira coluna representa a sigla da UF de cada município da listagem. Assim, se eu filtrar as linhas que começam com "SP,", eu terei em mãos os dados das cidades paulistas.

Legal! Este será um bom aquecimento. Para fazer a filtragem, usarei o programa `egrep`:

```bash
egrep '^SP,' populacao-ibge.csv
```

O `egrep` é um programa usado para fazer busca textual. No exemplo, usamos o `egrep` para buscar pelos matchings da regex `^SP,` no arquivo `populacao-ibge.csv`. Ele devolverá para nós todas as linhas que tiverem algum trecho dando match com a regex especificada.

Vamos espiar quais são as primeiras linhas que ele retorna:

![imagem mostrando as primeiras linhas retornadas pelo egrep]({{ "/img/posts/2017-05-30-filtrando-dados-sp.png" | prepend: site.baseurl }})

A imagem acima mostra as 10 primeiras linhas retornadas pelo `egrep` (o `|` direciona a saída do `egrep` para o `head`, que devolve apenas as 10 primeiras linhas). Este passo foi tomado meramente pra visualização, e já podemos ver que somente as linhas começadas com "SP," estão aparecendo. Conclusão: regex funcionando. \o/

Para ter mais confiança, farei uma segunda verificação. Eu sei que, no momento que escrevo o post, o Brasil possui 5570 municícipios ao todo, sendo 645 no estado de SP. Portanto quero ver se o número de linhas filtradas bate com o número oficial. Podemos usar o comando `wc -l` pra contar as linhas do arquivo e o parâmetro `-c` para contar os matchings do egrep:

![imagem mostrando a quantidade de linhas filtradas]({{ "/img/posts/2017-05-30-linhas-dados-filtrados-sp.png" | prepend: site.baseurl }})

O arquivo original possui 5571 linhas (a linha excedente é o cabeçalho), já o egrep retornou 645 linhas. Tudo dentro do esperado.

Hora de encerrar o pedido. Com base nos recursos que vimos durante a série, eu vou montar uma regex para filtrar as cidades de SP que tenham nome de santo. Durante uma longa e cansativa reunião pra discutir o assunto, fechei com o _boss_ que as cidades a serem consideradas são as que começam com um dos trechos: "Santa", "Santo" e "São".

```bash
egrep '^SP,([0-9]+,){2}(Santa|Santo|São) ' populacao-ibge.csv
```

Eu usei a regex `^SP,([0-9]+,){2}(Santa|Santo|São) `, que vai dar match com linhas que começam com "SP," seguido por duas colunas formadas apenas por números (que são as colunas _"COD. UF"_ e _"COD. MUNIC"_), seguido por uma das strings "Santa ", "Santo " ou "São ".

Essa filtragem final me retorna 55 municípios. Vamos espiar os 10 primeiros:

![imagem mostrando as primeiras linhas retornadas pelo egrep filtrando nomes de santo]({{ "/img/posts/2017-05-30-filtrando-dados-sp-nomes-santo.png" | prepend: site.baseurl }})

Muito bom. Pra finalizar a tarefa, basta jogar o resultado pra um novo arquivo:

```bash
head -1 populacao-ibge.csv > populacao-sp-santo.csv
egrep '^SP,([0-9]+,){2}(Santa|Santo|São) ' populacao-ibge.csv >> populacao-sp-santo.csv
```

O comando `head -1` retorna apenas a primeira linha do arquivo `populacao-ibge.csv` (que é o cabeçalho) e o `>` direciona o retorno do `head` para um novo arquivo chamado `populacao-sp-santo.csv`. Na linha seguinte, temos o `egrep` que filtra os dados desejados, enquanto o `>>` adiciona o retorno no final do arquivo `populacao-sp-santo.csv`. Deste modo, o arquivo `populacao-sp-santo.csv` contém o cabeçalho seguido das 55 linhas filtradas pelo egrep, que é o resultado de mais um trabalho bem executado. =D

Muito bom pessoas! Este foi um exemplo de problema que pode ser resolvido com uso de regex. Esta não é a única maneira, eu poderia ler o arquivo e processá-lo com alguma linguagem de programação ou até mesmo em um editor de planilhas. Mas na minha opinião, fazer em 1 ou 2 linhas de shell parece a solução mais simples. E você, gosta de alguma solução diferente da minha? Percebeu algum problema no método descrito? Deixe sua opinião nos comentários.

Até a próxima!

Falou...
