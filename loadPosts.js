async function loadPosts() {
  const response = await fetch('posts.json');
  const posts = await response.json();
  const today = new Date().toISOString().split('T')[0];

  const todayPosts = posts.filter(post => post.date === today);
  const previousPosts = posts.filter(post => post.date !== today);

  const todayContainer = document.getElementById('today-posts');
  const previousContainer = document.getElementById('previous-posts');

  todayPosts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.innerHTML = post.content;
      todayContainer.appendChild(postElement);
  });

  previousPosts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.innerHTML = `${post.content} <span class="post-date">${post.date}</span>`;
      previousContainer.appendChild(postElement);
  });
}

document.addEventListener('DOMContentLoaded', loadPosts);