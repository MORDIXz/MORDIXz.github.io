document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. CONFIGURACIÓN DE AUDIO
    // =========================================================

    const sonidoVictoria =
        new Audio('../../AUDIO/booyha.mp3');

    const sonidoAlerta =
        new Audio('../../AUDIO/ContadorFInal.mp3');

    const sonidoJuego =
        new Audio('../../AUDIO/sonido-memorama.mp3');

    sonidoJuego.loop = true;

    const sonidoGameOver =
        new Audio('../../AUDIO/Game-over.mp3');


    let alertaReproducida = false;


    // =========================================================
    // 2. DATOS DE LAS CARTAS
    // =========================================================

    const cartasData = [

        {
            id: 1,
            nombre: 'PicaExplosion',
            imagen:
                '../../IMAGENES/DESCRIPCION_MANZANAS/Pica Fresa.jpeg'
        },

        {
            id: 2,
            nombre: 'Chocoblanco',
            imagen:
                '../../IMAGENES/DESCRIPCION_MANZANAS/Cholate blanco.jpeg'
        },

        {
            id: 3,
            nombre: 'Mordix Acaramelado',
            imagen:
                '../../IMAGENES/DESCRIPCION_MANZANAS/Mordix clasico acaramelado.jpeg'
        },

        {
            id: 4,
            nombre: "MORDIX Hershey's",
            imagen:
                '../../IMAGENES/DESCRIPCION_MANZANAS/Chocolate.jpeg'
        },

        {
            id: 4,
            nombre: "MORDIX Especial",
            imagen:
                '../../IMAGENES/SABORES__Y_MOMENTOS/mmmm.jpeg'
        },

        {
            id: 4,
            nombre: "Pandiloco",
            imagen:
                '../../IMG/Manzanas/manzana2.jpg'
        }

    ];


    // =========================================================
    // 3. CONFIGURACIÓN GENERAL
    // =========================================================

    const imagenDorso =
        '../../IMG/ICONOS/MORDIX.svg';


    const TIEMPO_INICIAL = 40;


    let tiempoRestante =
        TIEMPO_INICIAL;


    let temporizador = null;

    let juegoActivo = false;

    let paresEncontrados = 0;

    let tarjetaPuesta1 = null;

    let tarjetaPuesta2 = null;

    let bloqueandoTablero = false;


    // =========================================================
    // 4. SECCIÓN DEL JUEGO
    // =========================================================

    const seccionJuego =
        document.querySelector(
            '.contenido1.contenido_main.secciones'
        );


    if (!seccionJuego) return;


    // =========================================================
    // 5. CREACIÓN DE LA INTERFAZ
    // =========================================================

    seccionJuego.innerHTML = `

        <!-- =========================================
             MODAL DE INSTRUCCIONES
        ========================================== -->

        <div
            id="modal-instrucciones"
            class="modal-overlay"
        >

            <div class="modal-content">

                <h1
                    style="
                        color: #ce1b1b;
                        font-size: 2.2rem;
                    "
                >
                    Premios y Dinámica
                </h1>


                <p
                    style="
                        font-size: 1.1rem;
                        text-align: center;
                        color: #333;
                    "
                >

                    Este es un juego de memorama clásico,
                    contaras con una duracion inicial de

                    <span
                        style="
                            color: #ce1b1b;
                            font-weight: bolder;
                        "
                    >
                        ${TIEMPO_INICIAL}
                    </span>

                    segundos y tu objetivo es encontrar
                    todas las parejas de tarjetas antes
                    de que el tiempo se agote.

                    ¡Demuestra tu velocidad y gana
                    deliciosos premios!

                </p>


                <ul
                    class="modal-rules-list"
                    style="
                        display: flex;
                        flex-direction: column;
                        gap: 0.6rem;
                        text-align: left;
                        background: #f9f9f9;
                        padding: 1rem 1.5rem;
                        border-radius: 10px;
                        border-left: 5px solid #ce1b1b;
                        list-style: decimal inside;
                    "
                >

                    <li
                        style="
                            font-size: 1rem;
                            font-weight: normal;
                            color: #444;
                            cursor: default;
                        "
                    >
                        Si logras ganar en menos de
                        10 segundos obtendrás un
                        descuento de 90%.
                    </li>


                    <li
                        style="
                            font-size: 1rem;
                            font-weight: normal;
                            color: #444;
                            cursor: default;
                        "
                    >
                        Si logras terminar el juego en
                        menos de 20 segundos obtendrás
                        un descuento de 30%.
                    </li>


                    <li
                        style="
                            font-size: 1rem;
                            font-weight: normal;
                            color: #444;
                            cursor: default;
                        "
                    >
                        Si logras terminar el juego en
                        menos de 30 segundos tendrás
                        un descuento de 10%.
                    </li>


                    <li
                        style="
                            font-size: 1rem;
                            font-weight: normal;
                            color: #444;
                            cursor: default;
                        "
                    >
                        Si logras terminar el juego antes
                        que termine el tiempo obtendrás
                        un descuento de 5%.
                    </li>

                </ul>


                <div
                    class="modal-restricciones"
                    style="
                        font-size: 0.9rem;
                        color: #666;
                        background: #fff3f3;
                        padding: 0.8rem;
                        border-radius: 8px;
                        border: 1px dashed #ce1b1b;
                        text-align: justify;
                    "
                >

                    <strong>Restricciones:</strong>

                    Podras intentar el juego las veces
                    que quieras pero unicamente podras
                    reclamar este descuento una vez al
                    dia por persona y solo es valido para
                    una manzana mordix.

                </div>


                <button
                    id="btn-empezar-modal"
                    class="btn-juego"
                    style="
                        margin-top: 0.5rem;
                        padding: 0.9rem 2rem;
                        font-size: 1.2rem;
                        cursor: pointer;
                    "
                >
                    ¡Comenzar a Jugar!
                </button>

            </div>

        </div>


        <!-- =========================================
             CONTENEDOR PRINCIPAL
        ========================================== -->

        <div class="memorama-contenedor-principal">


            <!-- PANEL DE CONTROL -->

            <div id="panel-control-juego">

                <div class="contador-tiempo">

                    Tiempo restante:

                    <span id="tiempo-val">
                        ${TIEMPO_INICIAL}
                    </span>

                    s

                </div>


                <button
                    id="btn-iniciar-juego"
                    class="btn-juego"
                    style="display:none;"
                >
                    ¡Reiniciar Juego!
                </button>

            </div>


            <!-- TABLERO -->

            <div
                id="tablero-memorama"
                class="tablero-oculto"
            ></div>


            <!-- =====================================
                 GAME OVER
            ====================================== -->

            <div
                id="pantalla-gameover"
                class="overlay-juego oculto"
            >

                <h2 class="texto-gameover">
                    GAME OVER
                </h2>


                <button
                    id="btn-reintentar-go"
                    class="btn-juego"
                >
                    Intentar de nuevo
                </button>

            </div>


            <!-- =====================================
                 VICTORIA
            ====================================== -->

            <div
                id="pantalla-victoria"
                class="overlay-victoria oculto"
            >

                <h1 class="titulo-booyha">
                    BOOYHA
                </h1>


                <div class="tarjeta-premio">

                    <h2>

                        ¡Felicidades has ganado
                        un descuento del

                        <span id="porcentaje-descuento">
                            0%
                        </span>!

                    </h2>


                    <p class="txt-premio">

                        Tómale captura a esta pantalla
                        y envía tu comprobante por WhatsApp.

                    </p>


                    <p class="txt-premio">

                        Descuento valido para cualquier
                        sabor de Mordix.

                    </p>


                    <div class="contenedor-id-unico">

                        <span>
                            ID Único de Verificación:
                        </span>

                        <strong id="codigo-id-unico">
                            ---
                        </strong>

                    </div>


                    <a
                        id="enlace-whatsapp"
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn-whatsapp"
                    >
                        Enviar por WhatsApp
                    </a>

                </div>

            </div>

        </div>
    `;


    // =========================================================
    // 6. REFERENCIAS A ELEMENTOS
    // =========================================================

    const btnEmpezarModal =
        document.getElementById(
            'btn-empezar-modal'
        );


    const modalInstrucciones =
        document.getElementById(
            'modal-instrucciones'
        );


    const btnIniciar =
        document.getElementById(
            'btn-iniciar-juego'
        );


    const tablero =
        document.getElementById(
            'tablero-memorama'
        );


    const spanTiempo =
        document.getElementById(
            'tiempo-val'
        );


    const pantallaGameOver =
        document.getElementById(
            'pantalla-gameover'
        );


    const btnReintentarGO =
        document.getElementById(
            'btn-reintentar-go'
        );


    const pantallaVictoria =
        document.getElementById(
            'pantalla-victoria'
        );


    const spanDescuento =
        document.getElementById(
            'porcentaje-descuento'
        );


    const spanIdUnico =
        document.getElementById(
            'codigo-id-unico'
        );


    const enlaceWhatsapp =
        document.getElementById(
            'enlace-whatsapp'
        );


    // =========================================================
    // 7. EVENTOS
    // =========================================================

    btnEmpezarModal.addEventListener(
        'click',
        () => {

            modalInstrucciones.style.display =
                'none';

            iniciarJuego();

        }
    );


    btnIniciar.addEventListener(
        'click',
        iniciarJuego
    );


    btnReintentarGO.addEventListener(
        'click',
        reiniciarJuego
    );


    // =========================================================
    // 8. INICIAR JUEGO
    // =========================================================

    function iniciarJuego() {

        btnIniciar.style.display =
            'inline-block';


        tablero.classList.remove(
            'tablero-oculto'
        );


        pantallaGameOver.classList.add(
            'oculto'
        );


        pantallaVictoria.classList.add(
            'oculto'
        );


        tiempoRestante =
            TIEMPO_INICIAL;


        spanTiempo.textContent =
            tiempoRestante;


        paresEncontrados = 0;

        juegoActivo = true;


        tarjetaPuesta1 = null;

        tarjetaPuesta2 = null;

        bloqueandoTablero = false;


        alertaReproducida = false;


        // Música de fondo

        sonidoJuego.currentTime = 0;

        sonidoJuego
            .play()
            .catch(
                e =>
                    console.log(
                        "Audio de fondo bloqueado:",
                        e
                    )
            );


        generarTarjetas();

        iniciarTemporizador();

    }


    // =========================================================
    // 9. REINICIAR JUEGO
    // =========================================================

    function reiniciarJuego() {

        sonidoVictoria.pause();

        sonidoVictoria.currentTime = 0;


        sonidoAlerta.pause();

        sonidoAlerta.currentTime = 0;


        sonidoGameOver.pause();

        sonidoGameOver.currentTime = 0;


        detenerTemporizador();

        iniciarJuego();

    }


    // =========================================================
    // 10. TEMPORIZADOR
    // =========================================================

    function iniciarTemporizador() {

        detenerTemporizador();


        temporizador = setInterval(
            () => {

                tiempoRestante--;

                spanTiempo.textContent =
                    tiempoRestante;


                // ALERTA EN 10 SEGUNDOS

                if (
                    tiempoRestante === 10 &&
                    !alertaReproducida
                ) {

                    sonidoJuego.pause();

                    sonidoJuego.currentTime = 0;


                    sonidoAlerta
                        .play()
                        .catch(
                            e =>
                                console.log(
                                    "Audio de alerta bloqueado:",
                                    e
                                )
                        );


                    alertaReproducida = true;

                }


                // GAME OVER

                if (
                    tiempoRestante <= 0
                ) {

                    detenerTemporizador();

                    finalizarJuegoPorTiempo();

                }

            },

            1000
        );

    }


    function detenerTemporizador() {

        if (temporizador) {

            clearInterval(
                temporizador
            );

            temporizador = null;

        }

    }


    // =========================================================
    // 11. GENERAR CARTAS
    // =========================================================

    function generarTarjetas() {

        tablero.innerHTML = '';


        const cartasDuplicadas =
            [...cartasData, ...cartasData]
            .sort(
                () =>
                    Math.random() - 0.5
            );


        cartasDuplicadas.forEach(
            (item) => {

                const carta =
                    document.createElement(
                        'div'
                    );


                carta.classList.add(
                    'tarjeta-memorama'
                );


                carta.dataset.nombre =
                    item.nombre;


                carta.innerHTML = `

                    <div class="tarjeta-inner">

                        <div class="tarjeta-front">

                            <img
                                src="${imagenDorso}"
                                alt="Cara Externa"
                                class="img-dorso"
                            >

                        </div>


                        <div class="tarjeta-back">

                            <img
                                src="${item.imagen}"
                                alt="${item.nombre}"
                                class="img-frente"
                            >


                            <h2 class="nombre-carta">
                                ${item.nombre}
                            </h2>

                        </div>

                    </div>

                `;


                carta.addEventListener(
                    'click',
                    voltearCarta
                );


                tablero.appendChild(
                    carta
                );

            }
        );

    }


    // =========================================================
    // 12. VOLTEAR CARTA
    // =========================================================

    function voltearCarta() {

        if (
            !juegoActivo ||
            bloqueandoTablero
        ) return;


        if (
            this === tarjetaPuesta1 ||
            this.classList.contains(
                'encontrada'
            )
        ) return;


        this.classList.add(
            'volteada'
        );


        if (!tarjetaPuesta1) {

            tarjetaPuesta1 =
                this;

            return;

        }


        tarjetaPuesta2 =
            this;


        verificarCoincidencia();

    }


    // =========================================================
    // 13. COMPROBAR PAREJA
    // =========================================================

    function verificarCoincidencia() {

        const coinciden =
            tarjetaPuesta1.dataset.nombre ===
            tarjetaPuesta2.dataset.nombre;


        if (coinciden) {

            deshabilitarCartasCoincidentes();

        }

        else {

            voltearCartasNoCoincidentes();

        }

    }


    // =========================================================
    // 14. CARTAS CORRECTAS
    // =========================================================

    function deshabilitarCartasCoincidentes() {

        tarjetaPuesta1.classList.add(
            'encontrada'
        );


        tarjetaPuesta2.classList.add(
            'encontrada'
        );


        tarjetaPuesta1.removeEventListener(
            'click',
            voltearCarta
        );


        tarjetaPuesta2.removeEventListener(
            'click',
            voltearCarta
        );


        paresEncontrados++;


        reiniciarSeleccionTarjetas();


        // GANASTE

        if (
            paresEncontrados ===
            cartasData.length
        ) {

            detenerTemporizador();

            darVictoria();

        }

    }


    // =========================================================
    // 15. CARTAS INCORRECTAS
    // =========================================================

    function voltearCartasNoCoincidentes() {

        bloqueandoTablero = true;


        setTimeout(
            () => {

                tarjetaPuesta1.classList.remove(
                    'volteada'
                );


                tarjetaPuesta2.classList.remove(
                    'volteada'
                );


                reiniciarSeleccionTarjetas();

            },

            1000
        );

    }


    // =========================================================
    // 16. REINICIAR SELECCIÓN
    // =========================================================

    function reiniciarSeleccionTarjetas() {

        tarjetaPuesta1 = null;

        tarjetaPuesta2 = null;

        bloqueandoTablero = false;

    }


    // =========================================================
    // 17. GAME OVER
    // =========================================================

    function finalizarJuegoPorTiempo() {

        juegoActivo = false;


        sonidoJuego.pause();

        sonidoJuego.currentTime = 0;


        sonidoAlerta.pause();


        sonidoGameOver.currentTime = 0;


        sonidoGameOver
            .play()
            .catch(
                e =>
                    console.log(
                        "Audio de Game Over bloqueado:",
                        e
                    )
            );


        tablero.classList.add(
            'tablero-oculto'
        );


        pantallaGameOver.classList.remove(
            'oculto'
        );

    }


    // =========================================================
    // 18. VICTORIA
    // =========================================================

    function darVictoria() {

        juegoActivo = false;


        tablero.classList.add(
            'tablero-oculto'
        );


        sonidoAlerta.pause();

        sonidoAlerta.currentTime = 0;


        sonidoJuego.pause();

        sonidoJuego.currentTime = 0;


        sonidoVictoria
            .play()
            .catch(
                e =>
                    console.log(
                        "Audio bloqueado por el navegador:",
                        e
                    )
            );


        // TIEMPO UTILIZADO

        const tiempoTranscurrido =
            TIEMPO_INICIAL -
            tiempoRestante;


        let porcentaje = '5%';


        // DESCUENTO

        if (
            tiempoTranscurrido < 10
        ) {

            porcentaje = '90%';

        }

        else if (
            tiempoTranscurrido < 20
        ) {

            porcentaje = '30%';

        }

        else if (
            tiempoTranscurrido < 30
        ) {

            porcentaje = '10%';

        }

        else {

            porcentaje = '5%';

        }


        spanDescuento.textContent =
            porcentaje;


        // ID ÚNICO

        const idUnicoGenerado =

            'MORDIX-' +

            Math.random()
                .toString(36)
                .substring(2, 9)
                .toUpperCase() +

            '-' +

            Date.now()
                .toString()
                .slice(-4);


        spanIdUnico.textContent =
            idUnicoGenerado;


        // WHATSAPP

        const numeroTelefono =
            '5219673399423';


        const mensajeWhatsApp =
            encodeURIComponent(

                `¡Hola MORDIX! Gané el memorama ` +
                `en ${tiempoTranscurrido} segundos. ` +

                `Mi descuento obtenido es del ` +
                `${porcentaje}. ` +

                `Mi ID único de verificación es: ` +
                `${idUnicoGenerado}. ` +

                `Aquí está mi comprobante.`

            );


        enlaceWhatsapp.href =

            `https://wa.me/${numeroTelefono}` +
            `?text=${mensajeWhatsApp}`;


        // MOSTRAR VICTORIA

        pantallaVictoria.classList.remove(
            'oculto'
        );

    }

});
