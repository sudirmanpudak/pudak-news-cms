// Logic untuk memuat daftar berita di website utama
const BACKEND_URL = 'https://ALAMAT-BACKEND-ANDA.app.github.dev';

async function loadNews() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/news/public`);
        const newsList = await response.json();

        if (newsList.length === 0) return;

        // 1. Ambil berita terbaru untuk Hot News
        const hotNews = newsList[0];
        const featuredContainer = document.getElementById('featured-container');
        
        if (featuredContainer) {
            featuredContainer.innerHTML = `
                <article class="featured-card animate-fade-up">
                    <div class="featured-image">
                        <img src="${BACKEND_URL}${hotNews.image}" alt="${hotNews.title}">
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

        // 2. Sisa berita lainnya masuk ke Grid
        const otherNews = newsList.slice(1);
        const gridContainer = document.getElementById('news-grid-container');
        
        if (gridContainer) {
            gridContainer.innerHTML = ''; 
            otherNews.forEach(news => {
                gridContainer.innerHTML += `
                    <article class="news-card">
                        <div class="news-image-wrapper">
                            <span class="news-category">${news.tag}</span>
                            <img src="${BACKEND_URL}${news.image}" alt="${news.title}">
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

    } catch (error) {
        console.error('Gagal mengambil berita:', error);
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

loadNews();
