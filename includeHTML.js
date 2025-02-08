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
    var siteTitle = document.getElementById("site-title");
    if (siteTitle) {
      var siteTitleLink = siteTitle.querySelector("a");
      if (window.location.pathname !== "/index.html") {
        siteTitleLink.href = "index.html";
      } else {
        siteTitleLink.href = "#";
      }
    } else {
      console.error("Element with id 'site-title' not found.");
    }
  }, 100); // Adjust the timeout as needed
});