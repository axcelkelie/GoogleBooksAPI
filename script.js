const API_KEY = 'AIzaSyBf-nZU9Mf2yxkRZVouuZqv7jcOaCZ_Wh4';
let userIdToken = null;

function handleCredentialResponse(response) {
  userIdToken = response.credential;
  console.log("ID Token:", userIdToken);
document.getElementById('logout').style.display = "inline-block";
  alert("Signed in successfully!");
  // You can send this token to your server for verification if needed
}

function searchBooks() {
  const query = document.getElementById('searchInput').value;
  const resultsDiv = document.getElementById('results');
  const loading = document.getElementById('loading');

  if (!userIdToken) {
    alert("Please sign in with Google to search for books.");
    return;
  }

  loading.style.display = 'block';
  resultsDiv.innerHTML = '';

  fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20&key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      loading.style.display = 'none';

      if (!data.items || data.items.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align:center;">No books found.</p>';
        return;
      }

      data.items.slice(0, 20).forEach(item => {
        const book = item.volumeInfo;
        const description = book.description
          ? book.description.substring(0, 100) + '...'
          : 'No description available.';
        const rating = book.averageRating ? ` ⭐ ${book.averageRating}/5` : 'No rating';

        const bookHTML = `
          <div class="book">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.authors ? book.authors.join(', ') : 'Unknown'}</p>
            <p><strong>Rating:</strong> ${rating}</p>
            <p>${description}</p>
            <img src="${book.imageLinks?.thumbnail || ''}" alt="Book cover">
            <a href="${book.previewLink}" target="_blank">
              <button>View Book</button>
            </a>
          </div>
        `;
        resultsDiv.innerHTML += bookHTML;
      });
    })
    .catch(error => {
      loading.style.display = 'none';
      console.error('Error:', error);
      resultsDiv.innerHTML = '<p style="text-align:center;">Something went wrong. Please try again.</p>';
    });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = function () {
  const btn = document.getElementById("scrollToTopBtn");
  btn.style.display = window.scrollY > 100 ? "block" : "none";
};
