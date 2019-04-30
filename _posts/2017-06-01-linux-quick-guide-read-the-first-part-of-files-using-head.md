---
pubid: "post-guia-linux-head"
lang: en
langvisible: true
comments: true
series: "Linux Quick Guide"
title: "Read the first part of files using head"
description: "Quick guide on using head to read the first few lines of files."
date: 2017-06-01 12:38:00 -0300
author: Eric Yuzo
categories: [linux, shell]
---
The `head` command allows you to take a look at the first few lines of a file:

```bash
head [FILE]
```

Here is an example:

![image showing basic use of head]({{ "/img/posts/2017-06-01-head.png" | prepend: site.baseurl }})

We can see the first 10 lines of the file [linhas.txt]({{ "/downloads/2017/06/01/linhas.txt" | prepend: site.baseurl }}). This is the default behaviour of the `head` command.

If it is desired to read a number of lines other than 10, the `-n` option can be used to specify the number of lines to output:

![image showing head with -n option]({{ "/img/posts/2017-06-01-head-n.png" | prepend: site.baseurl }})

Using `-n 5` option, `head` displays only the first 5 lines from the file.

### Learn more.

Most of modern Linux distributions allows you to omit the `n` when using the `-n` option.

For example:

![image showing head with -NUMBER option]({{ "/img/posts/2017-06-01-head-numero.png" | prepend: site.baseurl }})

Notice that `head -5` has the same effect of `head -n 5`.

#### How to read a file skipping the last few lines.

If we place a `-` just before the number when using `-n` option, `head` will print all but the last N lines of the file:

![image showing head with -n option for excluding the last lines]({{ "/img/posts/2017-06-01-head-n-numero.png" | prepend: site.baseurl }})

The previous command `head -n -5` returned 15 of the 20 lines of [linhas.txt]({{ "/downloads/2017/06/01/linhas.txt" | prepend: site.baseurl }}). In other words, `head` displayed all but the last 5 lines of the file.
