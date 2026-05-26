import { I_vQuiz } from "../interfaces/I_vQuiz.js";

export default class Cl_vQuiz implements I_vQuiz {
  vista: HTMLElement | null;
  inCedula: HTMLInputElement;
  inNombre: HTMLInputElement;
  inRespuesta1: HTMLInputElement;
  inRespuesta2: HTMLSelectElement;
  btCancelar: HTMLButtonElement;
  btEnviar: HTMLButtonElement;
  constructor() {
    this.vista = document.getElementById("vehiculo") as HTMLElement;
    this.inCedula = document.getElementById(
      "quiz_inCedula",
    ) as HTMLInputElement;
    this.inNombre = document.getElementById(
      "quiz_inNombre",
    ) as HTMLInputElement;
    this.inRespuesta1 = document.getElementById(
      "quiz_inRespuesta1",
    ) as HTMLInputElement;
    this.inRespuesta2 = document.getElementById(
      "quiz_inRespuesta2",
    ) as HTMLSelectElement;
    this.btCancelar = document.getElementById(
      "quiz_btCancelar",
    ) as HTMLButtonElement;
    this.btEnviar = document.getElementById(
      "quiz_btEnviar",
    ) as HTMLButtonElement;
  }
  onEnviar(callback: () => void): void {
    this.btEnviar.onclick = callback;
  }
  get cedula(): number {
    return parseInt(this.inCedula.value.trim()) || 0;
  }
  get nombre(): string {
    return this.inNombre.value.trim();
  }
  get respuesta1(): number {
    return parseInt(this.inRespuesta1.value.trim()) || 0;
  }
  get respuesta2(): "negro" | "verde" | "plateado" {
    return this.inRespuesta2.value.trim() as "negro" | "verde" | "plateado";
  }
}
