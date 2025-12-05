document.addEventListener('DOMContentLoaded', () => {
    const avatarInput = document.getElementById('avatar');
    const cropContainer = document.getElementById('crop-container');
    const cropBtn = document.getElementById('crop-btn');
    const addCompletionBtn = document.getElementById('add-completion');
    const completionsDiv = document.getElementById('completions');
    const regForm = document.getElementById('reg-form');
    const successMsg = document.getElementById('success-msg');

    let croppedImage = null;
    let cropper;

    const cropModal = document.getElementById('crop-modal');
    const cropImage = document.getElementById('crop-image');
    const cropSaveBtn = document.getElementById('crop-save-btn');
    const cropCloseModal = document.getElementById('crop-close-modal');

    // Load levels data
    const allLevels = [];

    // Add completion button functionality - works even without data loaded
    addCompletionBtn.addEventListener('click', () => {
        const block = document.createElement('div');
        block.className = 'completion-block';

        const select = document.createElement('select');
        select.required = true;
        select.name = 'level[]';

        // If data is loaded, populate with real levels
        if (allLevels.length > 0) {
            allLevels.forEach(level => {
                const option = document.createElement('option');
                option.value = `${level.name} (${level.type})`;
                option.textContent = option.value;
                select.appendChild(option);
            });
        } else {
            // Fallback option if data not loaded yet
            const option = document.createElement('option');
            option.value = 'Загрузка...';
            option.textContent = 'Загрузка уровней...';
            select.appendChild(option);
        }

        const input = document.createElement('input');
        input.type = 'url';
        input.placeholder = 'Ссылка на видео';
        input.required = true;
        input.name = 'video[]';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'Удалить';
        removeBtn.className = 'remove-completion universal-button';
        removeBtn.addEventListener('click', () => block.remove());

        block.appendChild(select);
        block.appendChild(input);
        block.appendChild(removeBtn);

        completionsDiv.appendChild(block);
    });

    // Load levels data asynchronously
    Promise.all([
        fetch('https://raw.githubusercontent.com/SecRifal/jsons/main/demons.json').then(r => r.json()),
        fetch('https://raw.githubusercontent.com/SecRifal/jsons/main/challenges.json').then(r => r.json())
    ]).then(([demons, challenges]) => {
        demons.forEach(d => allLevels.push({ name: d.name, type: 'Demon' }));
        challenges.forEach(c => allLevels.push({ name: c.name, type: 'Challenge' }));
        console.log('Levels data loaded successfully');
    }).catch(error => {
        console.error('Failed to load levels data:', error);
        // Add fallback levels if fetch fails
        allLevels.push({ name: 'Пример уровня', type: 'Demon' });
    });

    // Avatar crop
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                cropImage.src = reader.result;
                cropModal.style.display = 'block';
                if (cropper) cropper.destroy();
                cropper = new Cropper(cropImage, {
                    aspectRatio: 1,
                    viewMode: 1,
                });
            };
            reader.readAsDataURL(file);
        }
    });

    cropSaveBtn.addEventListener('click', () => {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas();
            croppedImage = canvas.toDataURL();
            cropModal.style.display = 'none';
            cropper.destroy();
            cropper = null;
        }
    });

    cropCloseModal.addEventListener('click', () => {
        cropModal.style.display = 'none';
        if (cropper) cropper.destroy();
        cropper = null;
        avatarInput.value = '';
    });

    window.addEventListener('click', (event) => {
        if (event.target == cropModal) {
            cropModal.style.display = 'none';
            if (cropper) cropper.destroy();
            cropper = null;
            avatarInput.value = '';
        }
    });

    function dataURLtoBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
    }

    // Form submit
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(regForm);

        // Build message content
        const nick = formData.get('nick');
        const levels = formData.getAll('level[]');
        const videos = formData.getAll('video[]');
        const notes = formData.get('notes');
        let content = `**Новая регистрация в топ игроков**\n**Ник:** ${nick}\n`;

        if (levels.length > 0) {
            content += '**Прохождения:**\n';
            levels.forEach((level, i) => {
                content += `- ${level} - ${videos[i]}\n`;
            });
        }

        if (notes && notes.trim()) {
            content += `\n**Заметки:** ${notes}`;
        }

        // Prepare Webhook submission
        const webhookFormData = new FormData();
        const payload = { content };
        if (croppedImage) {
            const blob = dataURLtoBlob(croppedImage);
            webhookFormData.append('files[0]', blob, 'avatar.png');
        }
        webhookFormData.append('payload_json', JSON.stringify(payload));

        // Submit to Discord Webhook
        try {
            const response = await fetch('https://discord.com/api/webhooks/1446500932560097324/ktf3zEzdkfo2zHCuziQRj7Kl_XAk7Xh5XCUN5rUZbl6UoQQM8hAiUzN4FIK0brgk3uGM', {
                method: 'POST',
                body: webhookFormData
            });
            console.log('Response status:', response.status);
            if (response.ok) {
                successMsg.style.display = 'block';
                regForm.style.display = 'none';
                alert('Регистрация отправлена! Ожидайте подтверждения.');
            } else {
                const errorText = await response.text();
                console.log('Response error:', response.statusText, errorText);
                alert('Ошибка отправки: ' + response.statusText);
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка сети: ' + error.message);
        }
    });
});
