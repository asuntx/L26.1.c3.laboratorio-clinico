import mockapi from "../services/Cl_sMockApi.js";
import Cl_mQuiz from "../models/Cl_mQuiz.js";
export default class Cl_sEntregas {
  private static apiUrl: string =
    "https://6a0a74b121e4456256960022.mockapi.io/quiz";

  static async getEntregas(): Promise<{
    ok: boolean;
    tabla: Cl_mQuiz[];
  }> {
    let entregas = mockapi.getTabla({ tabla: "quiz" });
    return entregas;
  }
}
