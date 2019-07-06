---
pubid: "post-minigl-6"
comments: true
lang: en
langvisible: true
title: "Part 6 - physics-based movement"
description: "Transforming our maze game into a platformer!"
series: "Developing games with Ruby and MiniGL"
date: 2019-07-06 17:00:00 -0300
author: Victor David Santos
categories: [ruby, minigl]
---
Hello my friends! I apologize for the hiatus, I have had some really rushed days lately - changed my job, now I work at a game development company! -, but we're back!

In today's post, we'll go back to talking about movement, but now exploring the other kind of movement provided by the `GameObject` class, as promised in [part 3]({% link _posts/2019-06-03-developing-games-with-ruby-and-minigl-part-3.md %}): forces and physics-based movement!

Basically, the idea is that, instead of passing a fixed velocity for the object to move, we will pass a vector with the forces that are acting on the object, and the library will calculate the resulting speed. The result is smoother movement, bringing the sensation of acceleration and deacceleration. Moreover, the object will now be affected by gravity, falling when there's nothing solid below.

Let's take the "game.rb" file as it was left by the end of the [last post]({% link _posts/2019-06-14-developing-games-with-ruby-and-minigl-part-5.md %}), and proceed to the first changes:

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

We made a small modification of the physical size of the face, now with 90 pixels of height, so that it precisely touches the ground. Furthermore, we're defining the maximum speeds in each direction (changing the `x` and `y` coordinates of the `max_speed` vector). These numbers (and others we'll see later) are the result of many tests for calibration of the movement; it is necessary that you try many different values, making small adjustments each time, until you reach a balanced and smooth movement.

The kind of movement we want to achieve doesn't fit well in a maze game, but it does fit in a platformer, for example. Thus, let's adjust the map so that it allows us to better explore these movements:

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

Save the content above to the "level.txt" file (overwrite the one from the last post). Now, let's also adjust the loading of the map:

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

Note that we defined the constants `TILES_X` and `TILES_Y` for the amount of tiles (or grid cells) in the horizontal and vertical axes, respectively, because these values are used more than once. Then, we redefined the tile counts of the map and also the amount of columns and rows of the walls matrix.

Now, let's head to what really matters for today's goal: the movement logic. Find in the "game.rb" file, inside the `update` method, the block below:

```ruby
v = Vector.new(0, 0)
v.x += 3 if KB.key_down?(Gosu::KB_RIGHT)
v.x -= 3 if KB.key_down?(Gosu::KB_LEFT)
v.y += 3 if KB.key_down?(Gosu::KB_DOWN)
v.y -= 3 if KB.key_down?(Gosu::KB_UP)
```

And replace it with this:

```ruby
v = Vector.new(0, 0)
v.x += 1.5 if KB.key_down?(Gosu::KB_RIGHT)
v.x -= 1.5 if KB.key_down?(Gosu::KB_LEFT)
if @sprite.bottom
  v.y -= 15 + 0.7 * @sprite.speed.x.abs if KB.key_down?(Gosu::KB_UP)
  v.x -= 0.15 * @sprite.speed.x
end
```

Let's analyse the changes one by one:
* For the horizontal movement (second and third lines), we only adjusted the value from 3 to 1.5. This value will now represent the force applied in the horizontal, i.e., an acceleration. If the value is too high, the object will reach really high speeds really shortly (the acceleration is applied every frame, i.e., around 60 times a second).
* For the vertical, there are more changes. First, we no longer change the y coordinate of the vector when the down arrow is pressed, because downwards movement will be handled by gravity. Second, we only apply forces vertically (upwards) when the object is on the floor (indicated by the test `@sprite.bottom`, where `bottom` returns the object that is colliding with `@sprite` from below, if any). The calculation of the upwards force is given by `15 + 0.7 * @sprite.speed.x.abs`, which is a constant (15) added to a variable factor bound to the horizontal speed (`@sprite.speed.x`). The effect of this calculation is that the face will jump higher when it is moving faster.
* Lastly, also only when the object is on the ground (`if @sprite.bottom`), we apply a horizontal force that opposes the horizontal speed (`v.x -= 0.15 * @sprite.speed.x`), imitating the effect of friction. This will allow for the object to stop moments after we release the move key.

Now, all that's left is to remove the last parameter from the call to the `move` method of the object (by not passing the argument, it assumes the default value `false`, indicating that the vector we're passing in is a forces vector and not a speed vector):

```ruby
...
    def update
      ...
      @sprite.move(v, coll_walls, [])
    end
...
```

And that's all! Try running the game and see if you can make it to the goal. :)

![forces-based movement]({{ "/img/posts/2019-07-06-gif.gif" | prepend: site.baseurl }})

(please forgive the text in portuguese in the end, I just didn't want to re-record the gameplay just for that) :P

And here's today's complete "game.rb":

```ruby
require 'minigl'
include MiniGL

class MyGame < GameWindow
  TILES_X = 45
  TILES_Y = 10

  def initialize
    super 800, 600, false
    self.caption = 'My First Game'
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
    font = Res.font :font, 48
    @text_helper = TextHelper.new(font)
    font2 = Res.font :font, 20
    @button = Button.new(325, 330, font2, 'Play again', :button) do
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
      @text_helper.write_line 'You won!', 400, 276, :center, 0xffff00, 255, :border, 0x000000, 2
      @button.draw
    end
  end
end

MyGame.new.show
```

That's all for today, colleagues. See ya (hopefully not long from now)!

---

<span class="previous-post">[Part 5 <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({% link _posts/2019-06-14-developing-games-with-ruby-and-minigl-part-5.md %})</span>
