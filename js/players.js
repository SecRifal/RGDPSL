document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const levelsContainer = document.getElementById('levels-container');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    let playersData = [];

    // Check for hash in URL to highlight specific player
    if (window.location.hash) {
        const targetPlayer = window.location.hash.substring(1);
        setTimeout(() => {
            const playerElement = document.getElementById(`player-${targetPlayer}`);
            if (playerElement) {
                playerElement.classList.add('player-highlighted');
                playerElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
                // Remove highlight after a few seconds
                setTimeout(() => {
                    playerElement.classList.remove('player-highlighted');
                }, 5000);
            }
        }, 1000); // Wait for data to load
    }

    // Load levels data for XP calculation
    let demonsData = [];
    let challengesData = [];
    let memoryData = [];
    Promise.all([
        fetch('https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/demons.json').then(r => r.json()),
        fetch('https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/challenges.json').then(r => r.json()),
        fetch('https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/memory.json').then(r => r.json())
    ]).then(([demons, challenges, memory]) => {
        demonsData = demons;
        challengesData = challenges;
        memoryData = memory;

        // Load players after levels
        fetch('https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/players.json').then(r => r.json()).then(data => {
            playersData = data.map(player => {
                const stars = player.completedLevels.reduce((sum, cl) => {
                    const demon = demonsData.find(d => d.name === cl.name);
                    const challenge = challengesData.find(c => c.name === cl.name);
                    const memoryLevel = memoryData.find(m => m.name === cl.name);
                    return sum + (demon ? demon.stars : challenge ? challenge.stars : memoryLevel ? memoryLevel.stars : 0);
                }, 0);
                const level = Math.floor(stars / 50) + 1;
                return { ...player, stars, level };
            }).sort((a, b) => b.stars - a.stars);

            renderPlayers(playersData);
        }).catch(error => console.error('Error loading players data:', error));
    });

    // Render players
    function renderPlayers(players) {
        levelsContainer.innerHTML = '';
        players.forEach((player, index) => {
            const position = playersData.indexOf(player) + 1;
            const nextLevelStars = player.level * 50;
            const progressPercent = ((player.stars % 50) / 50) * 100; // Progress for current level

            const playerElement = document.createElement('div');
            playerElement.classList.add('level-item'); // Reuse class
            playerElement.id = `player-${player.name}`; // Add ID for highlighting
            playerElement.innerHTML = `
                <div class="position">${position}</div>
                <img src="https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/${player.avatar}" alt="${player.name}" class="level-image" onerror="this.src='https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/images/placeholder.png'">
                <div class="level-details">
                    <div class="level-name">${player.name}</div>
                    <div class="level-id">Уровень: ${player.level}</div>
                    <div class="stars"><img src="../../imgs/star.png" alt="⭐" class="star-icon"> ${player.stars}</div>
                </div>
            `;
            playerElement.addEventListener('click', () => openModal(player, position));
            playerElement.style.animationDelay = `${index * 0.1}s`;
            levelsContainer.appendChild(playerElement);
        });
    }

    // Open modal
    function openModal(player, position) {
        const progressPercent = ((player.stars % 50) / 50) * 100;
        const nextLevelStars = player.level * 50;
        const currentStars = player.stars % 50;

        const createLevelLink = (cl) => {
            const demon = demonsData.find(d => d.name === cl.name);
            const challenge = challengesData.find(c => c.name === cl.name);
            const memoryLevel = memoryData.find(m => m.name === cl.name);
            const stars = (demon ? demon.stars : challenge ? challenge.stars : memoryLevel ? memoryLevel.stars : 0);
            return `<span class="level-link" data-name="${cl.name}" data-videourl="${cl.videoURL || ''}">${cl.name} -> ⭐: ${stars}</span>`;
        };

        const isVerifierForLevel = (cl) => {
            const demon = demonsData.find(d => d.name === cl.name);
            const challenge = challengesData.find(c => c.name === cl.name);
            const memoryLevel = memoryData.find(m => m.name === cl.name);
            return (demon && demon.Verifier === player.name) ||
                   (challenge && challenge.Verifier === player.name) ||
                   (memoryLevel && memoryLevel.Verifier === player.name);
        };

        const isDemon = (cl) => !!demonsData.find(d => d.name === cl.name);
        const isChallengeOrMemory = (cl) => !!challengesData.find(c => c.name === cl.name) || !!memoryData.find(m => m.name === cl.name);

        const filteredVictors = player.completedLevels.filter(cl => !isVerifierForLevel(cl));
        const filteredVerifs = player.completedLevels.filter(cl => isVerifierForLevel(cl));

        const victorsDemons = filteredVictors.filter(isDemon).map(createLevelLink).join('<br>');
        const victorsChallenges = filteredVictors.filter(isChallengeOrMemory).map(createLevelLink).join('<br>');
        const verifsDemons = filteredVerifs.filter(isDemon).map(createLevelLink).join('<br>');
        const verifsChallenges = filteredVerifs.filter(isChallengeOrMemory).map(createLevelLink).join('<br>');

        modalBody.innerHTML = `
            <h2>#${position}</h2>
            <div class="player-header">
                <img src="https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/images/players/${player.name}.png" alt="${player.name}" onerror="this.src='https://raw.githubusercontent.com/SecRifal/RGDPSJ/main/images/placeholder.png'" style="width: 80px; height: 80px; border-radius: 40px; margin-right: 20px;">
                <h3>${player.name}</h3>
            </div>
            <div class="progress-wrapper">
                <span>${player.level} ур.</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${Math.min(progressPercent, 100)}%;"></div>
                </div>
                <span>${currentStars}/50</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 20px;">
                <div style="flex: 1; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px;">
                    <p style="color: #FFD700; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #FFD700; margin-bottom: 10px;">Викторы:</p>
                    <p><strong>Демоны:</strong></p>
                    <p class="cmpl">${victorsDemons || 'Нет'}</p>
                    <p><strong>Челленджи:</strong></p>
                    <p class="cmpl">${victorsChallenges || 'Нет'}</p>
                </div>
                <div style="flex: 1; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px;">
                    <p style="color: #FFD700; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #FFD700; margin-bottom: 10px;">Верифы:</p>
                    <p><strong>Демоны:</strong></p>
                    <p class="cmpl">${verifsDemons || 'Нет'}</p>
                    <p><strong>Челленджи:</strong></p>
                    <p class="cmpl">${verifsChallenges || 'Нет'}</p>
                </div>
            </div>
        `;

        // Add click events to level links: open videoURL if available
        modalBody.querySelectorAll('.level-link').forEach(link => {
            link.addEventListener('click', () => {
                const videoURL = link.dataset.videourl;
                if (videoURL) {
                    window.open(videoURL, '_blank');
                } else {
                    alert('Видео может быть недоступным');
                }
            });
        });

        modal.style.display = 'block';
        applyTextGlowEffect(modalBody);
    }

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredPlayers = playersData.filter(player =>
            player.name.toLowerCase().includes(query) ||
            playersData.indexOf(player).toString().includes(query)
        );
        renderPlayers(filteredPlayers);
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

    // Apply text glow effect
    function applyTextGlowEffect(container) {
        const textElements = container.querySelectorAll('h2, h3, p');
        textElements.forEach(element => {
            if (element.querySelector('img') || element.querySelector('.progress') || element.querySelector('.level-link')) return;
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
                const maxDistance = 200;
                const intensity = Math.max(0, 1 - distance / maxDistance);
                letter.style.textShadow = `0 0 ${intensity * 20}px rgba(255, 165, 0, ${intensity})`;
                letter.style.color = `rgba(255, ${255 - intensity * 90}, 0, 1)`;
            });
        });
    }
});
