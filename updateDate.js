function updateDate() {
  const dateElement = document.getElementById("current-date");
  if (dateElement) {
      const options = { year: 'numeric', month: 'short', day: '2-digit' };
      const today = new Date().toLocaleDateString('en-US', options);
      dateElement.textContent = today;
  }
}