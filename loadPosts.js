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
      postElement.innerHTML = `<p>${post.content}</p>`;
      todayContainer.appendChild(postElement);
  });

  previousPosts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.innerHTML = `<p>${post.content} <span class="post-date">${post.date}</span></p>`;
      previousContainer.appendChild(postElement);
  });
}

document.addEventListener('DOMContentLoaded', loadPosts);