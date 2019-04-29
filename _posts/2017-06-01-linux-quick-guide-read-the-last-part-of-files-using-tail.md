---
layout: post
pubid: "post-guia-linux-tail"
lang: en
langvisible: true
comments: true
series: "Linux Quick Guide"
title: "Read the last part of files using tail"
description: "Quick guide on using tail to read the last few lines of files."
date: 2017-06-01 18:15:00 -0300
author: Eric Yuzo
categories: [linux, shell]
---
The `tail` command allows you to take a look at the last few lines of a file:

```bash
tail [FILE]
```

Here is an example:

![image showing basic use of tail]({{ "/img/posts/2017-06-01-tail.png" | prepend: site.baseurl }})

We can see the last 10 lines of the file [linhas.txt]({{ "/downloads/2017/06/01/linhas.txt" | prepend: site.baseurl }}). This is the default behaviour of the `tail` command.

If it is desired to read a number of lines other than 10, the `-n` option can be used to specify the number of lines to output:

![image showing tail with -n option]({{ "/img/posts/2017-06-01-tail-n.png" | prepend: site.baseurl }})

Using `-n 5` option, `tail` displays only the last 5 lines from the file.

### Learn more.

Most of modern Linux distributions allows you to omit the `n` when using the `-n` option.

For example:

![image showing tail with -NUMBER option]({{ "/img/posts/2017-06-01-tail-numero.png" | prepend: site.baseurl }})

Notice that `tail -5` has the same effect of `tail -n 5`.

#### How to read a file starting with a specified line number.

If we place a `+` just before the number when using `-n` option, `tail` will begin printing from the specified line number:

![image showing tail with -n option to start from a specified line number]({{ "/img/posts/2017-06-01-tail-n-numero.png" | prepend: site.baseurl }})

The previous command `tail -n +5` returned the content of file starting with the 5th line.

I use `tail` this way when I want to remove the header line of a CSV file. When the first line of a CSV file is the header line, I can remove it using `tail -n +2 file.csv`, which will output the content of file starting with the 2nd line.
