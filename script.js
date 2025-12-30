// Scroll Reveal Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show'); // Triggers the CSS animation
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Handle Contact Form Submission
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
    console.log("Contact form found, attaching listener.");
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Form submission intercepted.");
        
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                contactForm.style.display = 'none';
                successMessage.style.display = 'block';
                // Trigger animation for the message
                successMessage.classList.add('hidden');
                setTimeout(() => successMessage.classList.add('show'), 10);
            } else {
                alert('There was a problem submitting your form. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a problem submitting your form. Please try again.');
        });
    });
} else {
    console.log("No contact form found on this page.");
}
