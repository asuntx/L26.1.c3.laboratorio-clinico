import Cl_mEstudiante from "../models/Cl_mEstudiante.js";

export default interface I_vEstudiantes {
  cedula: number;
  nombre: string;
  onAgregar(callback: () => void): void;
  onModificar(callback: () => void): void;
  onEliminar(callback: () => void): void;
  onVolver(callback: () => void): void;
  mostrar(): void;
  ocultar(): void;
  mostrarEstudiantes(estudiantes: Cl_mEstudiante[]): void;
  limpiarInputs(): void;
}
