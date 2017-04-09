---
layout: page
title: Quem Somos?
icon: /img/nav/about.svg
menu: true
permalink: /about/
---

Somos um grupo de desenvolvedores de software interessados em escrever sobre diversos assuntos ligados a área de tecnologia.

A ideia de escrever um blog surgiu enquanto frequentávamos o curso técnico em informática na cidade de São Vicente, litoral de São Paulo (daí o nome *DevSV*). Assim que concluimos o curso, começamos a postar conteúdo em um blog [WordPress](https://devsv.wordpress.com/).

Agora, após um período de hiatus, estamos de volta ao jogo e com "estádio" próprio.

<h2 class="about-topic">Equipe</h2>

<ul class="members">
  {% for member in site.data.members %}
    <li class="member">
      <div class="member-picture col-sm-2">
        <img class="img-circle" src="{{ member.picture | prepend: site.baseurl }}" alt="Autor {{ member.name }}">
      </div>
      <div class="member-info col-md-8 col-sm-10">
        <h3>{{ member.name }}</h3>
        <ul class="social">
          {% for link in member.links %}
            <li>
              <a class="{{ link.class }}" href="{{ link.url }}">{{ link.title }}</a>
            </li>
          {% endfor %}
        </ul>
        <p class="resume">{{ member.resume }}</p>
      </div>
    </li>
  {% endfor %}
</ul>
