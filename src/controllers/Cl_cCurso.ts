import vCurso from "../interfaces/I_vCurso.js";
import Cl_mEstudiantes from "../models/Cl_mEstudiantes.js";
import Cl_mQuices from "../models/Cl_mQuices.js";
import Cl_vEntregas from "../views/Cl_vEntregas.js";
import Cl_vEstudiantes from "../views/Cl_vEstudiantes.js";
import cEntregas from "./Cl_cEntregas.js";
import cEstudiantes from "./Cl_cEstudiantes.js";

export default class Cl_cCurso {
  private vista: vCurso;
  constructor({  vista }: { vista: vCurso }) {
    this.vista = vista;
    this.vista.onBtVerEntregas(() => this.onBtVerEntregas());
    this.vista.onBtEstudiantes(() => this.onBtEstudiantes());
  }
  onBtVerEntregas() {
    this.vista.deshabilitarBotones();
    const vEntregas = new Cl_vEntregas();
    const mQuices = new Cl_mQuices();
    new cEntregas({
      modelo: mQuices,
      vista: vEntregas,
      volverCallback: () => this.vista.habilitarBotones(),
    });
  }
  onBtEstudiantes() {
    this.vista.deshabilitarBotones();
    const vEstudiantes = new Cl_vEstudiantes();
    const mEstudiantes = new Cl_mEstudiantes();
    new cEstudiantes({
      modelo: mEstudiantes,
      vista: vEstudiantes,
      volverCallback: () => this.vista.habilitarBotones(),
    });
  }
}
