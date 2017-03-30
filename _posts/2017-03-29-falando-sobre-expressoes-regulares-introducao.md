---
layout: post
title:  "Falando sobre Expressões Regulares: Introdução"
author: Eric Yuzo
categories: regex
---
E aí pessoas!

Depois de um longo tempo de hibernação, estou de volta com uma série de posts onde vou falar um pouco sobre as expressões regulares (ER) e seu uso em algumas ferramentas.

Eu trabalhei um bom tempo com processamento de texto e fiz muito uso de expressões regulares. Não seria exagero dizer que é o principal recurso que eu utilizo para fazer matching de strings. Ela está presente em diversas ferramentas de processamento de texto (grep, sed, awk, ...) e também nas APIs das principais linguagens de programação do mercado. Apesar de ter uma certa experiência, eu estou bem... bem longe de poder dizer que sou um especialista em expressões regulares, eu sou um mero usuário de ER. Mas é um assunto que gosto bastante, por isso estou trazendo pro blog.

Então, vamos lá. Antes de começar a falar especificamente das expressões regulares, quero parar um pouco pra pensar em algumas atividades de processamento de texto.

Considere primeiro uma ferramenta de busca. Como exemplo, vou usar uma frase filosófica que um grande amigo, o Chico, disse uma vez com toda sua sabedoria:

> Eu gostaria de ser monge, mas a profissão de monge no Brasil não dá dinheiro.

A frase é simplesmente genial. Eu sou um grande fã do Chico por isto, além de ser um grande programador, é um grande filósofo. Quem o conhece sabe que esta é apenas uma dentre muitas frases lendárias que ele já disse ao longo de sua história. Mas o post de hoje não é sobre o Chico, então vamos retomar o foco da ferramenta de busca.

Imagine que queremos fazer uma busca pela palavra _monge_, certo? Uma busca deste tipo nos devolveria 2 resultados, como destacado abaixo:

> Eu gostaria de ser `monge`, mas a profissão de `monge` no Brasil não dá dinheiro.

Legal, mas nem sempre queremos um matching direto, podemos procurar apenas por _palavras que começam com a letra d_? Sim claro, neste caso, as palavras que dariam match seriam as destacadas:

> Eu gostaria `de` ser monge, mas a profissão `de` monge no Brasil não `dá` `dinheiro`.

Agora chega de busca, pense numa ferramenta para edição de texto, como o _sed_. Uma das coisas que podemos fazer com o _sed_ é substituir um trecho de texto por outro. Por exemplo, podemos pedir para ele substituir a palavra _monge_ pela palavra _programador_ e ele nos devolve a frase:

> Eu gostaria de ser `programador`, mas a profissão de `programador` no Brasil não dá dinheiro.

Veja que aqui também existe uma fase de busca, mas ao invés de apenas retornar o trecho encontrado, ele substitui o trecho por outra string.

Pra fechar, considere o processo de validação de um texto que represente um número inteiro. O fundamental é definir quais são os **critérios** que devem ser seguidos para que o texto seja considerado válido, ou melhor, qual **padrão** o texto deve seguir. No caso dos números inteiros, eles devem ser formados apenas por dígitos numéricos, de modo que apenas o primeiro caractere da esquerda pode ser, opcionalmente, um sinal de mais ou de menos. O validador vai receber diversas strings e verificar se a string bate com o padrão definido, para então retornar se a string recebida é válida ou não.

Olhando para as tarefas que analisamos acima, consegue ver algo que todas as elas fazem em comum? É a comparação, o matching de string. Tanto a ferramenta de busca quanto o validador tentam casar um padrão ou uma simples sequência de caracteres com um trecho ou o conteúdo completo de uma string. Nos exemplos deste post, usamos o português pra descrever o padrão a ser comparado. Nós conseguimos entender a linguagem natural do ser humano, mas as ferramentas que citei e as linguagens de programação não conseguem, por isto veremos, nos próximos posts (isso mesmo, muita hora nessa calma), como descrever os mesmos padrões usando uma sintaxe formal que as ferramentas e as APIs das linguagens de programação entendem, as **expressões regulares**.

