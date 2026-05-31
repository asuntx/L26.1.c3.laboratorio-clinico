import Cl_sProyecto from "./Cl_sProyecto.js";
import Cl_mQuiz from "../models/Cl_mQuiz.js";

export default class Cl_sEntregas extends Cl_sProyecto {
  static async getEntregas(): Promise<{
    ok: boolean;
    tabla: Cl_mQuiz[];
  }> {
    return super.getTabla({ tabla: "quiz" });
  }
}
