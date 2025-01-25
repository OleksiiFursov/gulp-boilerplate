import {$, $e, $each, func} from "./base.js";

export function isValidEmail(email) {
    return /^[a-zA-Zа-яА-ЯёЁ0-9._%+-]+@[a-zA-Zа-яА-ЯёЁ0-9.-]+\.[a-zA-Zа-яА-ЯёЁ]{2,}$/u.test(email)
}

export function isValidPhoneNumber(phone) {
    // Регулярное выражение для проверки номеров телефона
    const phoneRegex = /^\+?[0-9\s\-().]{10,20}$/;

    // Проверяем, соответствует ли номер регулярному выражению
    return phoneRegex.test(phone);
}


export function isValidBirthDate(birthDate, min = 3, max = 120) {
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;

    if (!dateRegex.test(birthDate)) {
        return false;
    }

    let [year, month, day] = birthDate.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
    ) {
        return false;
    }

    const today = new Date();
    const age = today.getFullYear() - year - (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day) ? 1 : 0);

    return age >= min && age <= max;
}



export const FormSend = (selector, {
    url,
    method,
    labels = {},
    onSuccess = func,
    onError = func,
    validate = func,
    highlight=2e3
}) => {

    const $form = $(selector);
    if (!$form) {
        return console.error('FormSend: ' + selector + ' not found.');
    }

    const $msg = $('.msg', $form);

    const mailStatus = (text, msg, s) => {
        $msg.textContent = text
        $form.classList.toggle('success', s);
        $form.classList.toggle('error', !s);
    }

    Object.assign(labels, {
        sending: 'Sending',
        success: 'Successfully sent',
        error: 'Message not sent'
    });

    $e($('[type=submit]', $form), 'click', () => {
      $each(':invalid', (el, i)=>{
            if(i===0) el.focus();

            el.classList.add('highlight');
            setTimeout(()=>{
                el.classList.remove('highlight');
            }, highlight);

        }, $form);
    })
    $e($form, 'submit', e => {
        e.preventDefault();

        const el = e.target
        const els = el.elements

        $msg.textContent = labels.sending
        els.submit.disabled = true;
        const res = {formName: $form.name};

        for (let i = 0; i < els.length; i++) {
            const item = els[i]
            res[item.name] = item.value
        }
        fetch(url, {
            method: method || 'POST',
            body: JSON.stringify($form),
        }).then(v => v.json()).then(v => {
            if (v.status) {
                for (let i = 0; i < els.length; i++) {
                    els[i].value = ''
                }
                mailStatus(labels.success, 1)
                onSuccess(v)
            } else {
                mailStatus(labels.error, 0)
                onError(v)
            }
            els.submit.disabled = false
        }).catch((err) => {
            console.log(labels);
            mailStatus(labels.error, 0);
            onSuccess(err)
            els.submit.disabled = false
        })

    })

    const onCheckValid = () => {
        const isValid = !!validate($form.elements);

        $form.classList.toggle('is-valid', isValid)
        $form.classList.toggle('is-invalid', !isValid)


        $form.elements.submit.dataset.disabled = !isValid
    }
    onCheckValid()
    $e($form, 'input', onCheckValid)

};