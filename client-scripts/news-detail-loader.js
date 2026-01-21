// Logic untuk memuat detail berita di website utama
<<<<<<< HEAD
const BACKEND_URL = 'https://ALAMAT-BACKEND-ANDA.app.github.dev';
=======
const BACKEND_URL = 'https://GANTI-DENGAN-URL-NETLIFY-ADMIN-ANDA.netlify.app';
>>>>>>> 9d381ea (Final update for Netlify)

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
<<<<<<< HEAD
            heroEl.innerHTML = `
                <img src="${BACKEND_URL}${news.image}" alt="${news.title}">
=======
            const imageUrl = news.image.startsWith('http') ? news.image : `${BACKEND_URL}/api/images/${news.image}`;
            heroEl.innerHTML = `
                <img src="${imageUrl}" alt="${news.title}">
>>>>>>> 9d381ea (Final update for Netlify)
                <p class="caption">${news.imageDescription || ''}</p>
            `;
        }
        if (contentEl) {
            contentEl.innerHTML = `
                <p class="lead">${news.highlight}</p>
                ${news.content}
            `;
        }
<<<<<<< HEAD

=======
>>>>>>> 9d381ea (Final update for Netlify)
    } catch (error) {
        console.error('Gagal mengambil detail berita:', error);
    }
}

loadDetail();
