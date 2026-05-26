export default interface I_vCurso {
  onBtVerEntregas(callback: () => void): void;
  onBtEstudiantes(callback: () => void): void;
  deshabilitarBotones(): void;
  habilitarBotones(): void;
}
