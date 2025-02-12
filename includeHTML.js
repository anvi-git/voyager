// filepath: /Users/anvi/backyard_thoughts/includeHTML.js
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          elmnt.removeAttribute("include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  includeHTML(); // Ensure includeHTML is called first to load the header

  // Wait for the header to be included before setting the link
  setTimeout(function() {
    var siteTitleLink = document.getElementById("site-title-link");
    if (siteTitleLink) {
      siteTitleLink.addEventListener("click", function(event) {
        event.preventDefault();
        if (window.location.pathname !== "/index.html") {
          window.location.href = "index.html";
        }
      });
    } else {
      console.error("Element with id 'site-title-link' not found.");
    }
  }, 100); // Adjust the timeout as needed
});


document.addEventListener('DOMContentLoaded', function() {
  const musicEmbedders = document.querySelectorAll('.music-embedder');

  musicEmbedders.forEach(embedder => {
    const appleMusicUrl = embedder.getAttribute('data-apple-music-url');
    const spotifyUrl = embedder.getAttribute('data-spotify-url');

    const appleMusicIframe = document.createElement('iframe');
    appleMusicIframe.setAttribute('allow', 'autoplay *; encrypted-media *;');
    appleMusicIframe.setAttribute('frameborder', '0');
    appleMusicIframe.setAttribute('height', '360');
    appleMusicIframe.setAttribute('style', 'width:60%;max-width:660px;overflow:hidden;background:transparent;border-radius:12px;margin-bottom:20px;');
    appleMusicIframe.setAttribute('sandbox', 'allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation');
    appleMusicIframe.setAttribute('src', appleMusicUrl);

    const spotifyIframe = document.createElement('iframe');
    spotifyIframe.setAttribute('style', 'border-radius:12px;width:60%;height:360px;');
    spotifyIframe.setAttribute('src', spotifyUrl);
    spotifyIframe.setAttribute('frameborder', '0');
    spotifyIframe.setAttribute('allowfullscreen', '');
    spotifyIframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    spotifyIframe.setAttribute('loading', 'lazy');

    embedder.appendChild(appleMusicIframe);
    embedder.appendChild(document.createElement('br'));
    embedder.appendChild(spotifyIframe);
  });
});