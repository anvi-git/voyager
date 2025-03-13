async function loadPosts(postsFile, todayContainerId, previousContainerId, allPostsContainerId) {
  const response = await fetch(postsFile);
  const postsHtml = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(postsHtml, 'text/html');
  const posts = Array.from(doc.querySelectorAll('.post'));
  const today = new Date().toISOString().split('T')[0];

  const todayContainer = document.getElementById(todayContainerId);
  const previousContainer = document.getElementById(previousContainerId);
  const allPostsContainer = document.getElementById(allPostsContainerId);

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

async function loadPostContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('post');
  if (postId) {
    const currentPage = window.location.pathname.split('/').pop();
    const postsFile = currentPage === 'lss.html' ? 'lss_posts.html' : 'spacesound_posts.html';
    const response = await fetch(postsFile);
    const data = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const post = doc.getElementById(postId);
    if (post) {
      document.getElementById('post-container').innerHTML = post.outerHTML;
    } else {
      document.getElementById('post-container').innerHTML = '<p>Post not found.</p>';
    }
  } else {
    document.getElementById('post-container').innerHTML = '<p>No post specified.</p>';
  }
}

async function loadPostBackgrounds() {
  const currentPage = window.location.pathname.split('/').pop();
  const postsFile = currentPage === 'lss.html' ? 'lss_posts.html' : 'spacesound_posts.html';
  const response = await fetch(postsFile);
  const data = await response.text();
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
}

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'lss.html') {
    loadPosts('lss_posts.html', 'today-lss-posts', 'previous-lss-posts', 'all-lss-posts');
  } else {
    loadPosts('spacesound_posts.html', 'today-posts', 'previous-posts', 'all-posts');
  }
  loadPostContent();
  loadPostBackgrounds();
});