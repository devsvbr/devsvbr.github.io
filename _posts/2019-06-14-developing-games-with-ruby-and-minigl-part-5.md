---
pubid: "post-minigl-5"
comments: true
langvisible: true
lang: en
title: "Part 5 - cameras and maps"
description: "Exploring the camera/viewport control features and creation of maps and grids."
series: "Developing games with Ruby and MiniGL"
date: 2019-06-11 08:08:00 -0300
author: Victor David Santos
categories: [ruby, minigl]
---
Hello and welcome! Let's continue our exploration of the MiniGL library. Today our focus will be the camera (or viewport) control and the creation of maps/grids.

It is very common that the "scenario" or "world" where the player's actions happen doesn't fit the game screen, so that the player unveils new areas as it moves around, for example. The part of the scenario that is visible on the screen can be called viewport. The component that controls the viewport is usually called a camera.

MiniGL offers the `Map` class, which aims at representing the "map", i.e., the whole space of the scenario, and that encapsulates the camera control. Furthermore, this class makes it easy to create scenarios based in grids or tiles - very common in older platformer games or top-down view games. Let's use this class to expand our maze game, creating a _real_ maze this time!

For that purpose we'll need to change quite a few things in the "game.rb" file. First, in the constructor:

```ruby
...
class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'My First Game'
    @sprite = GameObject.new(10, 10, 80, 80, :face, Vector.new(-10, -10), 2, 3)
    @blinking = false
    @walls = []
    @goal = GameObject.new(640, 480, 50, 50, :goal, Vector.new(-17, -17))
    
    @map = Map.new(100, 100, 20, 20)
    
    @finished = false
    font = Res.font :font, 48
    @text_helper = TextHelper.new(font)
    font2 = Res.font :font, 20
    @button = Button.new(325, 330, font2, 'Play again', :button) do
      @finished = false
      @sprite.x = @sprite.y = 10
    end
  end
end
...
```

The changes were:
* We changed the physical size of the `@sprite` object (which represents the "face") and used a non-zero _image gap_, in order to improve the navigation inside the maze.
* We now declare the `@walls` as an empty list, because, using a grid map, we'll initialize the walls in a different, less "manual" way (stay tuned to find out how!).
* We initialize a map, `@map`, where the first two parameters (100 and 100) are the width and height of each grid "cell" (or tile), and the two following are the column and row count of the grid.

The `Map` constructor accepts some more parameters, which we won't use here, but are worth mentioning:
* The fifth and sixth parameters allow specifying the screen size in case it's not the default (800 by 600).
* The seventh parameter is a boolean indicating if the map should be isometric (false by default). In an isometric map, the grid axes are not parallel to the screen axes. To understand this better, you can run one of the test games that come with MiniGL. Find the path where it's installed (on Windows, it should be something like `C:\Ruby<version>\lib\ruby\gems\<version>\gems\minigl-<version>`; on Linux with RVM, `/home/<your user>/.rvm/gems/ruby<version>/gems/minigl-<version>`), navigate to this folder in the terminal/command prompt and execute `ruby test/iso_game.rb` (move the mouse and arrow keys).

![isometric map]({{ "/img/posts/2019-06-14-iso.png" | prepend: site.baseurl }})

* Lastly, the eighth parameter is also a boolean, indicating whether the camera should respect the limits of the map, i.e., can never be positioned outside of it, so that the viewport always shows some part of the map. This is true by default, and will likely be left that way 99% of times.

Ok, we created the map but are not really using it. To make it useful, we must define the positioning of all objects in terms of the grid it represents. Instead of setting x and y coordinates directly for each object, we will use column and row indices and cell sizes to calculate the positions of the walls, character and goal. One of the advantages of this approach is that we can easily visually represent the map with a text file:

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

In the scheme above, if we consider each `#` as a wall, `@` as the player and `!` as the exit, we can easily see the paths in the maze. Saving this to a file and reading this file upon loading the game, we can define the positions of the objects without specifying them one by one. Let's do that. Let's save the text above to a "level.txt" file in the same folder as "game.rb" and load our map from it:

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

The `File.open` method opens the file for reading and the block receives an object representing the file (`f`). The `each_line` method provides an enumerator for the lines of the file, from which we can call `with_index` to run a code block for each line, receiving both the line and its index as parameters. We use the same logic when calling `each_char` followed by `with_index`, traversing each character, also having access to its index. `i` will be the column index and `j` the row index, so that we will use these to calculate the x and y coordinates of the objects, respectively. We test the character and, if it's a `#`, we add a wall to the walls list; if it's a `@`, we set the position of the "face" to the corresponding row and column (we add 10 to each coordinate to center the object in the cell, since it has 80 by 80 physical size); if it's a `!`, we set the position of the `@goal`, using the same rationale. We also store the starting position of the player in the `@start_x` and `@start_y` variables, to be able to adjust our 'play again' button's action:

```ruby
...
@button = Button.new(325, 330, font2, 'Play again', :button) do
  @finished = false
  @sprite.x = @start_x
  @sprite.y = @start_y
end
...
```

If you run the game now, you will already see the top-left corner of the new maze correctly appearing, but if you try to reach the goal you will probably fail, because the rest of the maze and the goal itself are outside the viewport. It is now that the map will really shine: let's update the camera using the player as reference, and use this camera as reference to draw the objects.

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

Done! In `update`, we update the camera to center it in the player's position (for that, we subtract from its position half the screen size subtracted of half its physical size) with the `set_camera` method. In `draw`, we simply pass the map as parameter to the `draw` method of the GameObjects; for the walls, as they are not GameObjects, we have to "manually" indicate the use of the camera, but that's also simple - it's enough to subtract `@map.cam.x` from each x coordinate and `@map.cam.y` from each y coordinate of the square that's drawn to represent the wall.

Try running the game now and reaching the goal. Actually challenging now, right? You can change the layout of the maze at will by changing the "level.txt" file, and run the game again without any changes in the code to test other mazes too. :)

![traversing the maze]({{ "/img/posts/2019-06-14-gif.gif" | prepend: site.baseurl }})

There's just another detail we left off, because in this example it's not perceptible. Although we only ever see in the screen a small part of the world, this can be way larger and, in the way the game is currently coded, it will try to draw and check collision with every wall, every frame. In a very large scenario, with lots of objets, this could lead to severe performance loss. To avoid that, we will use the grid approach also to determine which walls will be checked for collision and which ones will be drawn. Firstly, when loading the map, let's populate a walls matrix, indexed by the columns and rows of the map:

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

The line `@walls_matrix = Array.new(20) { Array.new(20) { nil } }` is creating an array of 20 positions initially filled with arrays of 20 positions, initially filled with `nil` - that's our 20 by 20 matrix. Now inside the `case char` for `#`, we're creating the Block, assigning it to `@walls_matrix[i][j]` and then adding it to the list.

Now let's adjust the collision checking:

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

We're building a new list of objects for collision checking (`coll_walls`) instead of using the complete list (`@walls`). To do that, we first obtain the character's position in the grid, by dividing its coordinates by the size of the cells (`c_i = @sprite.x.to_i / 100` and `c_j = @sprite.y.to_i / 100`), and after that we traverse the interval of cells which comprehends 2 columns to the left and to the right (`(c_i-2)..(c_i+2)`) and 2 rows above and below (`(c_j-2)..(c_j+2)`). For each cell in this area, we add the wall at that position to the `coll_walls` list, if there's any. The tests `if i >= 0 && j >= 0 && @walls_matrix[i] && ...` protect us from edge cases, where the `i` and `j` variables can assume negative values or values above the size of the arrays, which would lead to errors when accessing `@walls_matrix[i][j]`.

Lastly, we'll adjust the wall drawing logic:

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

We're no longer traversing the complete list of walls to draw. Instead, we use the `foreach` method of the map, which allows the execution of a code block for each cell of the grid **that's currently inside the viewport**. The block receives the column and row indices (i and j) and the x and y coordinates of the cell on the screen. Thus, if there's a wall in the position `[i][j]` of the matrix, we use the given x and y to define the coordinates of the corners of the square, and no longer need to subtract the camera coordinates explicitly.

You can run the game again now and there should be no visible change. However, if you created a map with a really big number of walls and run it with the previous code, and then with this one, you'd certainly see _framerate_ differences.

Here's today's full code:

```ruby
require 'minigl'
include MiniGL

class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'My First Game'
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
    font = Res.font :font, 48
    @text_helper = TextHelper.new(font)
    font2 = Res.font :font, 20
    @button = Button.new(325, 330, font2, 'Play again', :button) do
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
      @text_helper.write_line 'You won!', 400, 276, :center, 0xffff00, 255, :border, 0x000000, 2
      @button.draw
    end
  end
end

MyGame.new.show
```

That's all for today, people. See you!

---

<span class="previous-post">[Part 4 <img class="icon32 flipped" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(anterior)">]({% link _posts/2019-06-07-developing-games-with-ruby-and-minigl-part-4.md %})</span>
