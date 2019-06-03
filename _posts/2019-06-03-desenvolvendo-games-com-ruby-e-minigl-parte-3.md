---
pubid: "post-minigl-3"
comments: true
langvisible: true
title: "Parte 3 - animação e colisão"
description: "Vamos animar imagens e fazer coisas colidirem."
series: "Desenvolvendo games com Ruby e MiniGL"
date: 2019-06-03 18:00:00 -0300
author: Victor David Santos
categories: [ruby, minigl]
---
Olá e sejam bem-vindos a mais um post da série sobre desenvolvimento de games com Ruby e MiniGL!

Hoje, vamos tornar o nosso protótipo de jogo algo ainda mais próximo de um jogo de verdade, com um pouco de animação e colisões.

**Importante**: Para acompanhar este post, você deve atualizar a MiniGL para a versão 2.2.5 (posterior aos dois primeiros posts desta série) ou superior. Para isso execute estes comandos no terminal/prompt de comando:

```bash
gem uninstall minigl
gem install minigl
```

## Animação

Você já deve ter reparado que a maioria dos jogos não possui apenas imagens estáticas, mas sim "imagens que se movimentam", ou seja, animações. Estas são nada mais do que sequências de imagens que se alternam rapidamente, dando a impressão de movimento. Como as várias imagens que compõem uma animação tendem a ser parecidas (e com tamanhos próximos), uma técnica comumente usada em jogos é combinar todas elas numa única imagem e alternar os "pedaços" da imagem que são desenhados a cada vez. Este é o conceito de _sprite_ (e a imagem que combina as várias fases da animação é uma _spritesheet_).

A biblioteca MiniGL oferece uma classe especializada em lidar com esse tipo de animação, a classe `Sprite`. Vamos criar um objeto animado no nosso jogo, mas para isso vamos precisar da spritesheet:

![face.png]({{ "/img/posts/2019-06-03-face.png" | prepend: site.baseurl }})

Inclua a imagem acima na pasta "data/img" do seu projeto, com o nome "face.png" (vamos substituir a imagem estática usada no post anterior).

Uma observação importante: a classe `Sprite` da MiniGL funciona apenas com spritesheets em que todos os pedaços têm o mesmo tamanho, e estão dispostos numa "grid" dentro da imagem, ou seja, a imagem é composta de linhas e colunas. Por exemplo, a imagem acima é composta de 2 linhas e 2 colunas, cada "célula" possuindo 100 x 100 pixels. Essa quantidade de linhas e colunas será usada para inicializar a sprite. Revisitando o arquivo "game.rb" do post anterior:

```ruby
...
class MyGame < GameWindow
  def initialize
    ...
    @sprite = Sprite.new(0, 0, :face, 2, 2)
  end
...
```

Estamos criando uma variável de instância `@sprite` que receberá uma nova instância da classe `Sprite`, inicializada com os seguintes parâmetros:
* Os dois primeiros (zeros) são as coordenadas x e y. A sprite armazena sua posição, de modo que não serão mais necessárias variáveis na classe `MyGame` para controlar a posição de desenho.
* O terceiro, `:face`, é um indicador da imagem que será usada. A ideia é a mesma da chamada `Res.img`, porém neste caso será sempre assumida a extensão padrão '.png'.
* O quarto e o quinto são a quantidade de colunas e linhas (nesta ordem) que compõem a spritesheet.

Se alterarmos agora o método `draw` do nosso jogo para o código abaixo:

```ruby
...
  def draw
    clear 0xffabcdef
    @sprite.draw
  end
...
```

já veremos a imagem sendo desenhada no canto superior esquerdo, como antes, estática. Isto porque nós não efetivamente animamos a sprite, ou seja, não fizemos com que fossem trocados os "pedaços" da imagem que são desenhados, de tempos em tempos. Vamos fazê-lo agora, no método `update`:

```ruby
...
  def update
    ...
    @sprite.animate([0, 1, 2, 3], 5)
  end
...
```

![animação]({{ "/img/posts/2019-06-03-gif1.gif" | prepend: site.baseurl }})

Acrescente esta linha, salve o arquivo e rode o jogo (`ruby game.rb` no terminal/prompt de comando, dentro da pasta do projeto). Você verá que a imagem agora está animada! Bastante simples, não? Agora vamos analisar com cuidado a linha que acabamos de acrescentar. É uma chamada ao método `animate` da sprite. Este método recebe como primeiro parâmetro um vetor/lista de números (estes delimitados entre colchetes), e como segundo parâmetro um outro número. O primeiro parâmetro é uma sequência dos "índices" dos "pedaços" da spritesheet. Nossa spritesheet tem 2 linhas e 2 colunas, ou seja, 4 pedaços no total, que podem ser indexados de 0 a 3. Esta indexação segue da esquerda para a direita, de cima para baixo. Assim, o pedaço do canto superior esquerdo tem índice 0, o do canto superior direito tem índice 1, o do inferior esquerdo 2 e o do inferior direito 3. Portanto, estamos indicando com esse parâmetro que devem ser alternados os índices nesta ordem, continuamente. Por fim, o segundo parâmetro é a quantidade de frames entre cada alteração de índice. Como o jogo roda a cerca de 60 frames por segundo, isto indica que a imagem será alterada cerca de 12 (60 dividido pelo intervalo de 5) vezes por segundo.

Desta maneira já cobrimos animações contínuas, mas é também comum a necessidade de mostrar uma animação que ocorre apenas uma vez, como por exemplo quando o personagem executa algum movimento comandado pelo usuário. Vamos incrementar nossa spritesheet com uma animação de "piscada de olho" para demonstrar isto:

![face.png]({{ "/img/posts/2019-06-03-face2.png" | prepend: site.baseurl }})

As duas novas partes da imagem, conforme lógica explicada anteriormente, possuem índices 4 e 5. A ideia é animar usando estes índices quando o usuário pressionar uma tecla (por exemplo, a barra de espaço):

```ruby
...
  def initialize
    ...
    @sprite = Sprite.new(0, 0, :face, 2, 3)
    @blinking = false
  end
  
  def update
    ...
    
    if @blinking
      @sprite.animate_once([4, 5], 7)
    else
      @sprite.animate([0, 1, 2, 3], 5)
      if KB.key_pressed?(Gosu::KB_SPACE)
        @blinking = true
        @sprite.set_animation 4
      end
    end
  end
...
```

Ok, bastantes coisas novas aqui. Vamos analisá-las na sequência:
* Foi alterada a inicialização da sprite (`@sprite = Sprite.new...`) para indicar que a spritesheet tem agora 3 linhas (último parâmetro).
* Criamos uma variável auxiliar para controlas as animações, `@blinking`, que indicará quando a "piscada" deve ocorrer.
* No método update, primeiro verificamos a variável citada acima e, se for verdadeira, chamamos o método `animate_once`, que funciona como o `animate`, porém executa a animação apenas uma vez, isto é, após chegar no último índice do vetor, para de alterar o índice da imagem; se a variável for falsa (estado inicial), animamos como antes e checamos se a tecla de espaço foi pressionada. Caso ela tenha sido pressionada, alteramos a variável de controle para true e chamamos o método `set_animation` passando o índice 4 como parâmetro - este método altera imediatamente o índice atual da imagem para o fornecido como parâmetro, além de resetar o timer que controla a troca de índices.

Se você testar o jogo agora, verá que ele inicia da mesma maneira, com a animação, mas se apertar a barra de espaço, será mostrada a animação de piscada de olho e então a imagem ficará estática a partir daí - porque está sendo chamado o método `animate_once`, o qual para de atualizar a imagem quando chega ao fim da sequência de índices, e nós não estamos voltando a variável `@blinking` para seu estado inicial. Felizmente, é bem fácil ajustar isso:

```ruby
...
  def update
    ...
    
    if @blinking
      @sprite.animate_once([4, 5], 7) do
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
...
```

Tudo o que foi feito foi adicionar um bloco após a chamada do método `animate_once` (em Ruby, qualquer método pode receber um bloco após a passagem de parâmetros, o qual é delimitado por "do" e "end" ou por chaves). Este bloco é um trecho de código a ser executado após o término da animação. Neste caso, estamos voltando a variável que indica que está ocorrendo a animação de piscada para `false` e resetando o índice e os timers de animação.

Executando o jogo agora, você verá que, após a "piscada", a sprite volta à animação original. Porém, a "volta" está um pouco brusca, o que pode ser ajustado alterando os índices:

```ruby
...
@sprite.animate_once([4, 5, 4], 7) do
...
```

Perfeito! Sobre animações, por enquanto é isso. Estamos pronto para o próximo passo.

## Movimento e colisão

Já está na hora de nosso jogo ter um objetivo, não é mesmo? Vamos criar um pequeno "labirinto" para o personagem se locomover e tentar chegar ao final. Primeiro, vamos definir as paredes do labirinto:

```ruby
...
  def initialize
    ...
    @walls = [
      Block.new(0, 0, 10, 600),
      Block.new(0, 0, 800, 10),
      Block.new(790, 0, 10, 600),
      Block.new(0, 590, 800, 10),
      Block.new(250, 0, 10, 400),
      Block.new(550, 200, 10, 400)
    ]
  end
  ...
  def draw
    ...
    @walls.each do |w|
      draw_quad(w.x, w.y, 0xff000000,
                w.x + w.w, w.y, 0xff000000,
                w.x, w.y + w.h, 0xff000000,
                w.x + w.w, w.y + w.h, 0xff000000, 0)
    end
  end
...
```

No construtor, nós definimos uma nova variável `@walls`, que será uma lista de objetos da classe `Block`. A classe Block é fornecida pela MiniGL e representa um bloco retangular que permite checagem de colisão. Sua inicialização recebe como parâmetros as coordenadas x e y do seu canto superior esquerdo e sua largura e altura em pixels, nesta ordem.

A seguir, no método draw, estamos percorrendo a lista de paredes (`@walls.each do |w|`), usando o método `each` e passando um bloco, o qual será executado uma vez para cada elemento da lista, sendo que o elemento atual é representado pelo parâmetro "w" do bloco (indicado por `|w|`). Para cada elemento, chamamos `draw_quad`, um método da própria janela que desenha um quadrilátero na tela. Os parâmetros são quatro conjuntos de coordenadas x e y e uma cor, um para cada vértice do quadrilátero, e por fim a coordenada z. Por exemplo, os três primeiros parâmetros (`w.x, w.y, 0xff000000`) indicam que o canto superior esquerdo deste retângulo corresponderá ao canto superior esquerdo do bloco e que será pintado de preto. Repetimos a mesma lógica para os outros três cantos do bloco, acessando suas coordenadas e também sua largura e altura (`w.w` para a largura, `w.h` para a altura).

Execute o jogo agora e você verá que criamos um contorno em todas as bordas da tela e uma espécie de caminho em "s" delimitado por esses blocos. Mal dá para dizer que é um labirinto, mas o importante é entender o conceito. ;P

![paredes]({{ "/img/posts/2019-06-03-screenshot.png" | prepend: site.baseurl }})

Agora, precisamos fazer com que a carinha se mova pelo labirinto. No post anterior, havíamos criado o seguinte trecho no método update:

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
    
    ...
  end
...
```

Vamos alterá-lo para que ele controle a posição de nossa sprite (porém, vamos remover as ações do mouse, já que não queremos que o usuário simplesmente clique no final do labirinto):

```ruby
...
  def update
    KB.update
    
    @sprite.x += 3 if KB.key_down?(Gosu::KB_RIGHT)
    @sprite.x -= 3 if KB.key_down?(Gosu::KB_LEFT)
    @sprite.y += 3 if KB.key_down?(Gosu::KB_DOWN)
    @sprite.y -= 3 if KB.key_down?(Gosu::KB_UP)
    
    ...
  end
...
```

Note que alteramos também o valor da alteração da posição para 3, pois 1 a cada frame é muito devagar. Teste o jogo agora e você conseguirá movimentar a carinha... mas ela irá atravessar todas as paredes. :(

Bom, isso já era esperado, já que **a classe Sprite não possui checagem de colisão**. Ela é destinada apenas a desenhar objetos (opcionalmente animados) na tela. Porém, não se preocupe, pois a MiniGL oferece uma solução fácil para isto também! Vamos fazer um "upgrade" da nossa sprite para uma outra classe, `GameObject`:

```ruby
...
  def initialize
    ...
    @sprite = GameObject.new(10, 10, 100, 100, :face, Vector.new(0, 0), 2, 3)
    ...
  end
  
  def update
    KB.update
    
    v = Vector.new(0, 0)
    v.x += 3 if KB.key_down?(Gosu::KB_RIGHT)
    v.x -= 3 if KB.key_down?(Gosu::KB_LEFT)
    v.y += 3 if KB.key_down?(Gosu::KB_DOWN)
    v.y -= 3 if KB.key_down?(Gosu::KB_UP)
    
    @sprite.move(v, @walls, [], true)
  end
...
```

Primeiramente, vamos analisar o construtor de GameObject:
* Os dois primeiros parâmetros continuam sendo as coordenadas x e y do canto superior esquerdo do objeto.
* Os dois parâmetros seguintes são a largura e a altura da caixa de colisão do objeto. Note que toda a checagem de colisão da MiniGL é baseada em caixas retangulares.
* O parâmetro seguinte (`:face`) continua sendo um identificador da imagem, seguindo as mesmas regras que no construtor de `Sprite`.
* O sexto parâmetro está recebendo uma instância da classe `Vector` (que representa simplesmente um ponto no espaço 2D, ou seja, um par de coordenadas). Este parâmetro representa o "image gap", ou seja, o deslocamento da imagem em relação à posição "física" do objeto. Vamos falar mais sobre este em outras oportunidades. Aqui está sendo inicializado com zeros, o que indica que a posição da imagem será exatamente a mesma dos limites físicos do objeto.
* Por fim, os dois parâmetros seguintes são as colunas e linhas da spritesheet, funcionando da mesma maneira que no construtor de `Sprite`.

Após converter a sprite num GameObject, também alteramos a lógica de movimentação. Em vez de alterarmos diretamente as coordenadas x e y (pois desta maneira estaríamos sempre ignorando colisões), construímos um vetor de deslocamento (variável `v`), e vamos alterando suas componentes. Por fim, chamamos o método `move` do objeto, passando como parâmetro esse vetor de deslocamento, a lista de objetos contra os quais deve ser checada colisão (no nosso caso, a lista `@walls`), uma lista vazia (`[]`), que é um parâmetro que vamos também discutir mais para a frente, e o valor `true`, que indica que o vetor passado como primeiro parâmetro é um vetor de velocidades - a outra possibilidade é passar um vetor de forças, para realizar movimentos mais realistas, afetados pela força da gravidade, que também será tópico de posts futuros.

![colisão]({{ "/img/posts/2019-06-03-gif2.gif" | prepend: site.baseurl }})

Experimente rodar o jogo agora e você verá que a carinha não mais atravessa nenhuma parede. Legal! Já temos os principais componentes para poder criar um jogo de verdade, o próximo passo é verificar que o jogador chegou ao final do labirinto e mostrar de alguma forma na tela que ele ganhou. Estes serão os assuntos do próximo post, então não perca! Até mais. ;)

---

<span class="previous-post">[Parte 2 <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({% link _posts/2019-05-28-desenvolvendo-games-com-ruby-e-minigl-parte-2.md %})</span>
