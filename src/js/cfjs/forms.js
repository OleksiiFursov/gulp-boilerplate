import { $, $e, $each, func, getElement } from './base.js'

export function isValidEmail (email) {
    return /^[a-zA-Zа-яА-ЯёЁ0-9._%+-]+@[a-zA-Zа-яА-ЯёЁ0-9.-]+\.[a-zA-Zа-яА-ЯёЁ]{2,}$/u.test(email)
}

export function isValidPhoneNumber (phone) {
    return /^\+?[0-9\s\-().]{10,20}$/.test(phone)
}

export function isValidBirthDate (birthDate, min = 3, max = 120) {
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/

    if (!dateRegex.test(birthDate)) {
        return false
    }

    let [year, month, day] = birthDate.split('-').map(Number)

    const date = new Date(year, month - 1, day)

    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
        return false
    }

    const today = new Date()
    const age = today.getFullYear() - year - (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day) ? 1 : 0)

    return age >= min && age <= max
}

export const FormSend = (selector, {
    url,
    method = 'POST',
    labels = {},
    onSuccess = func,
    onError = func,
    validate = func,
    selectorMsg = null,
    highlight = 2e3,
    parent = null,
}) => {

    const $form = getElement(selector)
    const $parent = parent ? getElement(parent) : $form
    if (!$form) {
        return console.error('FormSend: ' + selector + ' not found.')
    }

    const $msg = selectorMsg ? getElement(selectorMsg) : $('.msg', $parent)

    const mailStatus = (msg, s) => {
        $msg.innerHTML = msg

        $parent.classList.toggle('is-success', s)
        $parent.classList.toggle('is-error', !s)
    }

    labels = Object.assign({
        sending: 'Sending',
        success: 'Successfully sent',
        error: 'Message not sent',
    }, labels)

    $e($('[type=submit]', $form), 'click', () => {
        $each(':invalid', (el, i) => {
            if (i === 0) el.focus()

            el.classList.add('highlight')
            setTimeout(() => {
                el.classList.remove('highlight')
            }, highlight)

        }, $form)
    })
    $e($form, 'submit', e => {
        e.preventDefault()

        const el = e.target
        const els = el.elements

        $msg.textContent = labels.sending
        els.submit.disabled = true
        const res = { formName: $form.name }

        for (let i = 0; i < els.length; i++) {
            const item = els[i]
            res[item.name] = item.value
        }

        fetch(url, {
            method,
            body: JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json'
            },
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
            mailStatus(labels.error, 0)
            onError(err)
            els.submit.disabled = false
        })

    })

    const onCheckValid = () => {
        const isValid = !!validate($form.elements)

        $parent.classList.toggle('is-valid', isValid)
        $parent.classList.toggle('is-invalid', !isValid)

        $form.elements.submit.dataset.disabled = !isValid
    }
    onCheckValid()
    $e($form, 'input', onCheckValid)

}
