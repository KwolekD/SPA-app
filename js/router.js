let pageUrls = {
    about: '/?about',
    contact: '/?contact',
    gallery: '/?gallery',
    home: '/?home'
};

let images = [
    {
        file: 'photo1.jpg',
        title: 'Graffiti 1',
        description: 'Description for Graffiti 1'
    },
    {
        file: 'photo2.jpg',
        title: 'Graffiti 2',
        description: 'Description for Graffiti 2'
    },
    {
        file: 'photo3.jpg',
        title: 'Graffiti 3',
        description: 'Description for Graffiti 3'
    },
    {
        file: 'photo4.jpg',
        title: 'Graffiti 4',
        description: 'Description for Graffiti 4'
    },
    {
        file: 'photo5.jpg',
        title: 'Graffiti 5',
        description: 'Description for Graffiti 5'
    },
    {
        file: 'photo6.jpg',
        title: 'Graffiti 6',
        description: 'Description for Graffiti 6'
    },
    {
        file: 'photo7.jpg',
        title: 'Graffiti 7',
        description: 'Description for Graffiti 7'
    },
    {
        file: 'photo8.jpg',
        title: 'Graffiti 8',
        description: 'Description for Graffiti 8'
    },
    {
        file: 'photo9.jpg',
        title: 'Graffiti 9',
        description: 'Description for Graffiti 9'
    },
    {
        file: 'photo10.jpg',
        title: 'Graffiti 10',
        description: 'Description for Graffiti 10'
    }
]

function OnStartUp() {
    RenderHomePage();
}

OnStartUp();

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

document.querySelector('#home-link').addEventListener('click', (event) => {
    let stateObj = { page: 'home' };
    document.title = 'Home';
    history.pushState(stateObj, "home", "?home");
    RenderHomePage();
});


document.querySelector('#about-link').addEventListener('click', (event) => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});
document.querySelector('#contact-link').addEventListener('click', (event) => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

function RenderAboutPage() {
    fetch('views/about.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('main').innerHTML = html;
        })
        .catch(error => console.error('Error loading about page:', error));
    document.querySelector('.title').innerHTML = 'About Me';
}

function RenderCaptcha() {
    if (typeof grecaptcha !== "undefined") {
        recaptchaWidgetId = grecaptcha.render('recaptcha-container', {
            'sitekey': '6LfDvigrAAAAAEPMNuQXNx5i0kZ1lBm8eio_QiNb'
        });
    } else {
        console.error("reCAPTCHA nie jest jeszcze załadowana");
    }
}

function RenderContactPage() {
    fetch('views/contact.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('main').innerHTML = html;
            RenderCaptcha();
            document.getElementById('contact-form').addEventListener('submit', function (event) {
                event.preventDefault();
                const recaptchaToken = document.querySelector('[name="g-recaptcha-response"]').value;

                if (!recaptchaToken) {
                    alert('Proszę wypełnić reCAPTCHA.');
                    return;
                }
                alert('Form submitted!');
                RenderHomePage();

            });
        })
        .catch(error => console.error('Error loading contact page:', error));
}

function RenderGalleryPage() {
    fetch('views/gallery.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('main').innerHTML = html;

            const galleryContainer = document.getElementById('gallery');
            const observer = new IntersectionObserver(onIntersection, { rootMargin: '100px' });

            images.forEach((imgData, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';

                const img = document.createElement('img');
                img.dataset.src = `images/${imgData.file}`;
                img.alt = imgData.description;
                img.title = imgData.title;

                item.appendChild(img);
                galleryContainer.appendChild(item);
                observer.observe(img);
            });

            setupModal();
        })
        .catch(error => console.error('Error loading gallery page:', error));
}

function onIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;

            fetch(src)
                .then(response => response.blob())
                .then(blob => {
                    img.src = URL.createObjectURL(blob);
                });

            observer.unobserve(img);
        }
    });
}

function setupModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.getElementById('modal-close');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
    let currentIndex = 0;

    const prevBtn = document.createElement('div');
    prevBtn.className = 'modal-nav modal-prev';
    prevBtn.innerHTML = '&lt;';
    modal.appendChild(prevBtn);

    const nextBtn = document.createElement('div');
    nextBtn.className = 'modal-nav modal-next';
    nextBtn.innerHTML = '&gt;';
    modal.appendChild(nextBtn);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'modal-info';
    modal.appendChild(infoDiv);

    const showImage = (index) => {
        if (index >= 0 && index < galleryItems.length) {
            currentIndex = index;
            const img = galleryItems[currentIndex];
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            infoDiv.textContent = img.alt || '';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    document.getElementById('gallery').addEventListener('click', (e) => {
        const imgElement = e.target.closest('.gallery-item img');
        if (imgElement) {
            currentIndex = galleryItems.indexOf(imgElement);
            showImage(currentIndex);
        }
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage((currentIndex + 1) % galleryItems.length);
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        } else if (e.key === 'ArrowRight') {
            showImage((currentIndex + 1) % galleryItems.length);
        }
    });
}




document.querySelector('#gallery-link').addEventListener('click', (event) => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

function RenderHomePage() {
    fetch('views/home.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('main').innerHTML = html;
        })
        .catch(error => console.error('Error loading home page:', error));
}
function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];
    if (loc === pageUrls.contact) { RenderContactPage(); }
    else if (loc === pageUrls.about) { RenderAboutPage(); }
    else if (loc === pageUrls.home) { RenderHomePage(); }
    else if (loc === pageUrls.gallery) { RenderGalleryPage(); }
}

window.onpopstate = popStateHandler; 