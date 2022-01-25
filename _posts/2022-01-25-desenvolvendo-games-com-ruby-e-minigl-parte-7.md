---
pubid: "post-minigl-7"
comments: true
langvisible: true
title: "Parte 7 - um jogo completo!"
description: "Explorando \"Super Bombinhas\", um jogo completo feito com MiniGL"
series: "Desenvolvendo games com Ruby e MiniGL"
date: 2022-01-25 09:00:00 -0300
author: Victor David Santos
categories: [ruby, minigl]
---
Olá, meus caros. Sim, passou um _tempinho_ desde o último post... Porém, muitas coisas interessantes aconteceram, entre elas a finalização do meu projeto mais ambicioso de jogo até o momento, o "Super Bombinhas". É um jogo de plataforma, inspirado nos clássicos Mario e Donkey Kong - quem jogou sabe que são verdadeiros tesouros da época.

Como vocês devem imaginar, o jogo foi feito com Ruby e MiniGL - usando tudo que apresentei a vocês nos posts anteriores e mais um bocado de coisas... Mais recentemente, eu [lancei o jogo na Steam](https://store.steampowered.com/app/1553840){:target="_blank"}{:rel="noopener noreferrer"}, e por ser um dos poucos jogos completos feitos em Ruby, até chamou atenção da comunidade da linguagem, e fui convidado a gravar um [podcast falando sobre ele](https://www.therubyonrailspodcast.com/397){:target="_blank"}{:rel="noopener noreferrer"} (em inglês)!

Apesar de estar à venda na Steam, o jogo é de código aberto e está disponível integralmente no [meu GitHub](https://github.com/victords/super-bombinhas){:target="_blank"}{:rel="noopener noreferrer"}. Instaladores também podem ser baixados gratuitamente pelo [itch.io](https://victords.itch.io/super-bombinhas){:target="_blank"}{:rel="noopener noreferrer"}. Mas vamos ao que interessa: explorar um pouco do código de Super Bombinhas e falar sobre os algoritmos, técnicas e funcionalidades da MiniGL empregadas para construir um jogo completo.

## Arquitetura em alto nível

Primeiramente, vamos analisar, de maneira superficial, como o código do jogo está organizado - baixe o repositório do GitHub para sua máquina para acompanhar mais facilmente. Todos os arquivos de código estão na raiz do repositório, e também na raiz está a pasta `data`, que é a pasta padrão da MiniGL para guardar os "ativos" do jogo (imagens, sons, etc.). Dentro dessa pasta, os ativos também estão organizados em subpastas que seguem a convenção da MiniGL, de modo que não preciso fazer nenhuma configuração para poder carregar os arquivos (veja a [parte 2]({% link _posts/2019-05-28-desenvolvendo-games-com-ruby-e-minigl-parte-2.md %}){:target="_blank"}{:rel="noopener noreferrer"} para relembrar como referenciar arquivos usando a MiniGL).

O ponto de entrada é o arquivo `game.rb`, onde temos um controle do "estado" atual do jogo: aqui é verificado se o jogador está no menu, no mapa do mundo, ou dentro de uma fase, e as classes responsáveis por cada uma dessas partes é chamada para fazer a maior parte do trabalho. Esta lógica pode ser observada neste trecho do método `update`:

```ruby
    if SB.state == :presentation
      [...] # código que controla a tela de introdução, implementado aqui mesmo
    elsif SB.state == :menu
      Menu.update
    elsif SB.state == :map
      SB.world.update
    elsif SB.state == :main
      status = SB.stage.update
      SB.end_stage if status == :finish
      StageMenu.update_main
    elsif SB.state == :stage_end
      StageMenu.update_end
    elsif SB.state == :paused
      SB.check_song
      StageMenu.update_paused
    elsif SB.state == :movie
      SB.movie.update
    elsif SB.state == :game_end
      Credits.update
    elsif SB.state == :game_end_2
      if SB.key_pressed?(:confirm)
        Menu.reset
        SB.state = :menu
      end
    elsif SB.state == :editor
      SB.editor.update
    end
```

Há várias referências a `SB`, que é uma classe com métodos estáticos que dão acesso a vários elementos importantes do jogo, facilitando que sejam acessados de praticamente qualquer lugar do código. Pode não ser um exemplo de melhores práticas, mas funciona bem para um projeto de complexidade média como este - para projetos mais complexos, seria preferível usar algum padrão como injeção de dependências. Esta classe está declarada no arquivo `global.rb`, junto com outros elementos que precisam ser acessados de diversos lugares (ou seja, estão acessíveis globalmente, daí o nome do arquivo). A classe `SB` usa uma técnica interessante de Ruby para automaticamente fazer todos os métodos serem declarados como estáticos:

```ruby
class SB
  class << self
    # declaração de métodos e variáveis como se fossem de instância
  end
end
```

Tudo que for declarado dentro do bloco iniciado por `class << self` será acessado diretamente da classe.

Agora, enumerando as classes principais que controlam os diferentes estados do jogo (cada uma está declarada no arquivo com nome correspondente):
* `Menu` - controla o menu inicial do jogo, onde se encontram instruções, opções, a seleção de jogos salvos ou opção de iniciar novo jogo, etc.
* `World` - controla o mapa do mundo, onde o jogador pode selecionar a fase que irá jogar.
* `Stage` - controla os aspectos gerais de uma fase do jogo.
  * `Section` - cada fase é dividida em "seções", sendo esta a classe responsável por controlar uma seção específica. Esta é provavelmente uma das classes mais interessantes do projeto.
* `StageMenu` - controla o menu de pausa e outros elementos de interface de usuário que aparecem "dentro" de uma fase do jogo.

<figure style="text-align: center">
<img src="https://raw.githubusercontent.com/victords/super-bombinhas/master/screenshot/map.png" alt="Mapa do mundo" style="display: inline-block" />
<figcaption style="margin-top: 5px">O mapa do mundo, controlado pela classe <code>World</code></figcaption>
</figure>

Uma outra característica geral da arquitetura do jogo é que a maioria das classes possui os métodos `update` e `draw`, da mesma forma que a classe que representa a janela do jogo e serve de ponto de partida. Em geral, o `update` de uma classe chama o `update` dos objetos que ela contém/referencia, desde o nível mais alto (a classe `SBGame`) até as classes mais específicas (como as que representam um inimigo ou item do jogo); o mesmo comportamento é observado nos métodos `draw`.

## Estendendo elementos de interface de usuário

No arquivo `menu.rb` você verá a declaração e utilização de diversos elementos de interface de usuário - alguns fornecidos pela MiniGL, como `Button`, mas outros definidos no projeto do jogo, como `SavedGameButton` ou `MenuText`. Estes últimos são exemplos interessantes de extensões aos elementos de GUI (_graphical user interface_, ou interface gráfica de usuário). A maioria dessas extensões está declarada em outro arquivo, `form.rb`, sendo talvez o mais notável o módulo `FormElement`. É um módulo incluído por todos os controles de menu para dar a eles uma funcionalidade compartilhada: o efeito visual de transição quando o usuário troca de tela (todos os controles se movem para o lado com um movimento desacelerado). Para entender melhor do que se trata, execute o jogo com `ruby game.rb` (você precisa ter a gem `minigl` instalada na versão 2.3.5 ou superior). Abaixo o código relevante:

```ruby
  def update_movement
    if @aim_x
      dist_x = @aim_x - @x
      dist_y = @aim_y - @y
      if dist_x.round == 0 and dist_y.round == 0
        @x = @aim_x
        @y = @aim_y
        @aim_x = @aim_y = nil
      else
        set_position(@x + dist_x / 5.0, @y + dist_y / 5.0)
      end
    end
  end
```

As outras classes adicionam padrões como por exemplo o visual dos botões, a fonte utilizada e até mesmo a posição padrão (a maioria dos botões aparece centralizado horizontalmente na tela), de modo que essas configurações não precisem ser repetidas para cada elemento, o que seria necessário se apenas utilizássemos diretamente a classe `Button` da MiniGL.

## O núcleo do jogo: <code style="font-size: 1em">Stage</code> e <code style="font-size: 1em">Section</code>

Estas duas classes são responsáveis pelo funcionamento do que é comumente chamado _gameplay_ do jogo, ou seja, a jogabilidade principal, a parte que não se trata de menus ou história. Super Bombinhas, como mencionado anteriormente, é um jogo de plataforma, ou seja, você movimenta seu personagem por uma fase, geralmente movendo-se da esquerda para a direita, pulando, evitando ou atacando inimigos e coletando itens. O movimento é baseado em física (conceito já explorado de forma simplificada no [post anterior]({% link _posts/2019-07-06-desenvolvendo-games-com-ruby-e-minigl-parte-6.md %}){:target="_blank"}{:rel="noopener noreferrer"}), mas bastante refinado para ser agradável nas mãos do jogador.

Cada fase é um mapa quadriculado (um _grid_) e os elementos são posicionados dentro dos pequenos quadrados. Para isso, é utilizada a classe `Map` da MiniGL, que facilita bastante as coisas. Por exemplo, como as fases são grandes, nós não queremos desenhar na tela todos os _tiles_ (componentes do cenário que ocupam um espaço do _grid_) ao mesmo tempo para não prejudicar o desempenho do jogo. Com o método `foreach` da classe `Map` é fácil fazer isso. Confira o trecho abaixo do método `draw` da classe `Section`:

```ruby
    @map.foreach do |i, j, x, y|
      b = @tiles[i][j].back
      if b
        ind = b
        if b >= 90 && b < 93; ind = 90 + (b - 90 + @tile_3_index) % 3
        elsif b >= 93 && b < 96; ind = 93 + (b - 93 + @tile_3_index) % 3
        elsif b >= 96; ind = 96 + (b - 96 + @tile_4_index) % 4; end
        @tileset[ind].draw x, y, -2, 2, 2
      end
      @tileset[@tiles[i][j].pass].draw x, y, -2, 2, 2 if @tiles[i][j].pass
      @tileset[@tiles[i][j].wall].draw x, y, -2, 2, 2 if @tiles[i][j].wall and not @tiles[i][j].broken
    end
```

O `foreach` vai automaticamente passar apenas pelos _tiles_ que estão atualmente visíveis na tela (o que é controlado pela posição da câmera, outra propriedade de `Map`), passando tanto a linha e coluna da _grid_ (`i` e `j`) quanto as coordenadas na tela já considerando a posição da câmera (`x` e `y`) como parâmetros para o bloco. Assim, fica simples desenhar os _tiles_ corretos nas posições corretas - a matriz `@tiles` pode ser acessada na posição `[i][j]` e o _tile_ desenhado na posição `x, y` da tela.

Ah, não havia mencionado, mas o jogo conta com um editor de fases! Nesse editor, fica bem evidente a estruturação da fase num _grid_:

<figure style="text-align: center">
<img src="https://img.itch.zone/aW1hZ2UvNjg2ODUzLzU0MTg1NzEucG5n/original/RGpucH.png" alt="Editor de fases" style="display: inline-block" />
<figcaption style="margin-top: 5px">O editor de fases, com o <em>grid</em> visível</figcaption>
</figure>

Os _tiles_ são elementos estáticos, componentes do cenário da fase. Os elementos dinâmicos (inimigos e objetos com os quais o jogador pode interagir) são instanciados de uma maneira diferente, que se utiliza de uma característica interessante da linguagem Ruby: até as classes são objetos! No arquivo que codifica uma seção, os elementos são marcados por sequências do tipo `@1`, `@2`, etc., onde o número após o `@` é mapeado para uma classe de elemento (inimigo ou objeto interativo), e essa classe é dinamicamente instanciada - o construtor é chamado diretamente de uma variável que guarda a classe, em vez de ter de ser chamado usando o nome da classe em si. Para ficar mais claro, observemos o trecho abaixo, encontrado no método `start` da classe `Section`:

```ruby
    @element_info.each do |e|
      @elements << e[:type].new(e[:x], e[:y], e[:args], self)
    end
```

Observe a chamada de `new`, o construtor, a partir de `e[:type]`, um elemento de _hash_ que foi previamente preenchido com uma classe. Para isso funcionar, claro, todas as classes de inimigos e elementos interativos têm de ter a mesma assinatura no construtor (ou seja, os construtores têm de receber exatamente os mesmos parâmetros). O mapeamento de números para classes pode ser encontrado na constante `ELEMENT_TYPES`, no mesmo arquivo. A implementação dessas classes todas está distribuída entre os arquivos `elements.rb`, `enemies.rb` e `items.rb`. Há bastante coisa interessante nesses arquivos também, mas falar sobre cada objeto e inimigo tornaria esse post insuportavelmente longo. :P

## Garantindo a performance do movimento

Super Bombinhas é um jogo cujo movimento é baseado em física, e isso implica na existência de colisões. O personagem pode colidir com o chão, a parede, o teto e até alguns elementos dinâmicos como elevadores e alguns inimigos. Os inimigos, por sua vez, também precisam checar colisões com chão e paredes em muitos casos. Agora, imagine uma fase bem grande, com centenas de inimigos e elementos e milhares de células da _grid_ preenchidas com blocos sólidos (ou seja, chão, parede e teto). Se o jogo tentasse, a cada _frame_ (ou quadro, que, para um jogo que roda a 60 FPS, significa 1/60 de um segundo, ou cerca de 16,7 milissegundos), verificar se ocorre colisão entre o jogador e cada um desses elementos, e entre alguns inimigos e esses elementos também, isso exigiria muito poder computacional... Para uma linguagem interpretada como Ruby, isso geraria uma degradação perceptível de performance.

Devido a isso, uma otimização importante teve de ser feita para garantir que o jogo rode a 60 FPS mesmo em máquinas não muito poderosas (uma placa de vídeo bem mais ou menos já dá conta do jogo). Na hora de checar colisões, apenas os blocos "colidíveis" que estão próximos do jogador são levados em conta. Isso é outra vantagem do sistema de _grid_: localizar os blocos próximos de uma certa posição é trivial. Isso funciona baseado na premissa de que a velocidade do jogador nunca será excessivamente grande, ou seja, ele nunca colidirá com um objeto muito distante após apenas um _frame_ de movimento. A lógica dessa otimização encontra-se no método `get_obstacles` da classe `Section`:

```ruby
[...]

    # offset_x e offset_y indicam quantas células da grid de distância serão consideradas para checagem de colisão
    offset_x = offset_y = 2
    if w > 0
      x += w / 2
      offset_x = w / 64 + 2
    end
    if h > 0
      y += h / 2
      offset_y = h / 64 + 2
    end

    # i e j são a linha e a coluna da grid na qual o jogador se encontra
    i = (x / C::TILE_SIZE).round
    j = (y / C::TILE_SIZE).round
    ((j-offset_y)..(j+offset_y)).each do |l|
      [...]
      ((i-offset_x)..(i+offset_x)).each do |k|
        # para cada tile nessa área, verificar se é um tile que colide
        [...]
[...]
```

Assim, apenas os _tiles_ dessa pequena área em volta do jogador (e mais alguns obstáculos dinâmicos como elevadores) são passados para o método `move`, fornecido pelo módulo `Movement` da MiniGL (mais sobre isso em posts anteriores e na [documentação da MiniGL](https://www.rubydoc.info/gems/minigl){:target="_blank"}{:rel="noopener noreferrer"}).

## Comentários finais

E por enquanto é isso, colegas! O código de Super Bombinhas guarda ainda muitos outros trechos dignos de menção, mas é muita coisa para colocar num post de blog... Afinal, foram anos dedicados a desenvolvê-lo, e o resultado final é bastante rico em conteúdo. Confira você mesmo [baixando o jogo](https://victords.itch.io/super-bombinhas){:target="_blank"}{:rel="noopener noreferrer"} ou [comprando na Steam](https://store.steampowered.com/app/1553840){:target="_blank"}{:rel="noopener noreferrer"}. E, após explorar mais do jogo em si, lembre-se de que o código estará sempre à sua disposição para descobrir como uma certa mecânica foi implementada.

Bom divertimento/desenvolvimento!

---

<span class="previous-post">[Parte 6 <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({% link _posts/2019-07-06-desenvolvendo-games-com-ruby-e-minigl-parte-6.md %})</span>
