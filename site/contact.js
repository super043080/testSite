const REACH_MESSAGE = 'Please add an email or a phone number so I can reply.';

function validateReach(form) {
  const email = form.elements.email;
  const hasReach = email.value.trim() !== '' || form.elements.phone.value.trim() !== '';
  email.setCustomValidity(hasReach ? '' : REACH_MESSAGE);
  return hasReach;
}

const contactForm = document.querySelector('form[name="contact"]');
contactForm.addEventListener('input', () => validateReach(contactForm));
validateReach(contactForm);
