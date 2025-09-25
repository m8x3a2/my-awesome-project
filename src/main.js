// Получаем элементы DOM
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

// Обработчик открытия модалки
openBtn.addEventListener('click', () => {
    lastActive = document.activeElement; // Запоминаем активный элемент
    dlg.showModal(); // Открываем модальное окно
    // Фокусируемся на первом поле формы
    dlg.querySelector('input, select, textarea, button')?.focus();
});

// Обработчик закрытия модалки через кнопку "Закрыть"
closeBtn.addEventListener('click', () => dlg.close('cancel'));

// Обработчик отправки формы
form?.addEventListener('submit', (e) => {
    // 1) Сброс кастомных сообщений об ошибках
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // 2) Проверка встроенных ограничений
    if (!form.checkValidity()) {
        e.preventDefault(); // Отменяем стандартную отправку

        // Пример: кастомное сообщение для email
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        form.reportValidity(); // Показываем браузерные подсказки

        // Подсветка проблемных полей для доступности
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
        });
        return;
    }

    // 3) Успешная «отправка» (без сервера)
    e.preventDefault();
    // Закрываем модальное окно
    dlg.close('success');
    form.reset(); // Очищаем форму
});

// Обработчик события закрытия модалки
dlg.addEventListener('close', () => { 
    lastActive?.focus(); // Возвращаем фокус на элемент, который был активен до открытия
});

// Маска для телефона
const phone = document.getElementById('phone');

phone?.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g,'').slice(0,11); // Оставляем только цифры (до 11)
    const d = digits.replace(/^8/, '7'); // Нормализуем 8 в 7
    
    const parts = []
    if (d.length > 0) parts.push('+7');
    if (d.length > 1) parts.push(' (' + d.slice(1,4));
    if (d.length >= 4) parts[parts.length - 1] += ')';
    if (d.length >= 5) parts.push(' ' + d.slice(4,7));
    if (d.length >= 8) parts.push('-' + d.slice(7,9));
    if (d.length >= 10) parts.push('-' + d.slice(9,11));
    
    phone.value = parts.join('');
});

// Строгая проверка pattern
phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');