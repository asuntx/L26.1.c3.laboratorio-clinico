import I_vEntregas from "../interfaces/I_vEntregas.js";
import Cl_mQuiz from "../models/Cl_mQuiz.js";

export default class Cl_vEntregas implements I_vEntregas {
  ui: HTMLDivElement;
  btRecargar: HTMLButtonElement;
  btVolver: HTMLButtonElement;
  chkSoloCorrectos: HTMLInputElement;
  tblRegistros: HTMLTableElement;
  constructor() {
    this.ui = document.getElementById("entregas") as HTMLDivElement;
    this.tblRegistros = document.getElementById(
      "entregas_tblRegistros",
    ) as HTMLTableElement;
    this.btRecargar = document.getElementById(
      "entregas_btRecargar",
    ) as HTMLButtonElement;
    this.btVolver = document.getElementById(
      "entregas_btVolver",
    ) as HTMLButtonElement;
    this.chkSoloCorrectos = document.getElementById(
      "entregas_chkSoloCorrectos",
    ) as HTMLInputElement;
    this.chkSoloCorrectos.onchange = () => this.onChangeSoloCorrectos(() => {});
  }
  get soloCorrectos(): boolean {
    return this.chkSoloCorrectos.checked;
  }
  onChangeSoloCorrectos(callback: () => void): void {
    this.chkSoloCorrectos.onchange = callback;
  }
  onRecargar(callback: () => void): void {
    this.btRecargar.onclick = callback;
  }
  onVolver(callback: () => void): void {
    this.btVolver.onclick = callback;
  }
  mostrarQuices(quices: Cl_mQuiz[]): void {
    this.tblRegistros.innerHTML = "";
    quices.forEach((quiz: Cl_mQuiz) => {
      this.tblRegistros.innerHTML += `<tr>
        <td>${quiz.cedula}</td>
        <td>${quiz.nombre}</td>
        <td>${quiz.respuesta1}</td>
        <td>${quiz.respuesta2}</td>
      </tr>`;
    });
  }
  mostrar() {
    this.ui.removeAttribute("hidden");
  }
  ocultar() {
    this.ui.setAttribute("hidden", "true");
  }
}
