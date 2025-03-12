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

async function loadLssPosts() {
  const response = await fetch('lss_posts.html');
  const postsHtml = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(postsHtml, 'text/html');
  const posts = Array.from(doc.querySelectorAll('.post'));
  const today = new Date().toISOString().split('T')[0];

  const todayContainer = document.getElementById('today-lss-posts');
  const previousContainer = document.getElementById('previous-lss-posts');
  const allPostsContainer = document.getElementById('all-lss-posts');

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

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'lss.html') {
    loadLssPosts();
  } else {
    loadPosts();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  function loadPostContent() {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('post');
      if (postId) {
          fetch('spacesound_posts.html')
              .then(response => response.text())
              .then(data => {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(data, 'text/html');
                  const post = doc.getElementById(postId);
                  if (post) {
                      document.getElementById('post-container').innerHTML = post.outerHTML;
                  } else {
                      document.getElementById('post-container').innerHTML = '<p>Post not found.</p>';
                  }
              })
              .catch(error => console.error('Error loading post:', error));
      } else {
          document.getElementById('post-container').innerHTML = '<p>No post specified.</p>';
      }
  }

  function loadPostBackgrounds() {
      fetch('spacesound_posts.html')
          .then(response => response.text())
          .then(data => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(data, 'text/html');
              const postLinks = document.querySelectorAll('.post-link');
              postLinks.forEach(link => {
                  const postId = link.getAttribute('data-post-id');
                  const post = doc.getElementById(postId);
                  if (post) {
                      const background = post.getAttribute('data-background');
                      if (background) {
                          link.style.backgroundImage = `url(${background})`;
                      }
                  }
              });
          })
          .catch(error => console.error('Error loading post backgrounds:', error));
  }

  window.loadPostContent = loadPostContent;
  window.loadPostBackgrounds = loadPostBackgrounds;
});