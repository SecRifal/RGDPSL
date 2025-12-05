document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const levelsContainer = document.getElementById('levels-container');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    let impossibleData = [];

    // Handle hash on page load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
                element.scrollIntoView({ block: 'center', behavior: 'smooth' });
                element.classList.add('highlight');
                setTimeout(() => element.classList.remove('highlight'), 500);
            }
        }, 500);
    }

    // Загрузка данных
    fetch('https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/impossible.json')
        .then(response => response.json())
        .then(data => {
            impossibleData = data.sort((a, b) => (a.position || 999) - (b.position || 999)); // Sort by position
            renderLevels(impossibleData);
        })
        .catch(error => console.error('Error loading impossible data:', error));

    // Функция для создания изображения с fallback PNG -> JPG -> placeholder
    function createImageWithFallback(levelName, className) {
        const img = document.createElement('img');
        img.alt = levelName;
        img.className = className;

        // Пытаемся загрузить PNG сначала
        let triedJPG = false;
        img.src = `https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/images/impossible/${levelName}.png`;

        img.onerror = function() {
            if (!triedJPG) {
                // Если PNG не найден, пробуем JPG
                triedJPG = true;
                this.src = `https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/images/impossible/${levelName}.jpg`;
            } else {
                // Если и JPG не найден, используем placeholder
                this.src = 'https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/images/placeholder.png';
                this.onerror = null; // Останавливаем дальнейшие попытки
            }
        };

        return img;
    }

    // Функция рендера уровней
    function renderLevels(levels) {
        levelsContainer.innerHTML = '';
        levels.forEach((level) => {
            const levelElement = document.createElement('div');
            levelElement.classList.add('level-item');
            levelElement.id = `impossible-${level.levelID}`;

            // Создаем элементы отдельно для правильной работы с event listeners
            const positionDiv = document.createElement('div');
            positionDiv.className = 'position';
            positionDiv.textContent = level.position;

            const levelImage = createImageWithFallback(level.name, 'level-image');

            const levelDetails = document.createElement('div');
            levelDetails.className = 'level-details';

            const levelNameDiv = document.createElement('div');
            levelNameDiv.className = 'level-name';
            levelNameDiv.textContent = level.name;

            const levelIdDiv = document.createElement('div');
            levelIdDiv.className = 'level-id';
            levelIdDiv.textContent = `ID: ${level.levelID}`;

            const creatorDiv = document.createElement('div');
            creatorDiv.className = 'creator';
            creatorDiv.textContent = `Автор: ${level.creator}`;

            levelDetails.appendChild(levelNameDiv);
            levelDetails.appendChild(levelIdDiv);
            levelDetails.appendChild(creatorDiv);

            levelElement.appendChild(positionDiv);
            levelElement.appendChild(levelImage);
            levelElement.appendChild(levelDetails);

            levelElement.addEventListener('click', () => openModal(level, level.position));
            levelIdDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(level.levelID.toString()).then(() => {
                    // Optional: show feedback, e.g., tooltip or alert
                    console.log('ID copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
            levelElement.style.animationDelay = `${(level.position - 1) * 0.1}s`;
            levelsContainer.appendChild(levelElement);
        });
    }

    // Открытие модального окна
    function openModal(level, position) {
        // Очищаем содержимое
        modalBody.innerHTML = '';

        // Создаем заголовок
        const header = document.createElement('h2');
        header.textContent = `${level.name} (#${position})`;
        modalBody.appendChild(header);

        // Создаем изображение с fallback
        const modalImage = createImageWithFallback(level.name, '');
        modalBody.appendChild(modalImage);

        // Создаем параграфы с информацией
        const idPara = document.createElement('p');
        idPara.innerHTML = `<strong>ID:</strong> <span class="copy-id" data-id="${level.levelID}">${level.levelID}</span>`;
        modalBody.appendChild(idPara);

        const creatorPara = document.createElement('p');
        creatorPara.innerHTML = `<strong>Автор:</strong> ${level.creator}`;
        modalBody.appendChild(creatorPara);

        if (level.videoURL) {
            const videoPara = document.createElement('p');
            videoPara.innerHTML = `<a href="${level.videoURL}" target="_blank">Посмотреть видео</a>`;
            modalBody.appendChild(videoPara);
        }

        // Add copy ID functionality
        modalBody.querySelector('.copy-id').addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            navigator.clipboard.writeText(id).then(() => {
                e.target.classList.add('copied');
                setTimeout(() => e.target.classList.remove('copied'), 1000);
                showCopyNotification();
            });
        });

        modal.style.display = 'block';
        applyTextGlowEffect(modalBody);
    }

    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Поиск
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredLevels = impossibleData.filter(level =>
            level.name.toLowerCase().includes(query) ||
            level.levelID.toString().includes(query) ||
            level.position.toString().includes(query) ||
            level.creator.toLowerCase().includes(query)
        );
        renderLevels(filteredLevels);
    });

    // Scroll to top
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Function to show copy notification
    function showCopyNotification() {
        const notification = document.createElement('div');
        notification.textContent = 'ID скопирован';
        notification.classList.add('copy-notification');
        document.body.appendChild(notification);
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
    }

    // Function to apply text glow effect
    function applyTextGlowEffect(container) {
        const textElements = container.querySelectorAll('h2, p');
        textElements.forEach(element => {
            if (element.querySelector('a') || element.querySelector('img') || element.querySelector('.copy-id')) return; // Skip elements with links, images, or copy-id
            const text = element.textContent;
            const words = text.split(/\s+/);
            element.innerHTML = words.map(word =>
                `<span class="word">${word.split('').map(letter => `<span class="letter">${letter}</span>`).join('')}</span>`
            ).join(' ');
        });

        container.addEventListener('mousemove', (e) => {
            const letters = container.querySelectorAll('.letter');
            letters.forEach(letter => {
                const rect = letter.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
                const maxDistance = 200; // radius
                const intensity = Math.max(0, 1 - distance / maxDistance);
                letter.style.textShadow = `0 0 ${intensity * 20}px rgba(255, 165, 0, ${intensity})`;
                letter.style.color = `rgba(255, ${255 - intensity * 90}, 0, 1)`; // White to orange
            });
        });
    }
});
