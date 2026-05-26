import Cl_mQuiz from "../models/Cl_mQuiz";

export default interface I_vEntregas {
  soloCorrectos: boolean;
  mostrarQuices(quices: Cl_mQuiz[]): void;
  onRecargar(callback: () => void): void;
  onChangeSoloCorrectos(callback: () => void): void;
  onVolver(callback: () => void): void;
  mostrar(): void;
  ocultar(): void;
}
