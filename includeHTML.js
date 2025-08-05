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
  const iframeTemplates = document.querySelectorAll('.iframe-template');

  iframeTemplates.forEach(template => {
    const url = template.getAttribute('data-url');
    const iframe = document.createElement('iframe');
    iframe.setAttribute('allow', 'autoplay *; encrypted-media *;');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('height', '460');
    iframe.setAttribute('style', 'width:60%;max-width:660px;overflow:hidden;background:transparent;border-radius:12px;margin-bottom:20px;');
    iframe.setAttribute('sandbox', 'allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation');
    iframe.setAttribute('src', url);

    template.replaceWith(iframe);
  });
});