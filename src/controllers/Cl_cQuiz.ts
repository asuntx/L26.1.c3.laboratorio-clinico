import { I_vQuiz } from "../interfaces/I_vQuiz.js";
import Cl_mQuiz from "../models/Cl_mQuiz.js";
import sQuiz from "../services/Cl_sQuiz.js";

export default class Cl_cQuiz {
  private vista: I_vQuiz;
  constructor(vista: I_vQuiz) {
    this.vista = vista;
    this.vista.onEnviar(() => this.btEnviarOnClick());
  }
  async btEnviarOnClick() {
    let quiz = new Cl_mQuiz({
      cedula: this.vista.cedula,
      nombre: this.vista.nombre,
      respuesta1: this.vista.respuesta1,
      respuesta2: this.vista.respuesta2,
    });
    let chkExiste = await sQuiz.existe(quiz.cedula);
    if (chkExiste.ok === false) {
      alert("Error: No se pudo conectar con el servidor");
      return;
    }
    if (chkExiste.existe) {
      alert("Ya existe un quiz registrado con esa cédula");
      return;
    }
    sQuiz.agregar(quiz).then((resultado) => {
      alert(resultado.mensaje);
    });
  }
}
