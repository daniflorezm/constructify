import path from "path";
import fs from "fs";
import { app, BrowserWindow } from "electron";

// ---------------------------------------------------------------------
// Ruta de nuestro archivo de log
// ---------------------------------------------------------------------
const logFilePath = path.join(__dirname, "app.log");

// Función auxiliar para escribir en el log con timestamp
function logMessage(message: string) {
  const time = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${time}] ${message}\n`);
}

// ---------------------------------------------------------------------
// Ventana principal
// ---------------------------------------------------------------------
let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  logMessage("Creando la ventana principal de Electron.");

  // Dar un pequeño margen para que Express termine de levantarse
  setTimeout(() => {
    mainWindow?.loadURL("http://localhost:3001");
    logMessage("Cargando la URL: http://localhost:3001");
  }, 2000);
}

// ---------------------------------------------------------------------
// Inicialización de la app de Electron
// ---------------------------------------------------------------------
app.whenReady().then(() => {
  try {
    logMessage("Iniciando servidor Express...");
    import(path.join(__dirname, "app.js")); // Ahora usa import dinámico
    logMessage("Servidor Express iniciado correctamente en el puerto 3001.");
  } catch (err) {
    logMessage(`ERROR al iniciar servidor Express: ${(err as Error).message}`);
  }

  createWindow();
});

// ---------------------------------------------------------------------
// Evento de cierre de ventanas (salir de la app)
// ---------------------------------------------------------------------
app.on("window-all-closed", () => {
  logMessage("Cerrando la aplicación de Electron.");
  app.quit();
});

// ---------------------------------------------------------------------
// (Opcional) Capturar errores globales
// ---------------------------------------------------------------------
process.on("uncaughtException", (error) => {
  logMessage(`ERROR no capturado: ${error.message}`);
});

process.on("unhandledRejection", (reason) => {
  logMessage(`Promesa rechazada sin capturar: ${reason}`);
});
