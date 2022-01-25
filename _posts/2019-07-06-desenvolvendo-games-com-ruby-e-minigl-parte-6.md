---
pubid: "post-minigl-6"
comments: true
langvisible: true
title: "Parte 6 - movimento baseado em física"
description: "Transformando nosso jogo de labirinto num jogo de plataforma!"
series: "Desenvolvendo games com Ruby e MiniGL"
date: 2019-07-06 17:00:00 -0300
author: Victor David Santos
categories: [ruby, minigl]
---
Olá meus caros! Peço desculpas pelo "hiato", eu tive umas semanas muito corridas nestes últimos tempos - mudei de trabalho, agora estou trabalhando numa empresa de desenvolvimento de games! -, mas estamos de volta!

No post de hoje vamos voltar a falar de movimentação, mas agora explorando o outro tipo de movimento disponibilizado na classe `GameObject`, conforme prometido na [parte 3]({% link _posts/2019-06-03-desenvolvendo-games-com-ruby-e-minigl-parte-3.md %}): movimento baseado em forças e leis da física!

Basicamente, a ideia é que, em vez de passar uma velocidade fixa para o objeto se mover, vamos passar um vetor das forças atuantes neste objeto, e a biblioteca calculará a velocidade resultante. O resultado disso serão movimentos mais "suaves", dando a sensação de aceleração e desaceleração. Além disso, o objeto passará a estar sujeito à força da gravidade, caindo quando não houver algo sólido abaixo.

Tomemos o arquivo "game.rb" como foi deixado ao final do [último post]({% link _posts/2019-06-14-desenvolvendo-games-com-ruby-e-minigl-parte-5.md %}), e vamos às primeiras alterações:

```ruby
...
class MyGame < GameWindow
  def initialize
    ...
    @sprite = GameObject.new(10, 10, 80, 90, :face, Vector.new(-10, -10), 2, 3)
    @sprite.max_speed.x = 15
    @sprite.max_speed.y = 50
    ...
  end
  
  ...
end
...
```

Fizemos uma pequena modificação no tamanho físico da carinha, agora com 90 de altura, para que ela toque o chão de maneira precisa. Além disso, estamos definindo as velocidades máximas em cada direção (alterando as coordenadas `x` e `y` do vetor `max_speed`). Estes números (e outros que veremos mais à frente) são resultado de testes para calibração do movimento, é necessário ir testando diversos valores para encontrar um que resulte num movimento balanceado e suave.

O tipo de movimentação que queremos fazer não se encaixa bem num jogo de labirinto, mas sim num jogo de plataforma, por exemplo. Assim, vamos alterar o mapa para que nos permita explorar melhor esses movimentos:

```
############################################
#                                #         #
#         ###                    #        !#
#               ##               #    ######
######                           #         #
#                   #            #####     #
#                   #                      #
#             ###   #   #########        ###
# @     ###         #       #              #
############################################
```

Salve o conteúdo acima no arquivo "level.txt" (sobrescrevendo o do último post). Agora, vamos também ajustar a maneira como o mapa é carregado:

```ruby
...
class MyGame < GameWindow
  TILES_X = 45
  TILES_Y = 10
  
  def initialize
    ...
    @map = Map.new(100, 100, TILES_X, TILES_Y)
    @walls_matrix = Array.new(TILES_X) { Array.new(TILES_Y) { nil } }
    ...
  end
  
  ...
end
...
```

Note que definimos as constantes `TILES_X` e `TILES_Y` para a quantidade de _tiles_ (ou células da grid) na horizontal e na vertical, respectivamente, pois estes valores são usados mais de uma vez. Então redefinimos a contagem de _tiles_ do mapa e também a quantidade de colunas e linhas da matriz de paredes (`@walls_matrix`).

Agora, vamos para o que realmente importa para o objetivo de hoje: a lógica de movimentação. Localize no "game.rb", dentro do método `update`, o bloco abaixo:

```ruby
v = Vector.new(0, 0)
v.x += 3 if KB.key_down?(Gosu::KB_RIGHT)
v.x -= 3 if KB.key_down?(Gosu::KB_LEFT)
v.y += 3 if KB.key_down?(Gosu::KB_DOWN)
v.y -= 3 if KB.key_down?(Gosu::KB_UP)
```

E substitua-o por isto:

```ruby
v = Vector.new(0, 0)
v.x += 1.5 if KB.key_down?(Gosu::KB_RIGHT)
v.x -= 1.5 if KB.key_down?(Gosu::KB_LEFT)
if @sprite.bottom
  v.y -= 15 + 0.7 * @sprite.speed.x.abs if KB.key_down?(Gosu::KB_UP)
  v.x -= 0.15 * @sprite.speed.x
end
```

Analisemos ponto a ponto as alterações:
* Para o movimento na horizontal (segunda e terceira linhas), nós apenas ajustamos o valor de 3 para 1.5. Este valor representará agora a força aplicada na horizontal, ou seja, uma aceleração. Se o valor for muito alto, o objeto chegará em velocidades absurdamente altas em pouco tempo (a aceleração é aplicada a cada _frame_, ou seja, aproximadamente 60 vezes por segundo).
* Para a vertical, as mudanças são maiores. Primeiramente, não mais aumentamos a coordenada y do vetor ao pressionar a seta para baixo, pois o movimento para baixo ficará por conta da gravidade. Segundo, apenas aplicamos força na vertical (para cima) quando o objeto está sobre o chão (indicado pelo teste `@sprite.bottom`, onde `bottom` retorna o objeto que está colidindo com `@sprite` por baixo, se houver algum). O cálculo da força para cima é dado por `15 + 0.7 * @sprite.speed.x.abs`, ou seja, uma constante (15) somada com um valor variável atrelado à velocidade horizontal do objeto (`@sprite.speed.x`). O efeito disto é que a carinha poderá pular mais alto quando estiver se movendo mais rápido.
* Por fim, também apenas na condição de o objeto estar sobre o chão (`if @sprite.bottom`), aplicamos uma força horizontal contrária à velocidade atual (`v.x -= 0.15 * @sprite.speed.x`), para imitar o efeito de atrito. Isso permitirá que o objeto pare alguns momentos depois de soltarmos a tecla de movimento.

Agora, só resta remover o último argumento da chamada ao método `move` do objeto (ao não passar o argumento, ele assume o valor padrão `false`, indicando que o vetor que está sendo passado é um vetor de forças, e não de velocidades):

```ruby
...
    def update
      ...
      @sprite.move(v, coll_walls, [])
    end
...
```

E é apenas isso! Experimente rodar o jogo agora e veja se você consegue chegar até o final. :)

![movimento baseado em forças]({{ "/img/posts/2019-07-06-gif.gif" | prepend: site.baseurl }})

E abaixo o "game.rb" completo de hoje:

```ruby
require 'minigl'
include MiniGL

class MyGame < GameWindow
  TILES_X = 45
  TILES_Y = 10

  def initialize
    super 800, 600, false
    self.caption = 'Meu Primeiro Jogo'
    @sprite = GameObject.new(10, 10, 80, 90, :face, Vector.new(-10, -10), 2, 3)
    @sprite.max_speed.x = 15
    @sprite.max_speed.y = 50
    @blinking = false
    @walls = []
    @goal = GameObject.new(640, 480, 50, 50, :goal, Vector.new(-17, -17))
    @map = Map.new(100, 100, TILES_X, TILES_Y)
    @walls_matrix = Array.new(TILES_X) { Array.new(TILES_Y) { nil } }
    File.open('level.txt') do |f|
      f.each_line.with_index do |line, j|
        line.each_char.with_index do |char, i|
          case char
          when '#' then @walls << (@walls_matrix[i][j] = Block.new(i * 100, j * 100, 100, 100))
          when '@' then @start_x = @sprite.x = i * 100 + 10; @start_y = @sprite.y = j * 100 + 10
          when '!' then @goal.x = i * 100 + 25; @goal.y = j * 100 + 25
          end
        end
      end
    end
    
    @finished = false
    font = Res.font :fonte, 48
    @text_helper = TextHelper.new(font)
    font2 = Res.font :fonte, 20
    @button = Button.new(325, 330, font2, 'Jogar de novo', :button) do
      @finished = false
      @sprite.speed.x = @sprite.speed.y = 0
      @sprite.x = @start_x
      @sprite.y = @start_y
    end
  end
  
  def needs_cursor?
    @finished
  end
  
  def update
    KB.update
    Mouse.update
    
    if @finished
      @button.update
    else
      v = Vector.new(0, 0)
      v.x += 1.5 if KB.key_down?(Gosu::KB_RIGHT)
      v.x -= 1.5 if KB.key_down?(Gosu::KB_LEFT)
      if @sprite.bottom
        v.y -= 15 + 0.7 * @sprite.speed.x.abs if KB.key_down?(Gosu::KB_UP)
        v.x -= 0.15 * @sprite.speed.x
      end
      
      coll_walls = []
      c_i = @sprite.x.to_i / 100
      c_j = @sprite.y.to_i / 100
      ((c_i-2)..(c_i+2)).each do |i|
        ((c_j-2)..(c_j+2)).each do |j|
          coll_walls << @walls_matrix[i][j] if i >= 0 && j >= 0 && @walls_matrix[i] && @walls_matrix[i][j]
        end
      end
      
      @sprite.move(v, coll_walls, [])
    end
    
    if @blinking
      @sprite.animate_once([4, 5, 4], 7) do
        @blinking = false
        @sprite.set_animation 0
      end
    else
      @sprite.animate([0, 1, 2, 3], 5)
      if KB.key_pressed?(Gosu::KB_SPACE)
        @blinking = true
        @sprite.set_animation 4
      end
    end
    
    if @sprite.bounds.intersect?(@goal.bounds)
      @finished = true
    end
    
    @map.set_camera(@sprite.x - 360, @sprite.y - 260)
  end
  
  def draw
    clear 0xffabcdef
    @goal.draw(@map)
    @sprite.draw(@map)
    @map.foreach do |i, j, x, y|
      draw_quad(x, y, 0xff000000,
                x + 100, y, 0xff000000,
                x, y + 100, 0xff000000,
                x + 100, y + 100, 0xff000000, 0) if @walls_matrix[i][j]
    end
    if @finished
      @text_helper.write_line 'Você venceu!', 400, 276, :center, 0xffff00, 255, :border, 0x000000, 2
      @button.draw
    end
  end
end

MyGame.new.show
```

Por hoje é só, colegas, até a próxima (que espero que não demore tanto)!

---

<span class="previous-post">[Parte 5 <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({% link _posts/2019-06-14-desenvolvendo-games-com-ruby-e-minigl-parte-5.md %})</span>
<span class="next-post">[<img class="icon32" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> Parte 7]({% link _posts/2022-01-25-desenvolvendo-games-com-ruby-e-minigl-parte-7.md %})</span>
