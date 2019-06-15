---
pubid: "post-minigl-5"
comments: true
langvisible: true
title: "Parte 5 - mapas e câmeras"
description: "Explorando as funcionalidades de controle de câmera/viewport e a criação de mapas e grids."
series: "Desenvolvendo games com Ruby e MiniGL"
date: 2019-06-14 23:00:00 -0300
author: Victor David Santos
categories: [ruby, minigl]
---
Olá e bem-vindo(a)! Vamos continuar nossa jornada de exploração da biblioteca MiniGL. Hoje nosso foco vai ser o controle de câmera (ou _viewport_) e a criação de mapas com grids.

É bastante comum que o "cenário" ou o "mundo" onde se passam as ações do jogador não caiba inteiro na tela do jogo, de modo que o jogador vai visualizando novas partes do cenário conforme se movimenta, por exemplo. A parte do cenário visível na tela é o que pode ser chamado de _viewport_. O componente que controla o _viewport_ geralmente é denominado de câmera.

A MiniGL fornece a classe `Map`, que visa representar o "mapa" (ou seja, o espaço do cenário) e que encapsula o controle de câmera. Além disso, esta classe oferece facilidades para a criação de cenários baseados em grids ou tiles - bastante comum nos jogos antigos de plataforma ou jogos com visão "top-down", por exemplo. Vamos nos utilizar desta classe para expandir nosso jogo de "labirinto" criando um labirinto de verdade desta vez!

Para esse propósito vamos ter que redefinir bastantes coisas no arquivo "game.rb". A começar pelo construtor:

```ruby
...
class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'Meu Primeiro Jogo'
    @sprite = GameObject.new(10, 10, 80, 80, :face, Vector.new(-10, -10), 2, 3)
    @blinking = false
    @walls = []
    @goal = GameObject.new(640, 480, 50, 50, :goal, Vector.new(-17, -17))
    
    @map = Map.new(100, 100, 20, 20)
    
    @finished = false
    font = Res.font :fonte, 48
    @text_helper = TextHelper.new(font)
    font2 = Res.font :fonte, 20
    @button = Button.new(325, 330, font2, 'Jogar de novo', :button) do
      @finished = false
      @sprite.x = @sprite.y = 10
    end
  end
end
...
```

As primeiras alterações foram:
* Modificamos o tamanho físico do objeto `@sprite` (que representa a "carinha") e utilizamos _image gap_ diferente de 0 para melhorar o movimento no labirinto.
* Declaramos o objeto `@walls` agora como uma lista vazia, pois, com o uso de mapa com grid, vamos inicializar as paredes de outra forma, menos "manual" (continue lendo para descobrir como!).
* Inicializamos um mapa, `@map`, onde os dois primeiros parâmetros (100 e 100) são a largura e a altura de cada "célula" (ou _tile_) da grid, e os dois seguintes são a contagem de colunas e de linhas da grid.

O construtor de `Map` aceita mais alguns parâmetros, que não vamos usar hoje, mas que é interessante mencionar:
* O quinto e sexto parâmetros permitem especificar o tamanho da tela caso seja diferente do padrão (800 por 600).
* O sétimo parâmetro é um booleano indicando se o mapa deve ser isométrico (falso por padrão). Num mapa isométrico, os eixos da grid não são paralelos aos eixos da tela. Para ter uma melhor noção do que se trata, você pode executar um dos jogos de teste que vêm com a MiniGL. Encontre o caminho no qual ela foi instalada (no Windows, deve ser algo como `C:\Ruby<versão>\lib\ruby\gems\<versão>\gems\minigl-<versão>`; no Linux com RVM, `/home/<seu usuário>/.rvm/gems/ruby<versão>/gems/minigl-<versão>`), navegue até esta pasta no terminal/prompt de comando e execute `ruby test/iso_game.rb` (movimente o mouse e use as setas do teclado).

![mapa isométrico]({{ "/img/posts/2019-06-14-iso.png" | prepend: site.baseurl }})

* Por fim, o oitavo parâmetro é também um booleano que indica se a câmera deve respeitar os limites do mapa, ou seja, nunca pode ser posicionada fora do mapa, de modo que o _viewport_ sempre estará mostrando alguma parte do mapa. Este é verdadeiro por padrão, e provavelmente será mantido assim em 99% dos casos.

Ok, criamos o mapa mas ainda não estamos utilizando-o. Para que ele seja realmente útil, temos que definir o posicionamento de todos os objetos em termos da grid que ele define. Em vez de definir posições x e y manualmente para cada objeto, vamos usar os índices de coluna e linha da grid e o tamanho das células para posicionar as paredes, o personagem e o ponto de chegada. Uma das vantagens dessa estratégia é a facilidade de representar o mapa visualmente através de um arquivo de texto:

```
####################
#@      #   #   #  #
# # ### # # ### ## #
# #   # # #   #    #
# ##### # # #### # #
#  #    # #      # #
## # #### # #### # #
## # #    #    # # #
## #   ####### # # #
## # # #     # # # #
#  # #   # #   #   #
# ######## ####### #
#    #     #   #   #
#### # ##### # #####
#    #    #  # # # #
# # ##### # ## # # #
# #     # # #      #
# ##### # # ###### #
#     # #        #!#
####################
```

No esquema acima, se considerarmos cada `#` como uma parede, `@` como o jogador e `!` como a saída, pode-se enxergar facilmente os caminhos do labirinto. Salvando isto num arquivo e lendo-o ao carregar o jogo, conseguimos definir as posições dos objetos sem especificar as coordenadas um a um. Façamos isso então. Vamos salvar o texto acima como o arquivo "level.txt" na mesma pasta do "game.rb", e carregar nosso mapa a partir dele:

```ruby
...
  def initialize
    ...
    @map = Map.new(100, 100, 20, 20)
    File.open('level.txt') do |f|
      f.each_line.with_index do |line, j|
        line.each_char.with_index do |char, i|
          case char
          when '#' then @walls << Block.new(i * 100, j * 100, 100, 100)
          when '@' then @start_x = @sprite.x = i * 100 + 10; @start_y = @sprite.y = j * 100 + 10
          when '!' then @goal.x = i * 100 + 25; @goal.y = j * 100 + 25
          end
        end
      end
    end
  end
...
```

O método `File.open` abre o arquivo para leitura e o bloco recebe como parâmetro um objeto representando o mesmo (`f`). O método `each_line` do arquivo fornece um enumerador das linhas, no qual podemos chamar `with_index` para executar um bloco de código para cada linha, recebendo tanto a linha quanto o índice dela como parâmetros. Seguimos a mesma lógica ao usar o `each_char` seguido de `with_index` na linha, percorrendo então cada caractere, também com seu índice. `i` será o índice coluna e `j` o índice da linha, de modo que usaremos estes para calcular as posições x e y dos objetos, respectivamente. Testamos o caractere encontrado com `case char` e, se for encontrado um `#`, adicionamos uma parede à lista de paredes; se for encontrado um `@`, alteramos a posição de `@sprite` para a linha e coluna correspondentes (somamos 10 a cada coordenada para centralizar o objeto na célula, já que ele tem 80 por 80 de tamanho físico); se for encontrado um `!`, alteramos a posição do `@goal`, seguindo a mesma lógica. Também guardamos a posição inicial do personagem nas variáveis `@start_x` e `@start_y` para poder ajustar a ação do botão de reiniciar:

```ruby
...
@button = Button.new(325, 330, font2, 'Jogar de novo', :button) do
  @finished = false
  @sprite.x = @start_x
  @sprite.y = @start_y
end
...
```

Se você executar o jogo agora, já verá o canto superior esquerdo desse novo labirinto corretamente representado, porém se tentar movimentar o personagem até o final, não conseguirá, pois o resto do labirinto e o próprio ponto de chegada estão fora do _viewport_. É agora que o mapa entrará em ação: vamos atualizar a câmera usando o jogador como referência, e usar a câmera como referência para desenhar os objetos.

```ruby
...
  def update
    ...
    @map.set_camera(@sprite.x - 360, @sprite.y - 260)
  end
  
  def draw
    ...
    @goal.draw(@map)
    @sprite.draw(@map)
    @walls.each do |w|
      draw_quad(w.x - @map.cam.x, w.y - @map.cam.y, 0xff000000,
                w.x + w.w - @map.cam.x, w.y - @map.cam.y, 0xff000000,
                w.x - @map.cam.x, w.y + w.h - @map.cam.y, 0xff000000,
                w.x + w.w - @map.cam.x, w.y + w.h - @map.cam.y, 0xff000000, 0)
    end
    ...
  end
...
```

Pronto! Em `update`, atualizamos a câmera para centralizá-la na posição do personagem (para isso, substraímos da posição dele metade do tamanho da tela menos metade do seu tamanho) com o método `set_camera`. Em `draw`, simplesmente passamos o mapa como parâmetro para o método `draw` dos GameObjects; para as paredes, como não são GameObjects, temos que "manualmente" indicar a utilização da câmera, mas isso também é relativamente simples - basta subtrair `@map.cam.x` de cada coordenada x e `@map.cam.y` de cada coordenada y do quadrado que está sendo desenhado para representar a parede.

Experimente rodar o jogo agora e tentar chegar ao final. Agora é um desafio de verdade, não? Você pode alterar à vontade o "desenho" do labirinto no arquivo "level.txt" e rodar novamente o jogo sem alterar nada no código para testar outros labirintos também. :)

![percorrendo o labirinto]({{ "/img/posts/2019-06-14-gif.gif" | prepend: site.baseurl }})

Há apenas mais um detalhe que não levamos em conta, pois neste exemplo nem é perceptível. Apesar de estarmos vendo na tela sempre só uma pequena parte do "mundo", este pode ser muito maior e, da maneira como programamos, o jogo tentará desenhar e checar colisão do jogador com todos os objetos, o tempo todo. Num cenário muito grande, com muitos objetos, isso pode gerar grande perda de performance. Para evitar isso, vamos usar a ideia de grid também para determinar quais paredes serão levadas em conta para a checagem de colisão e quais serão desenhadas. Primeiramente, ao carregar o mapa, vamos popular uma matriz de paredes, indexada por colunas e linhas do mapa:

```ruby
...
  def initialize
    ...
    @map = Map.new(100, 100, 20, 20)
    @walls_matrix = Array.new(20) { Array.new(20) { nil } }
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
  end
...
```

A linha `@walls_matrix = Array.new(20) { Array.new(20) { nil } }` está criando um vetor de 20 posições preenchidas inicialmente com vetores de 20 posições, preenchidos inicialmente com `nil` - está aí nossa matriz 20 por 20. Agora, dentro do `case char` correspondente a `#`, estamos criando o bloco, atribuindo-o ao elemento da matriz `@walls_matrix[i][j]` e então adicionando-o à lista.

Agora, vamos ajustar a checagem de colisão:

```ruby
...
  def update
    ...
    
    if @finished
      @button.update
    else
      v = Vector.new(0, 0)
      v.x += 3 if KB.key_down?(Gosu::KB_RIGHT)
      v.x -= 3 if KB.key_down?(Gosu::KB_LEFT)
      v.y += 3 if KB.key_down?(Gosu::KB_DOWN)
      v.y -= 3 if KB.key_down?(Gosu::KB_UP)
      
      coll_walls = []
      c_i = @sprite.x.to_i / 100
      c_j = @sprite.y.to_i / 100
      ((c_i-1)..(c_i+1)).each do |i|
        ((c_j-1)..(c_j+1)).each do |j|
          coll_walls << @walls_matrix[i][j] if i >= 0 && j >= 0 && @walls_matrix[i] && @walls_matrix[i][j]
        end
      end
      
      @sprite.move(v, coll_walls, [], true)
    end
  end
...
```

Estamos construindo uma nova lista de objetos para checagem de colisão (`coll_walls`) em vez de usar a lista inteira (`@walls`). Para isso, primeiro obtemos a posição do personagem na grid, dividindo suas coordenadas pelo tamanho das células (`c_i = @sprite.x.to_i / 100` e `c_j = @sprite.y.to_i / 100`), e em seguida percorremos o intervalo de células que compreende 2 colunas à esquerda e 2 colunas à direita (`(c_i-2)..(c_i+2)`) e 2 linhas acima e 2 abaixo (`(c_j-2)..(c_j+2)`). Para cada célula nesta área, adicionamos a parede encontrada à lista `coll_walls` caso haja uma. As checagens `if i >= 0 && j >= 0 && @walls_matrix[i] && ...` serve para nos proteger de cenários de borda, em que as variáveis `i` e `j` podem assumir valores negativos ou acima do tamanho do vetor, o que geraria uma exceção ao tentarmos acessar `@walls_matrix[i][j]`.

Por fim, vamos ajustar a lógica de desenho das paredes:

```ruby
...
  def draw
    ...
    @goal.draw(@map)
    @sprite.draw(@map)
    @map.foreach do |i, j, x, y|
      draw_quad(x, y, 0xff000000,
                x + 100, y, 0xff000000,
                x, y + 100, 0xff000000,
                x + 100, y + 100, 0xff000000, 0) if @walls_matrix[i][j]
    end
  end
...
```

Não estamos mais percorrendo a lista completa de paredes para desenhar. Em vez disso, usamos o método `foreach` do mapa, que permite executar um bloco de código para cada célula da grid **que está atualmente visível na tela**. O bloco recebe os índices de coluna e linha (i e j) e as coordenadas x e y da tela correspondentes à célula. Assim, caso haja uma parede na posição `[i][j]` da matriz, usamos o x e y fornecidos como referência para as coordenadas dos vértices do quadrado, e não precisamos mais subtrair as coordenadas da câmera manualmente. 

Você pode executar novamente o jogo e não verá nenhuma alteração. Porém, se você tentar criar um mapa com muitas paredes e rodar com o código anterior, e depois com esse, certamente perceberá diferença no _framerate_ do jogo.

Segue o código completo de hoje:

```ruby
require 'minigl'
include MiniGL

class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'Meu Primeiro Jogo'
    @sprite = GameObject.new(10, 10, 80, 80, :face, Vector.new(-10, -10), 2, 3)
    @blinking = false
    @walls = []
    @goal = GameObject.new(640, 480, 50, 50, :goal, Vector.new(-17, -17))
    @map = Map.new(100, 100, 20, 20)
    @walls_matrix = Array.new(20) { Array.new(20) { nil } }
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
      v.x += 3 if KB.key_down?(Gosu::KB_RIGHT)
      v.x -= 3 if KB.key_down?(Gosu::KB_LEFT)
      v.y += 3 if KB.key_down?(Gosu::KB_DOWN)
      v.y -= 3 if KB.key_down?(Gosu::KB_UP)
      
      coll_walls = []
      c_i = @sprite.x.to_i / 100
      c_j = @sprite.y.to_i / 100
      ((c_i-2)..(c_i+2)).each do |i|
        ((c_j-2)..(c_j+2)).each do |j|
          coll_walls << @walls_matrix[i][j] if i >= 0 && j >= 0 && @walls_matrix[i] && @walls_matrix[i][j]
        end
      end
      
      @sprite.move(v, coll_walls, [], true)
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

Por hoje é isso colegas. Até mais!

---

<span class="previous-post">[Parte 4 <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({% link _posts/2019-06-07-desenvolvendo-games-com-ruby-e-minigl-parte-4.md %})</span>
