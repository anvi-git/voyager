async function loadPosts() {
    const response = await fetch('posts.html');
    const postsHtml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(postsHtml, 'text/html');
    const posts = doc.querySelectorAll('.post');
    const today = new Date().toISOString().split('T')[0];
  
    const todayContainer = document.getElementById('today-posts');
    const previousContainer = document.getElementById('previous-posts');
  
    posts.forEach(post => {
      const postDate = post.getAttribute('data-date');
      const postElement = document.createElement('div');
      postElement.innerHTML = post.innerHTML;
  
      if (postDate === today && todayContainer) {
        todayContainer.appendChild(postElement);
      } else if (previousContainer) {
        postElement.innerHTML += `<span class="post-date">${postDate}</span>`;
        previousContainer.appendChild(postElement);
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', loadPosts);