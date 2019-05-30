---
pubid: "post-guia-linux-wc"
lang: en
langvisible: true
comments: true
series: "Linux Quick Guide"
title: "Counting lines using wc"
description: "Quick guide on using wc to compute the number of lines in files."
date: 2017-05-31 14:44:00 -0300
author: Eric Yuzo
categories: [linux, shell]
---
The `wc` command is used to compute the number of lines in a file:

```bash
wc -l [FILE]
```

Here is an example:

![image showing basic usage of wc -l]({{ "/img/posts/2017-05-31-wc-l.png" | prepend: site.baseurl }})

In the example above, the command `wc -l` tells us that the file `populacao-ibge.csv` has 5571 lines.

### Learn more.

The name `wc` stands for **word count** and it is used to find out number of lines, word count and number of bytes in the specified file.

We can use some options to specify what type of counting we want to be printed:

- `-l`: print the number of lines;
- `-w`: print the word count;
- `-c`: print the number of bytes.

For example:

![image showing the use of wc options]({{ "/img/posts/2017-05-31-wc-param.png" | prepend: site.baseurl }})

#### Curious fact.

We use the option `-l` (line) to count lines and we use `-w` (word) to count words. However, we use `-c` to count bytes. Do you know why?

At the creation of `wc` program, the `-c` was in fact used to count characters, since at that time the character encondings used to represent any character using only 1 byte. However, some modern encodings may use more than 1 byte to represent a single character. Therefore, we say that `-c` is used to count bytes.

Now we have a question: is there a way to compute the number of characters in a file?

Yes, it is! You can get the real character count of a file using `-m`, which stands for **multibyte**.
