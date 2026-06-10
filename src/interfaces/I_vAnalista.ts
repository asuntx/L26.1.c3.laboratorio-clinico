import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_mEstudio from "../models/Cl_mEstudio.js";

export default interface I_vAnalista {
  onSeleccionarExamen(callback: (examen: Cl_mExamen) => void): void;
  onFiltrar(callback: (filtro: "todos" | "pendiente" | "listo") => void): void;
  onGuardarResultado(callback: (estudioId: string, resultado: string) => void): void;
  onEnviarWhatsApp(callback: () => void): void;
  mostrar(): void;
  ocultar(): void;
  mostrarExamenes(examenes: Cl_mExamen[]): void;
  mostrarEstudios(
    estudios: Cl_mEstudio[],
    examen: Cl_mExamen,
    porcentajes: Record<string, number>,
  ): void;
  mostrarEstadisticas(
    totalExamenes: number,
    porcentajes: Record<string, number>,
    totales: Record<string, number>,
  ): void;
}
