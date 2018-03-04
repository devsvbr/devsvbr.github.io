---
layout: post
comments: true
title: "Instalando VirtualBox Guest Additions em uma máquina virtual Debian 9"
description: "Como instalar VirtualBox Guest Additions em uma máquina virtual Debian 9 (Stretch)."
date: 2017-10-09 14:40:00 -0300
author: Eric Yuzo
categories: [vbox]
---
Até o Debian 8 (Jessie), era possível instalar o pacote `virtualbox-guest-dkms` para fazer o papel do *VirtualBox Guest Additions* em uma máquina virtual com *guest* Debian no [VirtualBox](https://www.virtualbox.org/). Entretanto, no Debian 9 (Stretch) os pacotes do VirtualBox não estão mais presentes no repositório *stable*. Sendo assim, podemos fazer a instalação via [backports](https://backports.debian.org/Instructions/) ou da maneira tradicional via imagem disponibilizada pelo VirtualBox. Neste post mostrarei como fazer a instalação da maneira tradicional.

## Por que preciso do VirtualBox Guest Additions?

Antes de partir pra instalação, é interessante entender um pouco sobre o porquê de instalar o Guest Additions.

Os pacotes do Guest Additions são instalados no sistema operacional convidado (*guest*), afim de oferecer uma implementação virtual dos drivers de dispositivos do computador e recursos extras para melhorar a experiência do usuário. Dentre os recursos, eu destaco:

* suporte de vídeo melhorado: ajuste automático da resolução para preencher corretamente o espaço disponível na tela; melhor suporte à aceleração de vídeo;

* acesso à pastas compartilhadas no *host*;

* área de transferência (*clipboard*) compartilhada.

Além de outros recursos. Para saber mais, confira o [manual](https://www.virtualbox.org/manual/ch04.html) do VirtualBox.

## Instalação do Guest Additions.

A instalação pode ser dividida em 2 fases, que consistem na preparação do sistema (pré-requisitos) e a instalação do Guest Additions propriamente dita.

### Preparando os pré-requisitos.

Abra um terminal no *guest* e execute os passos a seguir:

1- O primeiro passo é alternar para o usuário `root`:

```bash
su -
```

2- Já como `root`, atualizar a lista de pacotes apt:

```bash
apt-get update
```

3- Atualizar os pacotes do sistema (importante principalmente para atualização dos pacotes de segurança):

```bash
apt-get upgrade
```

4- Em seguida, instalar pacotes úteis para a construção dos módulos de kernel do VirtualBox:

```bash
apt-get install build-essential module-assistant
```

* O pacote `build-essential` traz, em sua lista de dependências, pacotes essenciais para a construção de softwares, como o `gcc`, `make`, além de diversas bibliotecas e headers.

* O `module-assistant` é uma ferramenta muito útil, feita para facilitar a construção de módulos de kernel. Com ela, deixaremos o ambiente pronto para que o instalador do Guest Additions consiga compilar todos os módulos corretamente.

5- Preparar o ambiente com o `module-assistant`:

```bash
m-a prepare
```

* Este comando faz com que o module-assistant baixe os headers correspondentes ao kernel da máquina e ferramentas essenciais (build-essential). É muito importante que este passo seja executado com sucesso.

### Instalando o Guest Additions.

O primeiro passo é inserir a ISO (Imagem de disco) do Guest Additions na máquina virtual. Para isso acesse o menu `Devices` > `Insert Guest Additions CD Image...`.

![imagem mostrando a opção de menu para inserir ISO do Guest Additions]({{ "/img/posts/2017-10-09-insert-guest-additions-iso.png" | prepend: site.baseurl }})

*P.S.*: na versão em português, o caminho é: `Dispositivos` > `Inserir imagem de CD dos Adicionais para Convidado...`.

Neste passo, caso a imagem de disco não esteja presente no seu sistema, o VirtualBox pergutará se deve fazer o download da imagem. Basta confirmar, que o download será feito automaticamente.

Com a imagem devidamente inserida no drive virtual, o Debian reconhecerá a mídia e perguntará o que deve ser feito. Como executaremos o instalador manualmente via terminal, podemos pedir para que não faça nada.

![imagem mostrando a tela de reconhecimento de mídia do Debian]({{ "/img/posts/2017-10-09-do-nothing-iso.png" | prepend: site.baseurl }})

O Debian monta a mídia no diretório `/media/cdrom`. Ela contém, entre outros arquivos, um script chamado `VBoxLinuxAdditions.run`, que executaremos no terminal (como `root`):

```bash
sh /media/cdrom/VBoxLinuxAdditions.run
```

A saída deve ser parecida com a imagem:

![imagem mostrando o output da instalação do Guest Additions]({{ "/img/posts/2017-10-09-instalacao-guest-additions.png" | prepend: site.baseurl }})

Agora basta reiniciar a máquina virtual para que os novos módulos de kernel sejam carregados e tudo OK! =)

## Minha instalação falhou! E agora?

Caso tenha ocorrido algum erro ao executar o script `VBoxLinuxAdditions.run`, certifique-se de ter executado os passos dos pré-requisitos. Lembre-se que é muito importante que o comando `m-a prepare` seja executado com sucesso, pois é ele quem vai preparar o terreno para o VirtualBox compilar os módulos de kernel.

Caso não haja nenhum problema com os pré-requisitos, verifique se sua instalação do VirtualBox está atualizada. Se não estiver, instale a versão mais recente (versão 5.0 pra cima). Algumas instalações mais antigas do VirtualBox estavam mesmo apresentando problemas para reconhecer os headers do kernel.

Se os pré-requisitos estiverem OK e o VirtualBox atualizado, é preciso investigar melhor a causa do erro. Para isso, dê uma olhada no log da instalação, que é salvo no arquivo `/var/log/vboxadd-install.log`. Use as informações do log para buscar uma solução no Google ou pedir ajuda em um fórum.
