import I_vEstudiantes from "../interfaces/I_vEstudiantes.js";
import Cl_mEstudiante from "../models/Cl_mEstudiante.js";

export default class Cl_vEstudiantes implements I_vEstudiantes {
  ui: HTMLElement;
  inCedula: HTMLInputElement;
  inNombre: HTMLInputElement;
  btAgregar: HTMLButtonElement;
  btVolver: HTMLButtonElement;
  tblRegistros: HTMLTableSectionElement;

  constructor() {
    this.ui = document.getElementById("estudiantes") as HTMLElement;
    this.inCedula = document.getElementById(
      "estudiantes_inCedula",
    ) as HTMLInputElement;
    this.inNombre = document.getElementById(
      "estudiantes_inNombre",
    ) as HTMLInputElement;
    this.btAgregar = document.getElementById(
      "estudiantes_btAgregar",
    ) as HTMLButtonElement;
    this.btVolver = document.getElementById(
      "estudiantes_btVolver",
    ) as HTMLButtonElement;
    this.tblRegistros = document.getElementById(
      "estudiantes_tblRegistros",
    ) as HTMLTableSectionElement;
  }

  get cedula(): number {
    return parseInt(this.inCedula.value.trim()) || 0;
  }

  get nombre(): string {
    return this.inNombre.value.trim();
  }

  onAgregar(callback: () => void): void {
    this.btAgregar.onclick = callback;
  }

  onVolver(callback: () => void): void {
    this.btVolver.onclick = callback;
  }

  mostrar(): void {
    this.ui.removeAttribute("hidden");
  }

  ocultar(): void {
    this.ui.setAttribute("hidden", "true");
  }

  mostrarEstudiantes(estudiantes: Cl_mEstudiante[]): void {
    this.tblRegistros.innerHTML = "";
    estudiantes.forEach((estudiante) => {
      this.tblRegistros.innerHTML += `<tr>
        <td>${estudiante.cedula}</td>
        <td>${estudiante.nombre}</td>
      </tr>`;
    });
  }

  limpiarInputs(): void {
    this.inCedula.value = "";
    this.inNombre.value = "";
  }
}
