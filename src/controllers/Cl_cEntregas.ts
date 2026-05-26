import I_vEntregas from "../interfaces/I_vEntregas.js";
import entregas from "../services/Cl_sEntregas.js";
import Cl_mQuices from "../models/Cl_mQuices.js";

export default class Cl_cEntregas {
  private modelo: Cl_mQuices;
  private vista: I_vEntregas;
  private volverCallback: () => void;
  constructor({
    modelo,
    vista,
    volverCallback,
  }: {
    modelo: Cl_mQuices;
    vista: I_vEntregas;
    volverCallback: () => void;
  }) {
    this.modelo = modelo;
    this.vista = vista;
    this.volverCallback = volverCallback;
    this.vista.onRecargar(() => this.btRecargarOnClick());
    this.vista.onChangeSoloCorrectos(() => this.onChangeSoloCorrectos());
    this.vista.onVolver(() => this.onVolver());
    this.vista.mostrar();
    this.btRecargarOnClick();
  }
  onChangeSoloCorrectos() {
    this.btRecargarOnClick();
  }
  onVolver() {
    this.vista.ocultar();
    this.volverCallback();
  }
  async btRecargarOnClick() {
    let resultado = await entregas.getEntregas();
    if (resultado.ok === false) {
      alert("Error: No se pudo conectar con el servidor");
      return;
    }
    this.modelo.setQuices(resultado.tabla);
    this.vista.mostrarQuices(this.modelo.getQuices(this.vista.soloCorrectos));
  }
}
