// Variables globales
let razonesVistas = [];
let razonActual = null;

// Elementos del DOM
const btnRazon = document.getElementById('btn-razon');
const btnReset = document.getElementById('btn-reset');
const razonDisplay = document.getElementById('razon-display');
const contadorTexto = document.getElementById('contador-texto');

// Cargar razones vistas del localStorage si existen
function cargarProgreso() {
    const guardado = localStorage.getItem('razonesVistas');
    if (guardado) {
        razonesVistas = JSON.parse(guardado);
        actualizarContador();
    }
}

// Guardar progreso en localStorage
function guardarProgreso() {
    localStorage.setItem('razonesVistas', JSON.stringify(razonesVistas));
}

// Actualizar el contador
function actualizarContador() {
    contadorTexto.textContent = `${razonesVistas.length} / ${razones.length} razones`;
}

// Obtener una razón aleatoria que no se haya visto
function obtenerRazonAleatoria() {
    // Si ya se vieron todas, reiniciar
    if (razonesVistas.length === razones.length) {
        razonesVistas = [];
        mostrarMensajeEspecial("Has descubierto todas las razones. Reiniciando...");
        setTimeout(() => {
            guardarProgreso();
            actualizarContador();
        }, 2500);
        return null;
    }

    // Obtener razones disponibles
    const razonesDisponibles = razones.filter((_, index) => !razonesVistas.includes(index));
    
    // Seleccionar una aleatoria
    const indiceAleatorio = Math.floor(Math.random() * razonesDisponibles.length);
    const razonSeleccionada = razonesDisponibles[indiceAleatorio];
    
    // Guardar el índice de la razón vista
    const indiceOriginal = razones.indexOf(razonSeleccionada);
    razonesVistas.push(indiceOriginal);
    
    guardarProgreso();
    actualizarContador();
    
    return razonSeleccionada;
}

// Mostrar una razón con animación
function mostrarRazon() {
    const razon = obtenerRazonAleatoria();
    
    if (razon === null) return;
    
    // Animar la salida del texto actual
    razonDisplay.style.opacity = '0';
    razonDisplay.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        razonDisplay.textContent = razon;
        razonDisplay.style.opacity = '1';
        razonDisplay.style.transform = 'translateY(0)';
        razonDisplay.classList.add('nueva-razon');
        
        // Remover la clase después de la animación
        setTimeout(() => {
            razonDisplay.classList.remove('nueva-razon');
        }, 800);
    }, 300);
    
    // Crear corazones flotantes
    crearCorazones(btnRazon);
}

// Mostrar mensaje especial
function mostrarMensajeEspecial(mensaje) {
    razonDisplay.style.opacity = '0';
    setTimeout(() => {
        razonDisplay.textContent = mensaje;
        razonDisplay.style.opacity = '1';
    }, 400);
}

// Crear corazones flotantes cuando se presiona el botón
function crearCorazones(elemento) {
    const rect = elemento.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Crear menos partículas pero más elegantes
    for (let i = 0; i < 8; i++) {
        const corazon = document.createElement('div');
        corazon.classList.add('corazon-click');
        corazon.textContent = '•';
        
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 40;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        corazon.style.left = x + 'px';
        corazon.style.top = y + 'px';
        
        // Dirección aleatoria para cada partícula
        const tx = (Math.random() - 0.5) * 100;
        const ty = (Math.random() - 0.5) * 100 - 50;
        corazon.style.setProperty('--tx', tx + 'px');
        corazon.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(corazon);
        
        setTimeout(() => {
            corazon.remove();
        }, 1000);
    }
}

// Reiniciar el contador
function reiniciarContador() {
    if (confirm('¿Reiniciar el progreso?')) {
        razonesVistas = [];
        guardarProgreso();
        actualizarContador();
        razonDisplay.textContent = 'Progreso reiniciado. Presiona el botón para descubrir una razón.';
        razonDisplay.style.opacity = '1';
    }
}

// Event listeners
btnRazon.addEventListener('click', mostrarRazon);
btnReset.addEventListener('click', reiniciarContador);

// Cargar progreso al iniciar
cargarProgreso();

// Agregar estilos de transición al razon-display
razonDisplay.style.transition = 'all 0.3s ease';
