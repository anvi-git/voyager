async function loadPosts() {
    const response = await fetch('posts.html');
    const postsHtml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(postsHtml, 'text/html');
    const posts = Array.from(doc.querySelectorAll('.post'));
    const today = new Date().toISOString().split('T')[0];
  
    const todayContainer = document.getElementById('today-posts');
    const previousContainer = document.getElementById('previous-posts');
    const allPostsContainer = document.getElementById('all-posts');
  
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date')));
  
    posts.forEach(post => {
      const postDate = post.getAttribute('data-date');
      const postElement = document.createElement('div');
      postElement.innerHTML = post.innerHTML;
  
      if (postDate === today && todayContainer) {
        todayContainer.appendChild(postElement);
      } else if (postDate !== today && previousContainer) {
        postElement.innerHTML += `<span class="post-date">${postDate}</span>`;
        previousContainer.appendChild(postElement);
      }
  
      if (allPostsContainer) {
        postElement.innerHTML += `<span class="post-date">${postDate}</span>`;
        allPostsContainer.appendChild(postElement);
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', loadPosts);