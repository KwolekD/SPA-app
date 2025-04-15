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
            gallery = '';
            images.forEach(elem => {
                gallery+= `<div class="gallery-item">
                                <img src="images/${elem.file}" alt="${elem.description}>
                                <p class="gallery-description">${elem.description}</p>
                            </div>`
            });
            document.getElementById('gallery').innerHTML = gallery;
            
        })
        .catch(error => console.error('Error loading gallery page:', error));
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
    if (loc === pageUrls.contact){ RenderContactPage(); }
    else if(loc === pageUrls.about){ RenderAboutPage(); }
    else if (loc === pageUrls.home){ RenderHomePage();}
    else if (loc === pageUrls.gallery){ RenderGalleryPage();}
}

window.onpopstate = popStateHandler; 