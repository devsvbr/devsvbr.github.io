---
layout: page
title: Quem Somos?
description: Saiba mais sobre o DevSV e as pessoas que fazem as coisas acontecerem.
menu: true
permalink: /about/
---

O DevSV nasceu no fim de 2010, a partir da iniciativa de alguns nerds recém formados no curso técnico em informática na [ETEC](http://etecdrc.com.br/) de São Vicente.

A ideia era criar um blog onde pudéssemos escrever sobre assuntos que gostamos, principalmente na área de tecnologia e desenvolvimento de software.

Uma das passagens mais marcantes, foi a decisão do nome do blog. Conversa vai e conversa vem, o Chico lança uma sugestão: os **Nice Guys**. Hahaha! Esse nome é piadinha interna até hoje. Felizmente o Victor teve a bela sacada de chamar o blog de DevSV, uma vez que éramos todos desenvolvedores de São Vicente.

Com o nome escolhido, criamos um blog no [WordPress](https://devsv.wordpress.com/), que está online até hoje. A partir daí, seguimos nossa vida publicando posts esporádicos, conforme o tempo livre nos permite. =)

Finalmente, depois de um tempo no WordPress, resolvemos mudar de endereço e trazer o blog pro [Github Pages](https://pages.github.com/). E aqui estamos, com a mesma ideia de escrever sobre assuntos que gostamos.

Mas o DevSV não seria nada sem as pessoas que formam a equipe. Bora conhecer um pouco sobre as peças do DevSV?

<h2 class="about-topic">Equipe</h2>

<ul class="members">
  {% for member in site.data.members %}<li class="member">
      <div class="member-picture"><img src="{{ member.picture | prepend: site.baseurl }}" alt="Autor {{ member.name }}"></div>
      <div class="member-info">
        <h3>{{ member.name }}</h3>
        <ul class="social">{% for link in member.links %}<li><a href="{{ link.url }}"><svg><use xlink:href="{{ site.baseurl }}/img/icons/footer.svg#{{ link.class }}" /></svg></a></li>{% endfor %}</ul>
        <p class="resume">{{ member.resume }}</p>
      </div>
    </li>{% endfor %}
</ul>
