---
pubid: "post-python-virtualenv"
langvisible: false
comments: true
series: "Python"
title: "Criando ambientes virtuais com virtualenv"
description: "Utilizando o virtualenv para criar ambientes virtuais para execução de programas Python."
date: 2022-01-02 20:37:00 -0300
author: Eric Yuzo
categories: [python, virtualenv]
---
Quando desenvolvemos ou executamos programas em Python, podemos enfrentar certos conflitos de versão entre as bibliotecas que usamos em diferentes projetos.

Para evitar esse problema, podemos utilizar soluções para criar ambientes virtuais de execução do Python. O ambiente virtual tem a capacidade de ficar isolado da instalação global e de outros ambientes virtuais, de modo que podemos ter diferentes versões do Python instalados na mesma máquina, assim como diferentes bibliotecas em diferentes versões instaladas em cada ambiente.

Com esta finalidade, apresentaremos neste post o **virtualenv**.

## Instalação e utilização do virtualenv.

A instalação do virtualenv pode ser feita via pip:

```
pip install virtualenv
```

Uma vez que o virtualenv esteja instalado, acesse o diretório onde o ambiente deve ser criado e execute o comando:

```
virtualenv venv
```

Um diretório com o nome do ambiente, `venv` no exemplo acima, será criado no local onde o comando foi executado. Ele vai conter os arquivos de instalação do Python do ambiente virtual. Programas úteis para instalação de pacotes como o pip e o setuptools também vem instalados por padrão.

Para inicializar o ambiente, utilize o comando `source`, conforme exemplo:

```
source venv/bin/activate
```

Com o ambiente ativo, ao rodar o Python, será executada a instalação do ambiente virtual. O mesmo vale para os pacotes instalados, que serão exclusivos desse ambiente.

Para sair do ambiente virtual, execute o comando `deactivate`:

```
deactivate
```

## Mão na massa.

Para exemplificar os passos descritos anteriormente, preparei alguns prints com uma execução real feita em minha máquina.

Primeiro, vou criar um novo virtualenv chamado `meu-ambiente`:

![imagem mostrando a criação de um virtualenv]({{ "/img/posts/2022-01-02-create-virtualenv.png" | prepend: site.baseurl }})

Em seguida, vou ativar o ambiente:

![imagem mostrando a ativação do virtualenv]({{ "/img/posts/2022-01-02-source-virtualenv.png" | prepend: site.baseurl }})

Vejam como, após executar o comando `source meu-ambiente/bin/activate`, o meu shell foi alterado, exibindo o ambiente que está ativo no momento.

Com o ambiente ativo, iniciamos a instalação dos pacotes que queremos utilizar. Eu vou instalar o scrapy:

![imagem mostrando a instalação do scrapy no virtualenv]({{ "/img/posts/2022-01-02-install-scrapy-virtualenv.png" | prepend: site.baseurl }})

Pra economizar o espaço de scroll do post, ocultei o log completo da instalação. O importante dessa imagem é ver que o scrapy está sendo instalado em um ambiente virtual ativo.

Feita a instalação, podemos testar rodando um comando qualquer e ver se o scrapy está respondendo de acordo. Eu usarei o `scrapy version`:

![imagem mostrando o teste da instalação do scrapy no virtualenv]({{ "/img/posts/2022-01-02-scrapy-version-virtualenv.png" | prepend: site.baseurl }})

A partir daí, a ideia é seguir trabalhando no projeto e boa.

Por fim, quando eu não quiser mais manter o ambiente ativo no terminal, rodo o comando `deactivate`.

![imagem mostrando a desativação do virtualenv]({{ "/img/posts/2022-01-02-deactivate-virtualenv.png" | prepend: site.baseurl }})

Assim como na ativação, ao desativar um ambiente virtual, o shell volta ao padrão, deixando de indicar a presença do ambiente virtual.

Uma vez fora do ambiente virtual, se rodarmos o mesmo comando `scrapy version`, a execução será feita no ambiente do usuário, que pode ter ou não o pacote disponível. Eu mesmo não tenho, então tomo um erro na lata:

![imagem mostrando o teste da instalação do scrapy com o virtualenv desativado]({{ "/img/posts/2022-01-02-scrapy-version-out-of-virtualenv.png" | prepend: site.baseurl }})

## Conclusão.

É isso pessoal, apesar desse conteúdo ser o básico sobre o virtualenv, saber disso já quebra um bom galho no desenvolvimento em Python.
