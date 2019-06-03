---
pubid: "post-minigl-2"
comments: true
langvisible: true
title: "Parte 2 - funcionalidades básicas"
description: "Neste post vamos explorar os recursos básicos da MiniGL, como desenhar imagens e ler comandos do usuário."
series: "Desenvolvendo games com Ruby e MiniGL"
date: 2019-05-28 10:00:00 -0300
author: Victor David Santos
categories: [ruby, minigl]
---
Olá, meus caros. Prontos para começar a desenvolver seus próprios jogos? Então vamos em frente!

Hoje vamos explorar as funcionalidades básicas da biblioteca MiniGL, que já nos permitirão criar um "protótipo" de jogo.

## Gerenciamento de recursos

A biblioteca MiniGL utiliza um padrão chamado "convention over configuration" (convenção sobre configuração) para o carregamento de recursos - isto é, imagens, fontes, sons, etc. - do jogo. Isso significa que, se você seguir as convenções da biblioteca, terá que fazer pouca ou nenhuma configuração para carregar de maneira muito prática os recursos que deseja usar.

Vamos ilustrar isso melhor com um exemplo. A coisa provavelmente mais fundamental em qualquer jogo é desenhar imagens na tela. A MiniGL possui uma convenção de diretórios onde procura imagens (assim como os outros tipos de recursos) para o carregamento, de modo que, se você colocar as imagens neste diretório, apenas o nome das mesmas será necessário para carregá-las. Mais ainda, se o tipo de arquivo for o padrão (no caso PNG), nem mesmo informar a extensão do arquivo será necessário. Suponhamos que você tenha a seguinte estrutura no diretório do seu projeto "Meu Primeiro Jogo":

```
Meu Primeiro Jogo
|- game.rb
|- data
   |- img
      |- face.png
```

Consideremos que o arquivo "game.rb" é o mesmo que criamos no [post anterior]({% link _posts/2019-05-27-desenvolvendo-games-com-ruby-e-minigl-parte-1.md %}). O arquivo "face.png" é uma imagem qualquer, como esta abaixo, por exemplo:

![face.png]({{ "/img/posts/2019-05-28-face.png" | prepend: site.baseurl }})

Criada esta estrutura, vamos editar o arquivo "game.rb" para exibir a imagem.

```ruby
require 'minigl'
include MiniGL

class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'Meu Primeiro Jogo'
    @img = Res.img :face
  end
  
  def draw
    @img.draw 0, 0, 0
  end
end

MyGame.new.show
```

Foram acrescentados apenas dois trechos.

* A linha `@img = Res.img :face` está criando uma variável de instância (indicada pelo `@` no início) e atribuindo a ela o resultado da chamada `Res.img :face`. `Res` é a classe responsável por gerenciamento de recursos da MiniGL. O método "img" carrega uma imagem da pasta padrão, e recebe como parâmetro apenas o nome do arquivo, neste caso sem extensão pois o arquivo é do tipo padrão (PNG). O nome pode ser passado como string ou símbolo (um tipo especial de string específico da linguagem Ruby, caracterizado pelo `:` no início).
* O bloco iniciado com `def draw` é a declaração de um método de nome "draw". Este método será automaticamente chamado a cada frame do jogo para definir o que será "desenhado" na janela. A linha `@img.draw 0, 0, 0` está chamando o método draw da imagem carregada no construtor (variável `@img`). Os parâmetros são as coordenadas x (horizontal), y (vertical) e z ("profundidade", sendo que imagens com z maior são desenhadas "por cima" de imagens com z menor).

Se você abrir o terminal/prompt de comando e executar `ruby game.rb` (estando na pasta do projeto) agora, deverá ver a janela preta do primeiro post, mas com a imagem "face.png" desenhada no canto superior esquerdo.

![desenhando uma imagem]({{ "/img/posts/2019-05-28-screenshot1.png" | prepend: site.baseurl }})

Note que a chamada `Res.img :face` ficou bastante resumida, graças ao fato de termos seguido as convenções. Mais especificamente, a imagem estar dentro da pasta "data/img" em relação ao código, e ser do tipo PNG. Convenções semelhantes existem para os outros recursos:

* Para fontes, o diretório padrão é "data/font", e a extensão padrão é ".ttf".
* Para sons (efeitos sonoros), o diretório padrão é "data/sound" e a extensão padrão é ".wav".
* Para músicas, o diretório padrão é "data/song" e a extensão padrão é ".ogg".
* Para tilesets (que são um tipo específico de imagem, que vamos explorar em posts futuros), o diretório padrão é "data/tileset" e a extensão padrão é ".png", assim como para as demais imagens.

Assim, para carregar um som, por exemplo, você utilizaria a chamada `Res.sound :som1`, considerando que houvesse um arquivo "som1.wav" dentro da pasta "data/sound" do seu projeto, e assim por diante. Vamos falar mais sobre os outros tipos de recurso em outros posts.

## Mais funções e opções de desenho

Que tal mudarmos o fundo da janela para um tom mais agradável? Basta adicionar uma linha dentro do método `draw`:

```ruby
...
  def draw
    clear 0xffabcdef
    @img.draw 0, 0, 0
  end
...
```

O método `clear` (que pertence à própria classe `GameWindow`) preenche a janela com uma cor especificada pelo código hexadecimal no formato `0xAARRGGBB`, onde "A" é a opacidade, "R" é a componente vermelha, "G" a componente verde e "B" a azul (se você já trabalhou com CSS ou mesmo alguns editores de imagens, deve conhecer essa notação). O componente "A" neste caso será ignorado por se tratar do fundo da janela, mas será importante mais para frente para alterar a opacidade de imagens.

Rode novamente o jogo agora, e verá que o fundo da janela estará preenchido com um azul claro.

Podemos também personalizar de várias formas a maneira como a imagem será desenhada. Primeiro, é claro, podemos alterar a posição dela na tela alterando os valores dos dois primeiros argumentos à chamada do método "draw". Este método, no entanto, aceita mais alguns parâmetros (opcionais). São eles (a partir do quarto):

* `scale_x`: escala horizontal da imagem - o valor padrão é 1, ou seja, a imagem é desenhada com seu tamanho horizontal original. Um valor de 2 indica que a imagem deve ser desenhada com o dobro do tamanho horizontal. É possível fornecer valores não inteiros também, como 1.5. Escalas negativas farão com que a imagem seja invertida.
* `scale_y`: escala vertical da imagem - mesmo conceito acima, mas para a vertical.
* `color`: cor para aplicar como "filtro" à imagem, especificada no mesmo formato que no método `clear` da janela. O filtro padrão é branco, 100% opaco (0xffffffff), que desenha a imagem com suas cores originais. Se você especificar um valor menor que `ff` para os dois primeiros dígitos (componente "A"), a imagem será desenhada semitransparente. Se você fornecer valores diferentes para as componentes "R", "G" ou "B", estes valores serão multiplicados pelo valor original de cada pixel da imagem, alterando as cores. Por exemplo, se você fornecer o valor "0x80ff0000" para este filtro, a imagem será desenhada com cerca de 50% de opacidade e todas suas cores tenderão para o vermelho (pois a componente "R" permanece inalterada, mas as componentes "G" e "B" foram zeradas).

Vamos experimentar essas opções com a nossa imagem! Altere a linha `@img.draw 0, 0, 0` para:

```ruby
@img.draw 100, 250, 0, 1.5, -2, 0x80ff0000
```

e veja o que acontece:

![opções de desenho]({{ "/img/posts/2019-05-28-screenshot2.png" | prepend: site.baseurl }})

Finalmente, é possível ainda rotacionar a imagem! Porém, para isto, usamos um outro método de desenho, `draw_rot`, o qual recebe praticamente os mesmos parâmetros que `draw`, porém com alguns adicionais para especificar a rotação. Mais especificamente, após o parâmetro "z" (terceiro), são aceitos os seguintes:

* `angle`: o ângulo de rotação, em graus, e em sentido horário, sendo que zero corresponde às 12h do relógio.
* `center_x`: a posição relativa (horizontal) do centro de rotação em relação ao centro da imagem. O valor padrão é 0.5, isto é, a coordenada horizontal do centro de rotação estará no ponto médio. Um valor de 0 indicaria o canto esquerdo e 1 o canto direito.
* `center_y`: mesmo conceito de `center_x`, mas para a coordenada vertical.

Após estes parâmetros, o método também aceita os parâmetros `scale_x`, `scale_y` e `color`, na mesma ordem. Vamos experimentar:

```ruby
@img.draw_rot 100, 250, 0, 45, 0.5, 0.5, 1.5, -2, 0x80ff0000
```

O resultado:

![opções de desenho]({{ "/img/posts/2019-05-28-screenshot3.png" | prepend: site.baseurl }})

Note que, agora, as coordenadas x e y (dois primeiros parâmetros) indicam o centro da imagem, e não o canto superior esquerdo.

## Recebendo comandos do usuário

Ok, sabemos como desenhar imagens na tela, mas não podemos chamar um jogo de jogo se o jogador não puder interagir com ele, certo? Então vejamos como responder a ações do usuário, através do mouse e do teclado. É bastante simples!

Primeiramente, vamos declarar duas variáveis (`@x` e `@y`) que definirão a posição da imagem na tela, para que as ações do usuário possam alterá-las:

```ruby
...
  def initialize
    ...
    @x = @y = 0
  end
...
```

A seguir, vamos declarar um novo método na classe da janela do jogo, chamado "update". Assim como o método "draw" é chamado automaticamente a cada frame para desenhar coisas na tela, o método "update" também é chamado a cada frame, antes do método "draw", para executar qualquer lógica do jogo que não esteja relacionada a desenhar. É neste método que devemos colocar toda a lógica de interação do usuário. Vamos escrever o método "update" conforme abaixo:

```ruby
...
  def update
    Mouse.update
    KB.update
    
    if Mouse.button_down? :left
      @x = Mouse.x
      @y = Mouse.y
    end
    
    @x += 1 if KB.key_down?(Gosu::KB_RIGHT)
    @x -= 1 if KB.key_down?(Gosu::KB_LEFT)
    @y += 1 if KB.key_down?(Gosu::KB_DOWN)
    @y -= 1 if KB.key_down?(Gosu::KB_UP)
  end
...
```

As chamadas `Mouse.update` e `KB.update` são necessárias para que o jogo detecte os eventos de mouse e teclado. Lembre-se sempre de incluí-las logo no início do "update" para que toda a lógica que vier a seguir possa se utilizar dos métodos que checam eventos do mouse e do teclado (claro que se o seu jogo não for usar um dos dois, você pode omitir a chamada correspondente).

A classe `Mouse` disponibiliza os métodos `button_down?`, `button_pressed?` e `button_released?` para detectar quando um botão do mouse está pressionado, quando foi pressionado no frame atual e quando foi solto no frame atual, respectivamente. No código acima, estamos verificando se o botão esquerdo (identificado pelo parâmetro `:left`) está pressionado e, se for o caso, definimos as coordenadas `@x` e `@y` para as posições x e y do cursor do mouse (`Mouse.x` e `Mouse.y`).

A classe `KB`, por outro lado, disponibiliza os métodos `key_down?`, `key_pressed?` e `key_released?` para checar os mesmos eventos citados acima, mas para teclas do teclado. Cada tecla é identificada por uma constante definida no namespace principal da biblioteca Gosu (relembrando o primeiro post, Gosu é a biblioteca sobre a qual a MiniGL é construída), como `Gosu::KB_RIGHT` e `Gosu::KB_LEFT`. Para a listagem completa das constantes, visite [esta página](https://www.rubydoc.info/github/gosu/gosu/master/Gosu). Assim, no código acima, estamos incrementando ou decrementando as coordenadas `@x` e `@y` conforme as teclas direcionais correspondentes são pressionadas.

Como a ideia é o usuário clicar na tela para posicionar a imagem, vamos querer tornar o cursor visível na janela (é ocultado por padrão). Para isso, basta definir o método "needs_cursor?" retornando o valor `true`:

```ruby
...
  def needs_cursor?
    true
  end
...
```

Para fazer a interação funcionar, só falta ajustarmos o método "draw" para que a imagem seja desenhada na posição identificada pelas variáveis (e também vamos aproveitar para voltar os parâmetros de desenho ao normal):

```ruby
...
  def draw
    clear 0xffabcdef
    @img.draw @x, @y, 0
  end
...
```

Execute o jogo agora e você poderá controlar a posição da carinha com o mouse e com as setas do teclado! Divertido, não? Nem tanto, verdade... Mas é apenas o começo. ;)

O código final para o post de hoje é este:

```ruby
require 'minigl'
include MiniGL

class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'Meu Primeiro Jogo'
    @img = Res.img :face
    @x = @y = 0
  end
  
  def update
    Mouse.update
    KB.update
    
    if Mouse.button_down? :left
      @x = Mouse.x
      @y = Mouse.y
    end
    
    @x += 1 if KB.key_down?(Gosu::KB_RIGHT)
    @x -= 1 if KB.key_down?(Gosu::KB_LEFT)
    @y += 1 if KB.key_down?(Gosu::KB_DOWN)
    @y -= 1 if KB.key_down?(Gosu::KB_UP)
  end
  
  def needs_cursor?
    true
  end
  
  def draw
    clear 0xffabcdef
    @img.draw @x, @y, 0
  end
end

MyGame.new.show
```

Obrigado por acompanharem até aqui, e espero vocês no próximo post!

---

<span class="previous-post">[Parte 1 <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({% link _posts/2019-05-27-desenvolvendo-games-com-ruby-e-minigl-parte-1.md %})</span>
<span class="next-post">[<img class="icon32" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> Parte 3]({% link _posts/2019-06-03-desenvolvendo-games-com-ruby-e-minigl-parte-3.md %})</span>
