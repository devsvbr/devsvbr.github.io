---
pubid: "post-minigl-1"
langvisible: true
comments: true
title: "Parte 1 - preparação do ambiente"
description: "Como preparar um ambiente para desenvolvimento de games com a linguagem Ruby e a biblioteca MiniGL."
series: "Desenvolvendo games com Ruby e MiniGL"
date: 2019-05-27 10:00:00 -0300
author: Victor David Santos
categories: [minigl, ruby]
---
Olá, caros leitores. Sejam bem-vindos a essa nova série de posts sobre desenvolvimento de games! Mais especificamente, vamos falar sobre desenvolvimento de games com a linguagem de programação Ruby e a biblioteca MiniGL - criada por mim. :)

Para quem não conhece, Ruby é uma linguagem interpretada, fortemente orientada a objetos, e focada em ter uma sintaxe amigável, de fácil leitura e geralmente oferecendo várias maneiras de fazer uma mesma coisa, dando grande liberdade ao programador. Para saber mais sobre a linguagem e sua filosofia, visite o [site oficial](https://www.ruby-lang.org/pt/).

O objetivo destes posts será mostrar como é possível construir jogos 2D de maneira muito rápida usando Ruby e a biblioteca MiniGL. Para podermos entrar de cabeça no assunto, não vamos ensinar a linguagem Ruby desde o básico, mas vou explicando os conceitos conforme o código for aparecendo. Se você já for programador em qualquer linguagem orientada a objetos, não deve ser difícil de acompanhar. :)

## Preparando o ambiente

Vamos começar pelo começo: como deixar sua máquina pronta para trabalhar com Ruby e MiniGL. Bom, vai depender de qual sistema operacional você usa.

### Linux

Se você usa Linux (e se não usa, recomendo experimentar ;)), o processo consistirá em três passos.

#### 1) Instalando o Ruby

Muitas distribuições Linux já vem com alguma versão de Ruby instalada, porém, a versão instalada no sistema tem a desvantagem de precisar de permissão de super-user para executar comandos como por exemplo instalação de bibliotecas (chamadas de "gems" no ecossistema Ruby). Assim, vamos fazer uma instalação para o usuário local usando o RVM - Ruby Version Manager.

Abra um terminal e execute os comandos a seguir:

```bash
gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash -s stable
```

Após a execução do segundo comando, será gerado um script, cujo caminho será mostrado na saída. O próximo passo é executar este script:

```bash
source <caminho do script gerado>
```

O interpretador Ruby será então compilado de maneira otimizada para sua máquina e sistema operacional. Terminada a execução, o Ruby estará instalado para seu usuário. Porém, se você executar o programa "ruby" no terminal neste momento, ainda será referenciada a versão do sistema. Para alterar isso, você pode alterar as configurações do seu terminal para rodar como um "login shell", ou então executar o comando a seguir antes de começar a usar o Ruby:

```bash
source ~/.bash_profile
```

Feito! Agora, reabra o terminal, caso tenha optado pela alteração da configuração, e execute o comando "irb". Este é um modo rápido de testar a instalação de Ruby, executando comandos da linguagem no próprio terminal. Dentro do irb, execute:

```bash
puts 'Hello, world!'
```

Deverá ser impressa a frase "Hello, world!" no próprio terminal. Se for o caso, a instalação do Ruby está funcionando. Para sair do "irb", use Ctrl+D ou "exit".

#### 2) Instalando as dependências da MiniGL

A biblioteca (ou "gem") MiniGL utiliza uma outra biblioteca como base, chamada Gosu, a qual depende de algumas bibliotecas nativas. Nas distribuições baseadas em Debian (como Ubuntu ou Linux Mint), você pode instalá-las com o seguinte comando:

```bash
sudo apt-get install build-essential libsdl2-dev libsdl2-ttf-dev libpango1.0-dev libgl1-mesa-dev libopenal-dev libsndfile-dev libmpg123-dev libgmp-dev
```

Para demais distribuições, você pode consultar instruções [aqui](https://github.com/gosu/gosu/wiki/Getting-Started-on-Linux).

Instaladas as dependências, execute:

```bash
gem install gosu
```

O comando "gem install" é responsável por instalar bibliotecas Ruby.

#### 3) Instalando a MiniGL

Se a instalação da biblioteca Gosu estiver funcionado, para instalar a MiniGL você só precisará de mais um passo:

```bash
gem install minigl
```

E pronto! Seu ambiente Linux está configurado. :)

### Windows

Agora, se você utiliza Windows, os passos são os seguintes:

#### 1) Instalando o Ruby

Instale o Ruby usando o RubyInstaller. Baixe a versão mais atual [aqui](https://rubyinstaller.org/downloads/) e execute o instalador, que é um clássico wizard do tipo "next, next, finish". Pode manter todas as opções padrão.

Terminada a instalação, abra o prompt de comando, e execute "irb" para validar a instalação.

#### 2) Instalando a MiniGL

Estando tudo ok, no prompt de comando execute:

```bash
gem install minigl
```

Será instalada a biblioteca Gosu (dependência) e em seguida a MiniGL. Terminado este comando, seu ambiente estará configurado.

## Criando um programa MiniGL

Com o seu ambiente preparado, abra seu editor de texto favorito e vamos criar nosso primeiro programa MiniGL!

O primeiro passo é referenciar a biblioteca:

```ruby
require 'minigl'
```

A seguir, referenciamos o namespace principal para poder utilizar as classes oferecidas pela biblioteca apenas pelo nome delas:

```ruby
include MiniGL
```

Então, vamos criar uma classe que vai representar a janela do jogo.

```ruby
class MyGame < GameWindow
  # código aqui...
end
```

Para os não familiarizados com Ruby, o código acima declara uma classe de nome "MyGame" herdando a classe "GameWindow" (definida pela MiniGL).

Vamos definir o construtor desta classe, para inicializar a janela:

```ruby
class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'Meu Primeiro Jogo'
  end
end
```

A palavra-chave "def" é usada para declarar métodos. O método de nome "initialize" é tratado de maneira especial, correspondendo ao construtor da classe.

A chamada "super" é uma chamada ao construtor da superclasse. Os parâmetros passados são a largura da janela, a altura e um booleano indicando se a janela deve ser aberta em full screen. Em Ruby, os parâmetros passados para um método não precisam de parênteses delimitando.

Por fim, "self.caption = 'Meu Primeiro Jogo'" está definindo o texto do título da janela.

Definida a classe e o construtor, vamos abrir a janela:

```ruby
MyGame.new.show
```

Aqui, "MyGame.new" é a maneira de criar uma instância da classe MyGame. Dessa instância, chamamos o método "show", que basicamente vai exibir a janela.

O código final do seu arquivo deve ficar assim:

```ruby
require 'minigl'
include MiniGL

class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'Meu Primeiro Jogo'
  end
end

MyGame.new.show
```

Agora, salve o arquivo como "game.rb", abra o terminal ou prompt de comando, navegue até a pasta onde salvou o arquivo com "cd", e execute:

```bash
ruby game.rb
```

Deverá ser aberta uma janela de 800 por 600 pixels, preenchida de preto. Se isso acontecer, quer dizer que a MiniGL está funcionando e você está pronto para começar a desenvolver games!

Por hoje é isso, não perca o próximo post da série, quando vamos começar a programar, de verdade, um jogo.

Até a próxima!