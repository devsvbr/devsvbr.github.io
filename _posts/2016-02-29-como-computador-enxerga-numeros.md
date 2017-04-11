---
layout: post
title:  "Como o computador enxerga os números?"
author: Eric Yuzo
categories: binario conceito
---
Antes de falar dos computadores, vamos pensar um pouco sobre como nós mesmos vemos os números.

Olhe para a figura abaixo:

![Era pra aparecer uma foto aqui. =(]({{ "/img/posts/2016-02-29-moedas.png" | prepend: site.baseurl }})

E responda duas perguntas:

1. Quantas moedas você vê na figura?

2. Qual é o valor total das moedas na figura?

Você não deve ter tido dificuldade para responder que são 6 moedas e que seu valor somado é de 110 centavos (ou R$ 1,10).

Mostrei essa mesma foto e fiz as mesmas perguntas pra alguns amigos e a resposta foi a mesma. Todos acertaram e acharam extremamente fácil, assim como eu esperava. ~~O mais surpreendente foi que todos pensaram que eu estava tentando sacaneá-los com algum tipo de pegadinha. Não entendi por que pensaram isso, mas também não vem ao caso, vamos esquecer este detalhe...~~

O fato é que nos acostumamos a contar e somar números desde pequenos. Por isso, executamos essas tarefas no modo automático e, muitas vezes, nem sabemos explicar como fazemos. É algo que simplesmente fazemos.


## Sobre o sistema decimal. ##

Pensando de forma mais técnica, podemos dizer que representamos números no sistema de numeração decimal. Ele recebe este nome por utilizar dez algarismos (0, 1, 2, 3, 4, 5, 6, 7, 8 e 9) para codificar os números. Por possuir 10 algarismos, podemos dizer também, que sua base é 10. Deste modo, para representar números maiores que 9, combinamos algarismos que podem valer mais ou valer menos de acordo com sua posição. O valor de posição é definido pelas potências de base 10:

<table class="table text-center">
  <tbody>
    <tr>
      <td>10<sup>3</sup></td><td>10<sup>2</sup></td><td>10<sup>1</sup></td><td>10<sup>0</sup></td><td>10<sup>-1</sup></td><td>10<sup>-2</sup></td><td>10<sup>-3</sup></td>
    </tr>
    <tr>
      <td>1000</td><td>100</td><td>10</td><td>1</td><td>0,1</td><td>0,01</td><td>0,001</td>
    </tr>
  </tbody>
</table>

Com isso podemos representar qualquer número, por exemplo:

![imagem com exemplo de número decimal]({{ "/img/posts/2016-02-29-decimal.png" | prepend: site.baseurl }})


## E os computadores, como eles enxergam os números? ##

Sabemos que seres humanos são muito bons para contar utilizando o sistema decimal, mas não podemos falar o mesmo dos computadores.

Os computadores processam sinais elétricos digitais. Isto quer dizer que eles veem o mundo na forma da presença ou da ausência de tensão elétrica. Se associarmos a ausência de tensão ao dígito `0` e a presença de tensão ao dígito `1`, podemos dizer que o computador enxerga o mundo na forma de "zeros e uns".

O sistema de numeração que utiliza apenas dois dígitos (0 e 1) para codificar números é conhecido como `sistema binário`.

## Sobre o sistema binário. ##

O sistema binário segue a mesma lógica do sistema decimal. Porém, os números são formados pela combinação dos dígitos 0 e/ou 1 e os valores de posição são definidos por potências de base 2:

<table class="table text-center">
  <tbody>
    <tr>
      <td>2<sup>6</sup></td><td>2<sup>5</sup></td><td>2<sup>4</sup></td><td>2<sup>3</sup></td><td>2<sup>2</sup></td><td>2<sup>1</sup></td><td>2<sup>0</sup></td>
    </tr>
    <tr>
      <td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td>
    </tr>
  </tbody>
</table>

A seguir temos um exemplo de um número binário e seu equivalente decimal:

![imagem com exemplo de número binário]({{ "/img/posts/2016-02-29-binario.png" | prepend: site.baseurl }})

_P.S.:_ Ao longo deste post, deixarei a base subscrita ao lado do número, para diferenciar quem é binário de quem é decimal. Ex.: 100<sub>2</sub> representa um número binário, que é bem diferente do número 100<sub>10</sub> em decimal.


### Leitura de números binários. ###

A leitura dos números binários é feita sem associações. Basta seguir a sequência de "uns" e "zeros". Por exemplo, o número 101<sub>2</sub> é lido como `um, zero, um`, e não `cento e um` como seria no sistema decimal.


### Termos comuns: bits, LSB e MSB. ###

Existem alguns termos relacionados aos números binários que são bem comuns na área de computação. A seguir temos três deles:

`bit`: é o nome dado a cada dígito do número binário. Ele vem da expressão em inglês "<b>bi</b>nary digi<b>t</b>".

`LSB (Least Significant Bit)`: representa o bit menos significativo, que é o bit que representa uma unidade;

`MSB (Most Significant Bit)`: representa o bit mais significativo, que é aquele com o maior valor de posição.


### Conversão de número binário para decimal. ###

A conversão consiste em multiplicar cada bit pelo seu valor de posição e, em seguida, somar os resultados.

Exemplo: Conversão do número 10110<sub>2</sub> para decimal.

![imagem da conversão de binário para decimal]({{ "/img/posts/2016-02-29-binario-para-decimal.png" | prepend: site.baseurl }})

Resultado: 10110<sub>2</sub> = 22<sub>10</sub>.


### Conversão de número decimal para binário. ###

O algoritmo básico de conversão de um número decimal para binário consiste em dividir o número por 2 sucessivamente até que o quociente seja igual a 0. O número binário é formado pelos restos de todas as divisões em sequência, sendo o resto da primeira divisão o bit menos significativo (LSB) e o resto da última divisão o bit mais significativo (MSB).

Muito confuso? Também acho. Então vamos a um exemplo, que ilustrará a conversão do número 57<sub>10</sub> para binário:

1) Dividimos o número decimal por 2 &rarr; 57 / 2 &rarr; quociente = 28 e resto = 1 = LSB = bit 1:

![imagem da conversão de decimal para binário passo 1]({{ "/img/posts/2016-02-29-decimal-para-binario-1.png" | prepend: site.baseurl }})

2) Dividimos o quociente da última divisão por 2 &rarr; 28 / 2 &rarr; quociente = 14 e resto = 0 = bit 2:

![imagem da conversão de decimal para binário passo 2]({{ "/img/posts/2016-02-29-decimal-para-binario-2.png" | prepend: site.baseurl }})

3) Dividimos o quociente da última divisão por 2 &rarr; 14 / 2 &rarr; quociente = 7 e resto = 0 = bit 3:

![imagem da conversão de decimal para binário passo 3]({{ "/img/posts/2016-02-29-decimal-para-binario-3.png" | prepend: site.baseurl }})

4) Dividimos o quociente da última divisão por 2 &rarr; 7 / 2 &rarr; quociente = 3 e resto = 1 = bit 4:

![imagem da conversão de decimal para binário passo 4]({{ "/img/posts/2016-02-29-decimal-para-binario-4.png" | prepend: site.baseurl }})

5) Dividimos o quociente da última divisão por 2 &rarr; 3 / 2 &rarr; quociente = 1 e resto = 1 = bit 5:

![imagem da conversão de decimal para binário passo 5]({{ "/img/posts/2016-02-29-decimal-para-binario-5.png" | prepend: site.baseurl }})

6) Dividimos o quociente da última divisão por 2 &rarr; 1 / 2 &rarr; quociente = 0 e resto = 1 = bit 6:

![imagem da conversão de decimal para binário passo final]({{ "/img/posts/2016-02-29-decimal-para-binario-6.png" | prepend: site.baseurl }})

7) Como o quociente da última divisão foi igual 0, paramos as divisões e montamos o número binário (quando escrever o número, lembre-se que o LSB é o primeiro bit da direita):

![imagem da conversão de decimal para binário passo final]({{ "/img/posts/2016-02-29-decimal-para-binario-7.png" | prepend: site.baseurl }})

Resultado: 57<sub>10</sub> = 111001<sub>2</sub>.

Se quiser fazer um exercício, tente converter o número 111001<sub>2</sub> para decimal e confira se o resultado é de fato 57<sub>10</sub>.


## Concluindo... ##

Neste post vimos um pouco sobre os números binários. A partir deles o computador é capaz de representar os diversos tipos de dados que temos contato enquanto codificamos em linguagens de alto nível. No próximo post, falarei um pouco sobre a representação binária dos números inteiros que usamos nas linguagens de programação.

Até a próxima!!
