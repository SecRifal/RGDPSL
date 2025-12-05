document.addEventListener('DOMContentLoaded', () => {
    const impossibleForm = document.getElementById('impossible-form');
    const successMsg = document.getElementById('success-msg');

    // Form submit
    impossibleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(impossibleForm);

        // Build message content
        const levelId = formData.get('level-id');
        const levelName = formData.get('level-name');
        const levelLink = formData.get('level-link');
        const nick = formData.get('nick');
        const notes = formData.get('notes');

        let content = `**🟣 Заявка на Импосибл**\n**Айди уровня:** ${levelId}\n**Название уровня:** ${levelName}\n**Ссылка на шоукейс:** ${levelLink}\n**Автор уровня:** ${nick}`;

        if (notes && notes.trim()) {
            content += `\n**Заметки:** ${notes}`;
        }

        // Prepare Webhook submission
        const webhookFormData = new FormData();
        const payload = { content };
        webhookFormData.append('payload_json', JSON.stringify(payload));

        // Submit to Discord Webhook
        try {
            // NOTE: Replace with actual impossible-specific webhook URL
            const response = await fetch('https://discord.com/api/webhooks/1446500932560097324/ktf3zEzdkfo2zHCuziQRj7Kl_XAk7Xh5XCUN5rUZbl6UoQQM8hAiUzN4FIK0brgk3uGM', {
                method: 'POST',
                body: webhookFormData
            });
            console.log('Response status:', response.status);
            if (response.ok) {
                successMsg.style.display = 'block';
                impossibleForm.style.display = 'none';
                alert('Заявка на импосибл отправлена! Администраторы рассмотрят вашу заявку. Это может занять время из-за высокой сложности импосибл уровней.');
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
