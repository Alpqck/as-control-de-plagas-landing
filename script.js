// ============================================================
// As Control de Plagas — landing page
// Sin dependencias externas: menu mobile, header que reacciona al
// scroll, animacion de aparicion progresiva y el formulario de
// contacto (manda el mail via Formspree, ver inicializarFormularioContacto).
// ============================================================

// la empresa arranco en 2008: esto se recalcula solo cada anio, sin
// tener que tocar el HTML nunca mas.
const ANIO_FUNDACION = 2008;

document.addEventListener('DOMContentLoaded', () => {
    inicializarHeader();
    inicializarMenuMobile();
    inicializarScrollReveal();
    inicializarFormularioContacto();
    inicializarScrollspy();

    const anioActual = new Date().getFullYear();
    document.getElementById('anio-actual').textContent = anioActual;
    document.getElementById('anios-experiencia').textContent = anioActual - ANIO_FUNDACION;
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

// ---------- resalta en el menu la seccion que se esta viendo ----------

function inicializarScrollspy() {
    const secciones = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('.nav__link');

    const marcarActivo = (id) => {
        links.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
    };

    if (!('IntersectionObserver' in window) || secciones.length === 0) return;

    const observer = new IntersectionObserver((entradas) => {
        const visible = entradas.find(entrada => entrada.isIntersecting);
        if (visible) marcarActivo(visible.target.id);
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    secciones.forEach(seccion => observer.observe(seccion));
}

// ---------- formulario de contacto ----------

function inicializarFormularioContacto() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('contact-form-status');
    const boton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        if (!form.checkValidity()) {
            status.classList.add('is-error');
            status.textContent = 'Completa todos los campos antes de enviar.';
            return;
        }

        boton.disabled = true;
        status.classList.remove('is-error');
        status.textContent = 'Enviando...';

        try {
            const respuesta = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (!respuesta.ok) throw new Error('El servicio de envio no respondio bien');

            status.textContent = 'Gracias, te vamos a contactar a la brevedad.';
            form.reset();
        } catch (error) {
            status.classList.add('is-error');
            status.textContent = 'No se pudo enviar. Probá de nuevo o escribinos por WhatsApp.';
        } finally {
            boton.disabled = false;
        }
    });
}
