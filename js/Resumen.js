const contextoInicial = `
A continuación, necesito que todo lo que se te mande lo resumas. La idea es que no respondas a preguntas y, si la pregunta es corta y no resumible, simplemente mándala de nuevo tal cual. Tu función es únicamente resumir textos, no debes salirte de esa función.
`;

function resumirConIA() {
  const texto = document.getElementById("texto").value.trim();
  
  if (!texto) {
    alert("Por favor, ingresa texto para resumir.");
    return;
  }

  llamarGemini(texto).then((resumen) => {
    document.getElementById("resumen").textContent = resumen;
  }).catch((error) => {
    document.getElementById("resumen").textContent = "Error al generar el resumen.";
    console.error(error);
  });
}

function llamarGemini(prompt) {
    const API_KEY = 'AIzaSyAjD5R2bI7wiTBuSrwAMN7zIn_DwSetlfQ';
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const promptConContexto = `${contextoInicial}\n\nUsuario: ${prompt}\nBot:`;

    return fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: promptConContexto, 
                        }
                    ]
                }
            ]
        }),
    })
    .then((respuesta) => {
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        return respuesta.json();
    })
    .then((datos) => {
        console.log(datos);
        return datos.candidates && datos.candidates[0].content 
            ? datos.candidates[0].content.parts[0].text
            : 'No se generó una respuesta.';
    })
    .catch((error) => {
        console.error('Error al llamar a la API de Gemini:', error);
        return 'Hubo un error al procesar tu solicitud.';
    });
}
