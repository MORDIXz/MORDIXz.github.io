const contenedor = document.getElementById('trigger-secreto');
    const enlace = document.getElementById('link-secreto');
    const contrasenaSecreta ="mordix";
    let contadorClics = 0;
    let tiempoReseteo = null;

    contenedor.addEventListener('click', function(e) {
        // Evitamos que el enlace navegue por defecto
        e.preventDefault();
        
        contadorClics++;

        clearTimeout(tiempoReseteo);
        tiempoReseteo = setTimeout(() => {
            contadorClics = 0;
        }, 1000); // 1 segundo de límite

        // Al llegar a los 7 clics seguidos
        if (contadorClics === 7) {
            contadorClics = 0;
            clearTimeout(tiempoReseteo);

            alert('¡Wow Has encontrado mi pagina secreta!');
            let respuesta = prompt("Te doy una pista: ¿Cuál es el nombre de tu marca de manzanas favoritas?");

            if (respuesta !==null){
                if(respuesta.toLowerCase().trim() ==contrasenaSecreta){
                    alert("!Felicidades contraseña correcta, puedes pasar!")
                    window.location.href = "pascua.html";
                }else{
                    alert("Ups contraseña incorrecta")
                }
            }
            
        }
    });






    
