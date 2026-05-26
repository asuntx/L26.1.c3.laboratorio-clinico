export interface I_vQuiz {
  get cedula(): number;
  get nombre(): string;
  get respuesta1(): number;
  get respuesta2(): "negro" | "verde" | "plateado";
  onEnviar(callback: () => void): void;
}
