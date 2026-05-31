import Cl_mQuiz from "../models/Cl_mQuiz.js";
import Cl_sProyecto from "./Cl_sProyecto.js";

export default class Cl_sQuiz extends Cl_sProyecto {
  static async agregar(
    nuevoQuiz: Cl_mQuiz,
  ): Promise<{ ok: boolean; mensaje: string }> {
    return super.agregar(nuevoQuiz.toJSON());
  }

  static async existe(
    tablaId: number,
  ): Promise<{ ok: boolean; existe: boolean }> {
    return super.existeId({
      tabla: "quiz",
      tablaId,
      tablaIdName: "cedula",
    });
  }
}
