import Cl_mQuiz from "../models/Cl_mQuiz.js";
import mockapi from "./Cl_sMockApi.js";
export default class Cl_sQuiz {
  static async agregar(
    nuevoQuiz: Cl_mQuiz,
  ): Promise<{ ok: boolean; mensaje: string }> {
    const result = await mockapi.post(nuevoQuiz.toJSON());
    return result;
  }

  static async existe(
    cedula: number,
  ): Promise<{ ok: boolean; existe: boolean }> {
    const result = await mockapi.existeId({ tabla: "quiz", id: cedula });
    return result;
  }
}
