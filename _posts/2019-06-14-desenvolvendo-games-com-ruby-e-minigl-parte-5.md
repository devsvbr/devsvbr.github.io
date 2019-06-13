---
pubid: "post-minigl-5"
comments: true
langvisible: true
title: "Parte 5 - mapas e câmeras"
description: "Explorando as funcionalidades de controle de câmera/viewport e a criação de mapas e grids."
series: "Desenvolvendo games com Ruby e MiniGL"
date: 2019-06-11 08:00:00 -0300
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
    
  end
end
...
```

---

<span class="previous-post">[Parte 4 <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({% link _posts/2019-06-07-desenvolvendo-games-com-ruby-e-minigl-parte-4.md %})</span>
