import I_vCurso from "../interfaces/I_vCurso.js";

export default class Cl_vCurso implements I_vCurso {
  btVerEntregas: HTMLButtonElement;
  btEstudiantes: HTMLButtonElement;
  constructor() {
    this.btVerEntregas = document.getElementById(
      "curso_btVerEntregas",
    ) as HTMLButtonElement;
    this.btEstudiantes = document.getElementById(
      "curso_btEstudiantes",
    ) as HTMLButtonElement;
  }
  onBtVerEntregas(callback: () => void): void {
    this.btVerEntregas.onclick = callback;
  }
  onBtEstudiantes(callback: () => void): void {
    this.btEstudiantes.onclick = callback;
  }
  deshabilitarBotones() {
    this.btVerEntregas.disabled = true;
    this.btEstudiantes.disabled = true;
  }
  habilitarBotones() {
    this.btVerEntregas.disabled = false;
    this.btEstudiantes.disabled = false;
  }
}
