document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const levelsContainer = document.getElementById('levels-container');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    let challengesData = [];

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
    fetch('https://raw.githubusercontent.com/SecRifal/jsons/main/challenges.json')
        .then(response => response.json())
        .then(data => {
            challengesData = data.sort((a, b) => b.stars - a.stars); // Сортировка по stars убывающей
            renderLevels(challengesData);
        })
        .catch(error => console.error('Error loading challenges data:', error));

    // Функция рендера уровней
    function renderLevels(levels) {
        levelsContainer.innerHTML = '';
        if (levels.length === 0) {
            levelsContainer.innerHTML = '<div class="no-levels-message">Пока что нет уровней</div>';
            return;
        }
        levels.forEach((level, index) => {
            const position = challengesData.indexOf(level) + 1;
            const levelElement = document.createElement('div');
            levelElement.classList.add('level-item');
            levelElement.id = `challenge-${level.levelID}`;
            // Generate skillsets icons
            let skillsetsHTML = '';
            if (level.skillset && typeof level.skillset === 'string' && level.name !== 'ILL') {
                const skillsets = level.skillset.split(';').map(s => s.trim()).filter(Boolean);
                for (const skillsetPair of skillsets) {
                    const [skillsetName, tier] = skillsetPair.split('-');
                    if (skillsetName && tier) {
                        const iconPath = `../../imgs/tirs/${tier}/${tier.charAt(0).toLowerCase()}_${skillsetName.toLowerCase()}.png`;
                        const displayTier = tier.charAt(0).toUpperCase() + tier.slice(1);
                        skillsetsHTML += `<img src="${iconPath}" alt="${skillsetName}" class="skillset-icon" title="${skillsetName} (${displayTier})" onerror="this.style.display='none'">`;
                    }
                }
            }

            // Add has-skillsets class if skillsets exist
            if (skillsetsHTML) {
                levelElement.classList.add('has-skillsets');
            }

            levelElement.innerHTML = `
                <div class="position">${position}</div>
                <img src="https://raw.githubusercontent.com/SecRifal/jsons/main/images/challenges/${level.name}.png" alt="${level.name}" class="level-image" onerror="this.src='https://raw.githubusercontent.com/SecRifal/jsons/main/images/placeholder.png'">
                <div class="level-details">
                    <div class="level-name">${level.name}</div>
                    <div class="level-id">ID: ${level.levelID}</div>
                    <div class="creator">Автор: ${level.creator}</div>
                    <div class="verifier">Верифер: ${level.Verifier}</div>
                    <div class="stars"><img src="../../imgs/star.png" alt="⭐" class="star-icon"> ${level.stars}</div>
                </div>
                <div class="skillsets-container">
                    ${skillsetsHTML}
                </div>
            `;
            levelElement.addEventListener('click', () => openModal(level, position));
            levelElement.querySelector('.level-id').addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(level.levelID.toString()).then(() => {
                    // Optional: show feedback, e.g., tooltip or alert
                    console.log('ID copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
            levelElement.style.animationDelay = `${index * 0.1}s`;
            levelsContainer.appendChild(levelElement);
        });
    }

    // Открытие модального окна
    function openModal(level, position) {
        // Create skillset icons for modal
        let modalSkillsetsHTML = '';
        if (level.skillset && typeof level.skillset === 'string' && level.name !== 'ILL') {
            const skillsets = level.skillset.split(';').map(s => s.trim()).filter(Boolean);
            modalSkillsetsHTML = skillsets.map(skillsetPair => {
                const [skillsetName, tier] = skillsetPair.split('-');
                if (skillsetName && tier) {
                    const iconPath = `../../imgs/tirs/${tier}/${tier.charAt(0).toLowerCase()}_${skillsetName.toLowerCase()}.png`;
                    const displayTier = tier.charAt(0).toUpperCase() + tier.slice(1);
                    return `<img src="${iconPath}" alt="${skillsetName}" class="modal-skillset-icon" title="${skillsetName} (${displayTier})" onerror="this.style.display='none'">`;
                }
                return '';
            }).join('');
        }

        modalBody.innerHTML = `
            <h2>${level.name} (#${position})</h2>
            <img src="https://raw.githubusercontent.com/SecRifal/jsons/main/images/challenges/${level.name}.png" alt="${level.name}" class="level-modal-image" onerror="this.src='https://raw.githubusercontent.com/SecRifal/jsons/main/images/placeholder.png'">

            <!-- Row 1: Stars | Level ID | Difficulty -->
            <div class="modal-info-row-1">
                <div class="modal-stars"><img src="../../imgs/star.png" alt="⭐" class="star-icon"> ${level.stars}</div>
                <div class="modal-id">ID: <span class="copy-id" data-id="${level.levelID}">${level.levelID}</span></div>
            </div>

            <!-- Row 2: Verifier | Creator -->
            <div class="modal-info-row-2">
                <div class="modal-verifier">Верифер: <span class="clickable-nickname" data-nickname="${level.Verifier}">${level.Verifier || 'Не указан'}</span></div>
                <div class="modal-creator">Автор: <span class="clickable-nickname" data-nickname="${level.creator}">${level.creator}</span></div>
            </div>

            <div class="buttons-line">
                ${level.videoURL ? `<a href="${level.videoURL}" class="universal-button" target="_blank">Посмотреть видео</a>` : ''}

                <a href="#" class="universal-button" id="show-victors-btn" data-levelid="${level.levelID}">Показать викторов</a>
                ${level.showcaseURL ? `<a href="${level.showcaseURL}" class="universal-button" target="_blank">Смотреть showcase</a>` : ''}
            </div>

            <!-- Skillsets at bottom -->
            ${modalSkillsetsHTML ? `<div class="modal-skillsets-bottom">${modalSkillsetsHTML}</div>` : ''}
        `;

        // Show victors button
        modalBody.querySelector('#show-victors-btn').addEventListener('click', (e) => {
            showVictors(e.target.dataset.levelid);
        });

        // Add copy ID functionality before applyTextGlowEffect modifies innerHTML
        modalBody.querySelector('.copy-id').addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            navigator.clipboard.writeText(id).then(() => {
                e.target.classList.add('copied');
                setTimeout(() => e.target.classList.remove('copied'), 1000);
                showCopyNotification();
            });
        });

        // Make image clickable to open verification video
        const modalImage = modalBody.querySelector('img');
        if (level.verifURL && modalImage) {
            modalImage.addEventListener('click', () => {
                window.open(level.verifURL, '_blank');
            });
        }

        // Make nicknames clickable to go to players list
        modalBody.querySelectorAll('.clickable-nickname').forEach(nicknameSpan => {
            nicknameSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                const nickname = e.target.dataset.nickname;
                if (nickname && nickname !== 'Не указан') {
                    // Check if player exists before navigating
                    fetch('https://raw.githubusercontent.com/SecRifal/jsons/main/players.json')
                        .then(r => r.json())
                        .then(players => {
                            const playerExists = players.some(player => player.name === nickname);
                            if (playerExists) {
                                // Navigate to players list and scroll to this player
                                window.location.href = '../../../top/lists/players.html#' + nickname;
                            }
                        })
                        .catch(error => {
                            console.error('Error checking if player exists:', error);
                        });
                }
            });
        });

        modal.style.display = 'block';
        applyTextGlowEffect(modalBody);
    }

    // Show victors function
    function showVictors(levelID) {
        const level = challengesData.find(c => c.levelID.toString() === levelID.toString());
        const levelName = level ? level.name : 'Уровень';

        // Load players
        fetch('https://raw.githubusercontent.com/SecRifal/jsons/main/players.json')
            .then(r => r.json())
            .then(players => {
                const victors = players.flatMap(player =>
                    player.completedLevels.filter(cl => cl.name === levelName).map(cl => ({
                        playerName: player.name,
                        videoURL: cl.videoURL,
                        date: cl.date
                    }))
                ).sort((a, b) => {
                    if (!a.date && b.date) return 1;
                    if (a.date && !b.date) return -1;
                    if (!a.date && !b.date) return a.playerName.localeCompare(b.playerName);
                    const cmp = a.date.localeCompare(b.date);
                    return cmp !== 0 ? cmp : a.playerName.localeCompare(b.playerName);
                }).filter(v => v.playerName !== level.Verifier);

                let victorsHTML = `<button id="back-to-level" class="universal-button">Вернуться к уровню</button><h2>Викторы: ${levelName}</h2>`;
                if (victors.length === 0) {
                    victorsHTML += '<p>Никто не прошёл этот уровень</p>';
                } else {
                    victorsHTML += '<ol>';
                    victors.forEach((v, idx) => {
                        const formattedDate = v.date ? v.date.replace(/(\d{2})\.(\d{2})$/, '$1:$2') : 'Дата неизвестна';
                        victorsHTML += `<li><span class="victor-link" data-videourl="${v.videoURL || ''}">${v.playerName}</span> - ${formattedDate}</li>`;
                    });
                    victorsHTML += '</ol>';
                }

                modalBody.innerHTML = victorsHTML;

                // Add back button
                modalBody.querySelector('#back-to-level').addEventListener('click', () => {
                    const position = challengesData.indexOf(level) + 1;
                    openModal(level, position);
                });

                // Add victor links
                modalBody.querySelectorAll('.victor-link').forEach(link => {
                    link.addEventListener('click', () => {
                        const videoURL = link.dataset.videourl;
                        if (videoURL) {
                            window.open(videoURL, '_blank');
                        } else {
                            alert('Видео недоступно');
                        }
                    });
                });

                applyTextGlowEffect(modalBody);
            })
            .catch(error => console.error('Error loading players:', error));
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
        const filteredLevels = challengesData.filter(level =>
            level.name.toLowerCase().includes(query) ||
            level.levelID.toString().includes(query) ||
            challengesData.indexOf(level).toString().includes(query) || // позиция
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
                letter.style.textShadow = `0 0 ${intensity * 20}px rgba(178, 34, 52, ${intensity})`;
                // Check if dark theme is active
                const isDarkTheme = document.body.classList.contains('dark-theme');
                if (isDarkTheme) {
                    // Purple color transition for dark theme
                    letter.style.color = `rgba(${255 - intensity * 107}, ${255 - intensity * 213}, ${255 - intensity * 147}, 1)`;
                } else {
                    // Original red color transition for light theme
                    letter.style.color = `rgba(${255 - intensity * 77}, ${255 - intensity * 221}, ${255 - intensity * 203}, 1)`;
                }
            });
        });
    }
});
