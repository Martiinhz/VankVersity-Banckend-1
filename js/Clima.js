// Función para obtener el clima de Meteosource
const obtenerClimaMeteosource = () => {
    const apiKey = "hi7z1bz5om0dyufbpixh3eargmnogxuypeqoxkfw";
    const url = `https://www.meteosource.com/api/v1/free/point?place_id=medellin&sections=current&timezone=auto&language=en&units=metric&key=${apiKey}`;
  
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        resolve(data);
      } catch (error) {
        console.error("Error al obtener el clima de Meteosource:", error);
        reject(error);
      }
    });
  };
  
  // Función para obtener el clima de Weatherstack
  const obtenerClimaWeatherstack = () => {
    const apiKey = "8798ddabe1690351dd1ac65af03c44de"; // Reemplaza con tu API key
    // Usamos Medellín, Antioquia para obtener datos más precisos
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=Medellín,Antioquia,Colombia&units=m`;
  
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        resolve(data);
      } catch (error) {
        console.error("Error al obtener el clima de Weatherstack:", error);
        reject(error);
      }
    });
  };
  
  // Evento al hacer clic en el botón
  document.querySelector(".button").addEventListener("click", async () => {
    const box = document.querySelector(".box");
    box.textContent = "Cargando datos del clima...";
  
    try {
      // Ejecutamos ambas funciones para obtener los datos de las dos APIs
      const climaMeteosource = await obtenerClimaMeteosource();
      const climaWeatherstack = await obtenerClimaWeatherstack();
  
      // Imprimir los datos de ambas APIs para verificar
      console.log("Datos de Meteosource:", climaMeteosource);
      console.log("Datos de Weatherstack:", climaWeatherstack);
  
      // Tomamos el primero que responde más rápido con Promise.race
      const clima = await Promise.race([obtenerClimaMeteosource(), obtenerClimaWeatherstack()]);
  
      const current = clima.current || clima.current_weather; // Ajustar dependiendo de la API que devuelva
  
      // Determinar el estado y temperatura según la respuesta
      const estado = current.weather_descriptions ? current.weather_descriptions[0] : current.summary || "Estado no disponible";
      const temperatura = current.temperature || "Temperatura no disponible";
  
      // Mostrar la información en la caja
      box.textContent = `Estado: ${estado}. Temperatura: ${temperatura}°C.`;
    } catch (error) {
      box.textContent = "Error al obtener los datos del clima.";
      console.error("Error al obtener los datos del clima:", error);  // Log del error
    }
  });
  