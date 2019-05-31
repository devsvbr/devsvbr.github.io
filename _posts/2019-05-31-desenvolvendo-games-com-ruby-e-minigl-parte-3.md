---
pubid: "post-minigl-3"
comments: true
langvisible: true
title: "Parte 3 - animação e colisão"
description: "Vamos animar imagens e fazer coisas colidirem."
series: "Desenvolvendo games com Ruby e MiniGL"
date: 2019-05-30 15:00:00 -0300
author: Victor David Santos
categories: [ruby, minigl]
---
Olá e sejam bem-vindos a mais um post da série sobre desenvolvimento de games com Ruby e MiniGL!

Hoje, vamos tornar o nosso protótipo de jogo algo ainda mais próximo de um jogo de verdade, com um pouco de animação e colisões, incluindo um "objetivo" para o jogador.

## Animação

Você já deve ter reparado que a maioria dos jogos não possui apenas imagens estáticas, mas sim "imagens que se movimentam", ou seja, animações. Estas são nada mais do que sequências de imagens que se alternam rapidamente, dando a impressão de movimento. Como as várias imagens que compõem uma animação tendem a ser parecidas (e com tamanhos próximos), uma técnica comumente usada em jogos é combinar todas elas numa única imagem e alternar os "pedaços" da imagem que são desenhados a cada vez. Este é o conceito de _sprite_ (e a imagem que combina as várias fases da animação é uma _spritesheet_).

A biblioteca MiniGL oferece uma classe especializada em lidar com esse tipo de animação, a classe `Sprite`. Vamos criar um objeto animado no nosso jogo, mas para isso vamos precisar da spritesheet:

_imagem aqui_

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

Acrescente esta linha, salve o arquivo e rode o jogo (`ruby game.rb` no terminal/prompt de comando, dentro da pasta do projeto). Você verá que a imagem agora está animada! Bastante simples, não? Agora vamos analisar com cuidado a linha que acabamos de acrescentar. É uma chamada ao método `animate` da sprite. Este método recebe como primeiro parâmetro um vetor/lista de números (estes delimitados entre colchetes), e como segundo parâmetro um outro número. O primeiro parâmetro é uma sequência dos "índices" dos "pedaços" da spritesheet. Nossa spritesheet tem 2 linhas e 2 colunas, ou seja, 4 pedaços no total, que podem ser indexados de 0 a 3. Esta indexação segue da esquerda para a direita, de cima para baixo. Assim, o pedaço do canto superior esquerdo tem índice 0, o do canto superior direito tem índice 1, o do inferior esquerdo 2 e o do inferior direito 3. Portanto, estamos indicando com esse parâmetro que devem ser alternados os índices nesta ordem, continuamente. Por fim, o segundo parâmetro é a quantidade de frames entre cada alteração de índice. Como o jogo roda a cerca de 60 frames por segundo, isto indica que a imagem será alterada cerca de 12 (60 dividido pelo intervalo de 5) vezes por segundo.

---


