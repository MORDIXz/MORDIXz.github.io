// Seleccionamos el elemento desplegable
const dropdown = document.querySelector('.menu-desplegable');

// Escuchamos el evento de clic
dropdown.addEventListener('click', (e) => {
    // Evitamos que el clic se propague si es necesario
    e.stopPropagation(); 
    // Alterna la clase 'abierto' (si la tiene la quita, si no la pone)
    dropdown.classList.toggle('abierto');
});

// Opcional: Si haces clic en cualquier otra parte de la pantalla, se cierra el menú
window.addEventListener('click', () => {
    if (dropdown.classList.contains('abierto')) {
        dropdown.classList.remove('abierto');
    }
});

//SECCION PARA EL BAR NAV HAMBURGUESA
// Seleccionamos el botón hamburguesa y el menú de navegación
const btnHamb = document.querySelector('.btn-hamburguesa');
const navMenu = document.querySelector('.nav-menu');

// Escuchamos el clic en el botón hamburguesa
btnHamb.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que se cierre de inmediato por el evento global
    navMenu.classList.toggle('activo'); // Alterna la clase que muestra el menú
});

// Opcional: Cerrar el menú si haces clic fuera de él en dispositivos móviles
window.addEventListener('click', () => {
    if (navMenu.classList.contains('activo')) {
        navMenu.classList.remove('activo');
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carruselTrack");
    if (!track) return; // Si no existe el carrusel en otra página, evita errores

    const slides = Array.from(track.children);
    const nextBtn = document.getElementById("btnNext");
    const prevBtn = document.getElementById("btnPrev");
    const dotsContainer = document.getElementById("carruselDots");
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Crear los puntos indicadores dinámicamente
    slides.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            moveToSlide(index);
            resetInterval();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    function moveToSlide(index) {
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots(currentIndex);
    }

    // Botones laterales
    nextBtn.addEventListener("click", () => {
        moveToSlide(currentIndex + 1);
        resetInterval();
    });

    prevBtn.addEventListener("click", () => {
        moveToSlide(currentIndex - 1);
        resetInterval();
    });

    // Auto-play (cambia de imagen cada 4 segundos)
    let slideInterval = setInterval(() => {
        moveToSlide(currentIndex + 1);
    }, 4000);

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 4000);
    }
});