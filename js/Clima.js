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
      console.log("Datos de Meteosource:", data);
      resolve(data);
    } catch (error) {
      console.error("Error al obtener el clima de Meteosource:", error);
      reject(error);
    }
  });
};

const obtenerClimaWeatherstack = () => {
  const apiKey = "8798ddabe1690351dd1ac65af03c44de"; 
  const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=Medellín,Antioquia,Colombia&units=m`;

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log("Datos de Weatherstack:", data);
      resolve(data);
    } catch (error) {
      console.error("Error al obtener el clima de Weatherstack:", error);
      reject(error);
    }
  });
};

const obtenerClimaOpenMeteo = () => {
  const lat = 6.25184; 
  const lon = -75.56359; 
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log("Datos de Open-Meteo:", data);
      resolve(data);
    } catch (error) {
      console.error("Error al obtener el clima de Open-Meteo:", error);
      reject(error);
    }
  });
};

document.querySelector(".button").addEventListener("click", async () => {
  const box = document.querySelector(".box");
  box.textContent = "Cargando datos del clima...";

  try {
    const climaMeteosource = obtenerClimaMeteosource();
    const climaWeatherstack = obtenerClimaWeatherstack();
    const climaOpenMeteo = obtenerClimaOpenMeteo();

    await Promise.all([climaMeteosource, climaWeatherstack, climaOpenMeteo]);

    const clima = await Promise.race([
      obtenerClimaMeteosource(),
      obtenerClimaWeatherstack(),
      obtenerClimaOpenMeteo(),
    ]);

    const estado = clima.current
      ? clima.current.weather_descriptions
        ? clima.current.weather_descriptions[0]
        : clima.current.summary || "Estado no disponible"
      : clima.current_weather
      ? `Código del clima: ${clima.current_weather.weathercode}`
      : "Estado no disponible";

    const temperatura = clima.current
      ? clima.current.temperature || "Temperatura no disponible"
      : clima.current_weather
      ? clima.current_weather.temperature
      : "Temperatura no disponible";

    box.textContent = `Estado: ${estado}. Temperatura: ${temperatura}°C.`;
  } catch (error) {
    box.textContent = "Error al obtener los datos del clima.";
    console.error("Error al obtener los datos del clima:", error);
  }
});
