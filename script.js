// ============================================================
// As Control de Plagas — landing page
// Sin dependencias externas: menu mobile, header que reacciona al
// scroll, animacion de aparicion progresiva y el formulario de
// contacto (por ahora solo confirma en pantalla; conectarlo a un
// servicio real de email/backend antes de publicar).
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    inicializarHeader();
    inicializarMenuMobile();
    inicializarScrollReveal();
    inicializarFormularioContacto();
    document.getElementById('anio-actual').textContent = new Date().getFullYear();
});

// ---------- header con fondo al hacer scroll ----------

function inicializarHeader() {
    const header = document.getElementById('header');

    const actualizar = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    actualizar();
    window.addEventListener('scroll', actualizar, { passive: true });
}

// ---------- menu hamburguesa mobile ----------

function inicializarMenuMobile() {
    const boton = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');

    boton.addEventListener('click', () => {
        const abierto = nav.classList.toggle('is-open');
        boton.classList.toggle('is-open', abierto);
        boton.setAttribute('aria-expanded', String(abierto));
    });

    // cerrar el menu al elegir un link (mejor experiencia en mobile)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            boton.classList.remove('is-open');
            boton.setAttribute('aria-expanded', 'false');
        });
    });
}

// ---------- aparicion progresiva de elementos al scrollear ----------

function inicializarScrollReveal() {
    const elementos = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        elementos.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada, indice) => {
            if (entrada.isIntersecting) {
                // pequeno desfase entre elementos vecinos para que no
                // aparezcan todos exactamente al mismo tiempo
                setTimeout(() => entrada.target.classList.add('is-visible'), indice % 3 * 80);
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    elementos.forEach(el => observer.observe(el));
}

// ---------- formulario de contacto ----------

function inicializarFormularioContacto() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('contact-form-status');

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();

        if (!form.checkValidity()) {
            status.textContent = 'Completa todos los campos antes de enviar.';
            status.classList.add('is-error');
            return;
        }

        // TODO: conectar con un servicio real (ej. Formspree, o un
        // endpoint propio que mande el mail) antes de publicar el sitio.
        // Por ahora solo confirma en pantalla que se completo el formulario.
        status.classList.remove('is-error');
        status.textContent = 'Gracias, te vamos a contactar a la brevedad.';
        form.reset();
    });
}
