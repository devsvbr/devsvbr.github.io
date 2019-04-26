var host = "devsv.com.br"
if (window.location.host.indexOf(host) >= 0 && window.location.protocol != "https:") {
  window.location.protocol = "https"
}

