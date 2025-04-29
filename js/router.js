let pageUrls = {
    about: '/?about',
    contact:'/?contact',
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

function RenderContactPage() {
    fetch('views/contact.html') 
        .then(response => response.text())
        .then(html => {
            document.querySelector('main').innerHTML = html;
            document.getElementById('contact-form').addEventListener('submit', (event) => {
                event.preventDefault();
                alert('Form submitted!');
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
                img.dataset.src = `images/${imgData.file}`; // Lazy load path
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

// Lazy loading handler
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

// Modal setup
function setupModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.getElementById('modal-close');

    document.getElementById('gallery').addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            modalImg.src = e.target.src;
            modal.classList.remove('hidden');
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modalImg.src = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modalImg.src = '';
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
    if (loc === pageUrls.contact){ RenderContactPage();}
    else if(loc === pageUrls.about){ RenderAboutPage();}
    else if (loc === pageUrls.home){ RenderHomePage();}
    else if (loc === pageUrls.gallery){ RenderGalleryPage();}
}

window.onpopstate = popStateHandler; 