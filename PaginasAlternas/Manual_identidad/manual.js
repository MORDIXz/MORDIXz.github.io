

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const urlPdf = 'MANUAL_IDENTIDAD_MORDIX.pdf'; // Asegúrate de que la ruta sea correcta
    const contenedorPdf = document.getElementById('pdf-viewer');

    pdfjsLib.getDocument(urlPdf).promise.then(async (pdfDoc) => {
        const totalPaginas = pdfDoc.numPages;

        for (let numPagina = 1; numPagina <= totalPaginas; numPagina++) {
            const pagina = await pdfDoc.getPage(numPagina);
            const canvas = document.createElement('canvas');
            const contexto = canvas.getContext('2d');
            
            const viewport = pagina.getViewport({ scale: 1.5 }); // Escala de nitidez
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await pagina.render({
                canvasContext: contexto,
                viewport: viewport
            }).promise;

            contenedorPdf.appendChild(canvas);
        }
    }).catch(error => {
        console.error("Error al cargar el PDF:", error);
    });

