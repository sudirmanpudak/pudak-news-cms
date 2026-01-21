// Logic untuk memuat daftar berita di website utama
<<<<<<< HEAD
const BACKEND_URL = 'https://ALAMAT-BACKEND-ANDA.app.github.dev';
=======
// GANTI ALAMAT INI dengan URL Netlify Admin Anda (misal: https://pudak-admin.netlify.app)
const BACKEND_URL = 'https://GANTI-DENGAN-URL-NETLIFY-ADMIN-ANDA.netlify.app';
>>>>>>> 9d381ea (Final update for Netlify)

async function loadNews() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/news/public`);
        const newsList = await response.json();

        if (newsList.length === 0) return;

<<<<<<< HEAD
        // 1. Ambil berita terbaru untuk Hot News
=======
>>>>>>> 9d381ea (Final update for Netlify)
        const hotNews = newsList[0];
        const featuredContainer = document.getElementById('featured-container');
        
        if (featuredContainer) {
<<<<<<< HEAD
            featuredContainer.innerHTML = `
                <article class="featured-card animate-fade-up">
                    <div class="featured-image">
                        <img src="${BACKEND_URL}${hotNews.image}" alt="${hotNews.title}">
=======
            const imageUrl = hotNews.image.startsWith('http') ? hotNews.image : `${BACKEND_URL}/api/images/${hotNews.image}`;
            featuredContainer.innerHTML = `
                <article class="featured-card animate-fade-up">
                    <div class="featured-image">
                        <img src="${imageUrl}" alt="${hotNews.title}">
>>>>>>> 9d381ea (Final update for Netlify)
                        <span class="news-badge">Hot News</span>
                    </div>
                    <div class="featured-content">
                        <div class="meta-info">
                            <span class="date"><i class="fa-regular fa-calendar"></i> ${formatDate(hotNews.createdAt)}</span>
                            <span class="category">${hotNews.tag}</span>
                        </div>
                        <h3>${hotNews.title}</h3>
                        <p class="excerpt">${hotNews.highlight}</p>
                        <a href="news-detail.html?id=${hotNews.id}" class="btn-read-more">
                            Read More <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </article>
            `;
        }

<<<<<<< HEAD
        // 2. Sisa berita lainnya masuk ke Grid
=======
>>>>>>> 9d381ea (Final update for Netlify)
        const otherNews = newsList.slice(1);
        const gridContainer = document.getElementById('news-grid-container');
        
        if (gridContainer) {
            gridContainer.innerHTML = ''; 
            otherNews.forEach(news => {
<<<<<<< HEAD
=======
            const imageUrl = news.image.startsWith('http') ? news.image : `${BACKEND_URL}/api/images/${news.image}`;
>>>>>>> 9d381ea (Final update for Netlify)
                gridContainer.innerHTML += `
                    <article class="news-card">
                        <div class="news-image-wrapper">
                            <span class="news-category">${news.tag}</span>
<<<<<<< HEAD
                            <img src="${BACKEND_URL}${news.image}" alt="${news.title}">
=======
                        <img src="${imageUrl}" alt="${news.title}">
>>>>>>> 9d381ea (Final update for Netlify)
                        </div>
                        <div class="news-content">
                            <div class="news-date">
                                <i class="fa-regular fa-calendar"></i> ${formatDate(news.createdAt)}
                            </div>
                            <h2 class="news-title">${news.title}</h2>
                            <p class="news-excerpt">${news.highlight}</p>
                            <a href="news-detail.html?id=${news.id}" class="read-more">Baca Selengkapnya <i class="fa-solid fa-arrow-right"></i></a>
                        </div>
                    </article>
                `;
            });
        }
<<<<<<< HEAD

=======
>>>>>>> 9d381ea (Final update for Netlify)
    } catch (error) {
        console.error('Gagal mengambil berita:', error);
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

loadNews();
