---
pubid: "post-minigl-4"
comments: true
langvisible: true
title: "Parte 4 - texto e botões"
description: "Incluindo um objetivo e a possibilidade de reiniciar o jogo."
series: "Desenvolvendo games com Ruby e MiniGL"
date: 2019-06-05 10:00:00 -0300
author: Victor David Santos
categories: [ruby, minigl]
---
Olá, colegas desenvolvedores! Sejam bem-vindos à parte 4 do nosso tutorial de desenvolvimento de games com Ruby e MiniGL.

Neste post, vamos continuar o protótipo de jogo de "labirinto" que começamos a criar no post anterior, permitindo que o jogador chegue no final do labirinto, mostrando na tela que ele venceu e oferecendo um botão de "jogar novamente", que vai voltar o jogo ao estado inicial.

Como no último post foram muitas alterações de código e eu não incluí o código final, segue a íntegra do arquivo "game.rb", que será nosso ponto de partida:

```ruby
require 'minigl'
include MiniGL

class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'Meu Primeiro Jogo'
    @sprite = GameObject.new(10, 10, 100, 100, :face, Vector.new(0, 0), 2, 3)
    @blinking = false
    @walls = [
      Block.new(0, 0, 10, 600),
      Block.new(0, 0, 800, 10),
      Block.new(790, 0, 10, 600),
      Block.new(0, 590, 800, 10),
      Block.new(250, 0, 10, 400),
      Block.new(550, 200, 10, 400)
    ]
  end
  
  def update
    KB.update
    
    v = Vector.new(0, 0)
    v.x += 3 if KB.key_down?(Gosu::KB_RIGHT)
    v.x -= 3 if KB.key_down?(Gosu::KB_LEFT)
    v.y += 3 if KB.key_down?(Gosu::KB_DOWN)
    v.y -= 3 if KB.key_down?(Gosu::KB_UP)
    
    @sprite.move(v, @walls, [], true)
    
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
  end
  
  def draw
    clear 0xffabcdef
    @sprite.draw
    @walls.each do |w|
      draw_quad(w.x, w.y, 0xff000000,
                w.x + w.w, w.y, 0xff000000,
                w.x, w.y + w.h, 0xff000000,
                w.x + w.w, w.y + w.h, 0xff000000, 0)
    end
  end
end

MyGame.new.show
```

Segue também a última versão da imagem "face.png" usada (que deve ficar na pasta "data/img" relativa ao arquivo de código):

![face.png]({{ "/img/posts/2019-06-03-face2.png" | prepend: site.baseurl }})

Atualize seus arquivos caso estejam diferentes disto e vamos começar.

## Detectando a vitória

Primeiro, precisamos indicar na tela qual é o ponto final do labirinto. Vamos incluir um novo GameObject no jogo, que representará o final, de modo que possamos checar se o jogador está sobre ele (para isso ele precisa de dimensões físicas, e por isso vamos usar a classe GameObject). Utilizaremos a imagem a seguir (salve como "goal.png" na pasta "data/img"):

![goal.png]({{ "/img/posts/2019-06-07-goal.png" | prepend: site.baseurl }})

Agora, vamos defini-lo no construtor da nossa classe `MyGame` e desenhá-lo na tela:

```ruby
...
  def initialize
    ...
    
    @goal = GameObject.new(640, 480, 50, 50, :goal, Vector.new(-17, -17))
  end
  
  ...
  
  def draw
    clear 0xffabcdef
    @goal.draw
    @sprite.draw
    ...
  end
...
```

A principal novidade aqui é o parâmetro "image gap" inicializado com `Vector.new(-17, -17)`. Note que definimos as dimensões físicas do objeto como 50 por 50 (terceiro e quarto parâmetros). Porém, a imagem utilizada possui 84 por 84 pixels, e a ideia é centralizar a caixa de colisão na imagem. Para isso, temos de desenhar a imagem deslocada 17 pixels para a esquerda (indicado pelo valor -17 na coordenada x do vetor) e 17 pixels para cima (coordenada y do vetor com -17) em relação à caixa de colisão. O objetivo de inicializar desta maneira é que o jogador precise "entrar" um pouco dentro da área do objeto para que consideremos que ele venceu. A imagem abaixo ajuda a explicar a ideia:

![image gap]({{ "/img/posts/2019-06-07-image-gap.png" | prepend: site.baseurl }})

O outro detalhe é que colocamos a instrução `@goal.draw` antes de `@sprite.draw`, para que o personagem seja desenhado "por cima" do ponto de chegada, e não o contrário - isso também poderia ser feito usando diferentes valores do parâmetro "z", discutido em posts anteriores, mas vamos manter o máximo de simplicidade por enquanto. Execute o jogo e confira:

![screenshot]({{ "/img/posts/2019-06-07-screenshot.png" | prepend: site.baseurl }})

Legal, já temos uma área definida como fim do labirinto. Agora, vamos checar se o usuário chegou no final:

```ruby
...
  def initialize
    ...
    @finished = false
  end
  
  def update
    ...
    
    unless @finished
      v = Vector.new(0, 0)
      v.x += 3 if KB.key_down?(Gosu::KB_RIGHT)
      v.x -= 3 if KB.key_down?(Gosu::KB_LEFT)
      v.y += 3 if KB.key_down?(Gosu::KB_DOWN)
      v.y -= 3 if KB.key_down?(Gosu::KB_UP)
      
      @sprite.move(v, @walls, [], true)
    end
    
    ...
    
    if @sprite.bounds.intersect?(@goal.bounds)
      @finished = true
    end
  end
...
```

Colocamos toda a lógica de movimento dentro do bloco iniciado por `unless @finished`, para que o usuário não consiga mais mover a carinha uma vez que tiver chegado ao final do labirinto. Utilizamos o método `bounds` dos dois GameObjects para obter suas respectivas caixas de colisão, e verificamos se uma delas está interseccionando a outra (através do método `intersect?` da própria caixa de colisão). Definimos a variável `@finished` como `true` para indicar que o evento ocorreu.

Porém, apenas com esse código, apesar de sabermos quando o jogador chegou no final, não há nenhuma "resposta" na tela para o usuário - apesar de ele ficar "preso" no final. É o que vamos resolver a seguir com ajuda das funções de texto da MiniGL.

## Desenhando texto

A MiniGL fornece a classe `TextHelper`, que disponibiliza várias opções e modos diferentes de exibir texto na tela. É possível exibir texto com uma ou mais linhas, alinhar o texto à esquerda, à direita, centralizado ou justificado, utilizar efeito de borda ou sombra no texto, além, claro, de poder definir a fonte, a cor e o tamanho. Para utilizá-la, é necessário primeiro carregar a fonte propriamente dita, que é um tipo de recurso.

Há dois caminhos diferentes para carregar uma fonte: pode ser uma fonte do sistema ou ser carregada a partir de um arquivo de fonte (por exemplo '.ttf'). Para carregar uma fonte do sistema:

```ruby
...
  def initialize
    ...
    font = Gosu::Font.new(16, name: 'Nome da fonte')
  end
...
```

Na chamada acima, você deve substituir `'Nome da fonte'` pelo nome de uma fonte do seu sistema (por exemplo, "Arial" ou "Times New Roman" no Windows, "DejaVu Sans" em algumas distribuições Linux); o primeiro argumento é o tamanho da fonte. Já para carregar de um arquivo de fonte - que é o mais indicado para um jogo, para garantir sua identidade visual independente da plataforma - podemos usar a classe de gerenciamento de recursos (`Res`) da MiniGL:

```ruby
...
  def initialize
    ...
    font = Res.font :fonte, 16
  end
...
```

A chamada acima supõe que você possui um arquivo "fonte.ttf" no diretório "data/font" (trata-se da convenção de diretórios da classe `Res`, reveja o [segundo post]({% link _posts/2019-05-28-desenvolvendo-games-com-ruby-e-minigl-parte-2.md %}) para mais detalhes). O segundo parâmetro é o tamanho da fonte.

Uma vez carregada a fonte (com qualquer uma das opções acima), vamos criar o objeto `TextHelper` (o único argumento necessário para o construtor é a fonte) e usá-lo para escrever uma mensagem na tela quando o jogador chegar ao final:

```ruby
...
  def initialize
    ...
    @text_helper = TextHelper.new font
  end
  
  ...
  
  def draw
    ...
    if @finished
      @text_helper.write_line 'Você venceu!', 20, 20
    end
  end
...
```

Aqui, criamos a variável `@text_helper` para guardar nossa instância do TextHelper e, no método draw, verificamos a variável que indica que o jogador chegou ao final (`@finished`). Caso seja verdadeira, então chamamos o método `write_line` do nosso TextHelper, que desenha uma única linha de texto. Os parâmetros fornecidos no caso acima são o texto a ser desenhado e as coordenadas x e y de referência - como o alinhamento padrão é à esquerda, essa referência será o canto superior esquerdo do texto. Execute o jogo, mova a carinha até o ponto de término e você deverá ver algo assim:

![screenshot]({{ "/img/posts/2019-06-07-screenshot2.png" | prepend: site.baseurl }})

Legal, não? Porém, essa mensagem definitivamente precisa de um pouco mais de destaque... Vamos aumentar a fonte e explorar algumas opções adicionais do TextHelper:

```ruby
...
  def initialize
    ...
    font = Res.font :fonte, 48 # ou Gosu::Font.new(48, name: 'Nome da fonte')
    @text_helper = TextHelper.new font
  end
  
  ...
  
  def draw
    ...
    if @finished
      @text_helper.write_line 'Você venceu!', 400, 276, :center, 0xffff00, 255, :border, 0x000000, 2
    end
  end
...
```

![screenshot]({{ "/img/posts/2019-06-07-screenshot3.png" | prepend: site.baseurl }})

Bem melhor, não é mesmo? E o melhor: tudo isso apenas alterando alguns parâmetros :)

Vejamos quais foram as alterações:
* O tamanho da fonte no seu construtor foi alterado para 48.
* As coordenadas x e y (segundo e terceiro parâmetros de `write_line`) foram alterados para 400 e 276, sendo que 400 é o ponto médio horizontal da tela, e 276 é o ponto médio vertical subtraído de 24, que corresponde a metade do tamanho da fonte.
* O parâmetro seguinte, `:center`, é o alinhamento do texto. Isto determina como o texto se distribui a partir do ponto de referência indicado pelas coordenadas x e y. No caso de `:center`, as coordenadas são usadas horizontalmente como o centro do texto e verticalmente como o topo. As outras opções são `:left` e `:right`, sendo que `:left` é o padrão e o ponto de referência corresponderá ao canto superior esquerdo do texto, e para `:right` o ponto de referência será o canto superior direito do texto.
* Os próximos parâmetros são a cor do texto, dessa vez no formato 0xRRGGBB, sem a componente de opacidade, e a opacidade, indicada como um valor de 0 a 255.
* A seguir, passamos o valor `:border`, para indicar que o texto deve ser desenhado com borda. Também há a opção `:shadow`, para desenhar o texto com sombra.
* Após especificado o tipo de efeito, é possível especificar sua cor (também no formato 0xRRGGBB), que nesse caso será preto (0x000000, ou simplesmente 0).
* Por fim, está sendo especificado o "tamanho" do efeito. No caso da borda, é a espessura da mesma, em pixels. No caso de sombra, seria a distância entre a sombra e o texto.

O método ainda aceita mais dois parâmetros após estes, que seriam a opacidade do efeito (valor de 0 a 255), e a coordenada "z" para desenho do texto.

Tudo muito bom até aqui, só precisamos agora possibilitar que o jogador jogue novamente após chegar ao final. Para isso vamos introduzir ainda mais uma classe muito útil da MiniGL...

## Botões

Botões são provavelmente o elemento de interface de usuário mais fundamental. Principalmente para jogos de PC, eles são elementos muito comuns. A biblioteca MiniGL oferece a classe `Button`, que permite criar com poucas linhas um botão totalmente funcional!

Primeiro, vamos precisar da imagem do botão, que será uma espécie de spritesheet, pois o botão tem vários "estados", cada um podendo ser visualmente diferente dos demais - mais especificamente, o estado normal, o estado quando o mouse está sobre o botão, o estado quando o botão está sendo clicado, e o estado desabilitado. Assim, vamos precisar de uma spritesheet composta de 4 imagens, representando cada um dos 4 estados citados anteriormente. Estas 4 imagens devem estar dispostas uma abaixo da outra, ou seja, a spritesheet deve ter uma única coluna e 4 linhas:

![screenshot]({{ "/img/posts/2019-06-07-button.png" | prepend: site.baseurl }})

Salve a imagem acima como "data/img/button.png" e estamos prontos para começar:

```ruby
...
  def initialize
    ...
    font2 = Res.font :fonte, 20
    @button = Button.new(325, 330, font2, 'Jogar de novo', :button) do
      @finished = false
      @sprite.x = @sprite.y = 10
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
      
      @sprite.move(v, @walls, [], true)
    end
    
    ...
  end
  
  def draw
    ...
    if @finished
      @text_helper.write_line 'Você venceu!', 400, 276, :center, 0xffff00, 255, :border, 0x000000, 2
      @button.draw
    end
  end
...
```

Vamos analisar método a método o que foi alterado:
* No método `initialize`:
    * Criamos uma nova fonte, `font2`, carregada num tamanho menor para se adequar ao botão.
    * Criamos o botão em si. Os parâmetros são, nesta ordem, as coordenadas x e y (do canto superior esquerdo, como de costume), a fonte usada para escrever o texto do botão, o texto propriamente dito e o identificador da imagem, como no construtor de `Sprite` ou `GameObject`.
    * Além dos parâmetros do construtor, passamos também um bloco, o qual corresponde à ação de clique no botão. Neste caso, apenas revertemos a variável `@finished` para `false` e voltamos a carinha para sua posição inicial, redefinindo suas propriedades x e y.
* No método `needs_cursor?`:
    * Este método havia sido removido, mas declaramos ele novamente e agora ele retorna o valor da variável `@finished`, isto é, o cursor do mouse será mostrado apenas quando essa variável for verdadeira.
* No método `update`:
    * Voltamos a chamar `Mouse.update`, para poder detectar o clique no botão.
    * No lugar do bloco `unless @finished` envolvendo a lógica de movimentação, agora temos um bloco "if-else", sendo que no "if" o botão é atualizado (ele só deve ser atualizado quando o jogo está no estado finalizado), e no "else" fica a lógica de movimento (ou seja, continuará sendo executada quando `@finished` for falsa).
* No método `draw`:
    * Incluímos a chamada `@button.draw` dentro do bloco `if @finished`, para desenhar o botão quando o jogo estiver finalizado.

E isso é tudo. Rode o jogo novamente e aprecie o resultado final:

![resultado]({{ "/img/posts/2019-06-07-gif.gif" | prepend: site.baseurl }})

Segue íntegra do arquivo de código novamente, para referência:

```ruby
require 'minigl'
include MiniGL

class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'Meu Primeiro Jogo'
    @sprite = GameObject.new(10, 10, 100, 100, :face, Vector.new(0, 0), 2, 3)
    @blinking = false
    @walls = [
      Block.new(0, 0, 10, 600),
      Block.new(0, 0, 800, 10),
      Block.new(790, 0, 10, 600),
      Block.new(0, 590, 800, 10),
      Block.new(250, 0, 10, 400),
      Block.new(550, 200, 10, 400)
    ]
    @goal = GameObject.new(640, 480, 50, 50, :goal, Vector.new(-17, -17))
    
    @finished = false
    font = Res.font :fonte, 48
    @text_helper = TextHelper.new(font)
    font2 = Res.font :fonte, 20
    @button = Button.new(325, 330, font2, 'Jogar de novo', :button) do
      @finished = false
      @sprite.x = @sprite.y = 10
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
      
      @sprite.move(v, @walls, [], true)
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
  end
  
  def draw
    clear 0xffabcdef
    @goal.draw
    @sprite.draw
    @walls.each do |w|
      draw_quad(w.x, w.y, 0xff000000,
                w.x + w.w, w.y, 0xff000000,
                w.x, w.y + w.h, 0xff000000,
                w.x + w.w, w.y + w.h, 0xff000000, 0)
    end
    if @finished
      @text_helper.write_line 'Você venceu!', 400, 276, :center, 0xffff00, 255, :border, 0x000000, 2
      @button.draw
    end
  end
end

MyGame.new.show
```

Bem... Conseguimos bastante coisa com essas pouco mais de 80 linhas de código, não? Esse é o objetivo da MiniGL, permitir fazer muito escrevendo pouco. Porém, os posts até aqui demonstraram apenas uma pequena fração do que a MiniGL oferece! Apenas como rápidos exemplos, a classe `Button` oferece muito mais opções de personalização do que foram utilizadas aqui; a classe `TextHelper` oferece métodos para escrever texto de várias linhas numa área delimitada; há outros controle de interface de usuário além de botões... e assim por diante!

Assim, ainda temos um longo caminho pela frente para explorar os demais recursos da biblioteca. Até a próxima!

---

<span class="previous-post">[Parte 3 <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({% link _posts/2019-06-03-desenvolvendo-games-com-ruby-e-minigl-parte-3.md %})</span>
