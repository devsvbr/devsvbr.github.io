---
pubid: "post-minigl-1"
langvisible: true
lang: en
comments: true
title: "Part 1 - Preparing the environment"
description: "How to setup a development environment for games with the Ruby language and the MiniGL library."
series: "Developing games with Ruby and MiniGL"
date: 2019-05-27 10:00:00 -0300
author: Victor David Santos
categories: [ruby, minigl]
---
Hello, dear readers. Welcome to this new series of posts about game development! More specifically, we will talk about game development with the Ruby programming language and the MiniGL library - created by me. :)

For those who don't know, Ruby is an interpreted language, strongly object-oriented, and focused in a friendly syntax, easy readability, and generally offering multiple ways of doing things, granting freedom for the programmer. To learn more about the language and its philosophy, visit the [official website](https://www.ruby-lang.org/en/).

The objective of these posts will be to show how it is possible to build a 2D game really fast using Ruby and the MiniGL library. In order for us to dive into the subject, we won't teach the Ruby language from the basics, but I will explain the concepts as the code shows up. If you're a programmer of any other object-oriented programming language, it won't be hard to keep up. :)

## Preparing the environment

Let's start from the beginning: how to make your computer ready to work with Ruby and MiniGL. Well, that depends on the operating system you use.

### Linux

If you use Linux (and if you don't, I recommend trying it ;)), the process will consist of three steps.

#### 1) Installing Ruby

Many Linux distributions already ship with some Ruby version. However, the system version has the disadvantage of requiring a super user to run commands, like installing libraries (called "gems" in the Ruby ecosystem). So, we will create a local user installation using RVM - Ruby Version Manager.

Open a terminal and run the following commands:

```bash
gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash -s stable
```

After the second command completes, a script will be generated and its path will be displayed in the output. The next step is to run that script:

```bash
source <path of the generated script>
```

The Ruby interpreter will then be compiled, optimized for your machine and operating system. After the execution, Ruby will be installed for your user. However, if you run the "ruby" command now, it will still be referencing the system version. To change that, you can either change your terminal's configuration to "run as a login shell", or run the following command every time before using Ruby:

```bash
source ~/.bash_profile
```

Done! Now, reopen the terminal, if you chose to change the configuration, and run the "irb" command. This is a quick way of testing the Ruby installation, by running Ruby commands in the terminal itself. Inside the irb prompt, run:

```bash
puts 'Hello, world!'
```

The phrase "Hello, world!" must be printed to the output. If that is the case, the Ruby installation is working. To exit "irb", use Ctrl+D or "exit".

#### 2) Installing MiniGL's dependencies

The MiniGL library (or "gem") utilizes another library as foundation, called Gosu, which depends on some native libraries. In Debian-based distributions (like Ubuntu or Linux Mint), you can install these with the following command:

```bash
sudo apt-get install build-essential libsdl2-dev libsdl2-ttf-dev libpango1.0-dev libgl1-mesa-dev libopenal-dev libsndfile-dev libmpg123-dev libgmp-dev
```

For other distributions, you can find instructions [here](https://github.com/gosu/gosu/wiki/Getting-Started-on-Linux).

With the dependencies installed, run:

```bash
gem install gosu
```

The "gem install" command is responsible for installing Ruby libraries.

#### 3) Installing MiniGL

If the Gosu library installation worked, to install MiniGL you will only need a single additional command:

```bash
gem install minigl
```

And that's it! Your Linux environment is configured. :)

### Windows

Now, if you use Windows, the steps are as follows:

#### 1) Installing Ruby

Install Ruby using RubyInstaller. Download the latest version [here](https://rubyinstaller.org/downloads/) and run the installer, which is a classic "next, next, finish" wizard. You can keep all the defaults.

After the installation completes, open the command prompt and run "irb" to validate the installation.

#### 2) Installing MiniGL

When everyrhing is set and done, run the following in the command prompt:

```bash
gem install minigl
```

This will install the Gosu library (dependency) and MiniGL after that. When this command completes, your environment will be set up.

## Writing a MiniGL program

With your environment prepared, open up your favorite text editor and let's create our first MiniGL program!

The first step is to reference the library:

```ruby
require 'minigl'
```

After that, we reference the main namespace so that we can use the classes provided by the library by their names:

```ruby
include MiniGL
```

Then, let's create a class that will represent the game window.

```ruby
class MyGame < GameWindow
  # code here...
end
```

For those who are not familiarized with Ruby, the code above declares a class named "MyGame" inheriting the "GameWindow" class (defined by MiniGL).

Let's define the constructor of this class, in order to initialize the window:

```ruby
class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'My First Game'
  end
end
```

The keyword "def" is used to declare methods. The "initialize" method has special meaning, corresponding to the class's constructor.

The call to "super" is a call to the superclass's constructor. The parameters provided are the width of the window, the height, and a boolean indicating whether the window should be full screen. In Ruby, the parameters passed in a method call don't need to be delimited by parentheses.

Lastly, "self.caption = 'My First Game'" is defining the window title.

Once defined the class and its constructor, let's open the window:

```ruby
MyGame.new.show
```

Here, "MyGame.new" is how you instantiate the MyGame class. From this instance, we call the "show" method, which effectively shows the window.

The final code should look like this:

```ruby
require 'minigl'
include MiniGL

class MyGame < GameWindow
  def initialize
    super 800, 600, false
    self.caption = 'My First Game'
  end
end

MyGame.new.show
```

Now, save the file as "game.rb", open the terminal or command prompt, navigate to the folder where you saved it using "cd", and run:

```bash
ruby game.rb
```

A 800 pixels wide and 600 pixels high window, filled with black, should open. If that happens, it means MiniGL is working and you're ready to start developing games!

That's all for today. Don't miss the next post of the series, when we will begin programming a game, for real.

See ya!

---

<span class="next-post">[<img class="icon32" src="{{ "/img/icons/arrow.svg" | prepend: site.baseurl }}" alt="(próximo)"> Part 2]({% link _posts/2019-05-28-developing-games-with-ruby-and-minigl-part-2.md %})</span>
