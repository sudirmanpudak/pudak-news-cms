// Logic untuk memuat detail berita di website utama
const BACKEND_URL = 'https://ALAMAT-BACKEND-ANDA.app.github.dev';

async function loadDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) return;

    try {
        const response = await fetch(`${BACKEND_URL}/api/news/${id}`);
        const news = await response.json();

        document.title = `${news.title} - Pudak Aerospace`;
        
        const titleEl = document.getElementById('detail-title');
        const heroEl = document.getElementById('detail-hero');
        const contentEl = document.getElementById('detail-content');

        if (titleEl) titleEl.innerText = news.title;
        if (heroEl) {
            heroEl.innerHTML = `
                <img src="${BACKEND_URL}${news.image}" alt="${news.title}">
                <p class="caption">${news.imageDescription || ''}</p>
            `;
        }
        if (contentEl) {
            contentEl.innerHTML = `
                <p class="lead">${news.highlight}</p>
                ${news.content}
            `;
        }

    } catch (error) {
        console.error('Gagal mengambil detail berita:', error);
    }
}

loadDetail();
