---
layout: page
title: Quem Somos?
icon: /img/about.png
menu: true
permalink: /about/
---

Somos um grupo de desenvolvedores de software interessados em escrever sobre diversos assuntos ligados a área de tecnologia.

A ideia de escrever um blog surgiu enquanto frequentávamos o curso técnico em informática na cidade de São Vicente, litoral de São Paulo (daí o nome *DevSV*). Assim que concluimos o curso, começamos a postar conteúdo em um blog [WordPress](https://devsv.wordpress.com/).

Agora, após um período de hiatus, estamos de volta ao jogo e com "estádio" próprio.

<h2 class="about-topic">Legal, mas quem são os indivíduos do DevSV?</h2>

{% for member in site.data.members %}

  <h3 class="about-topic">{{ member.name }}</h3>

  <p>
    {% for link in member.links %}
    <span>
      <a class="icon" href="{{ link.url }}">
        <img src="{{ link.icon | prepend: site.baseurl }}" alt="{{ link.title }}" title="{{ link.title }}">
      </a>
    </span>
    {% endfor %}
  </p>

  {{ member.resume }}

{% endfor %}
