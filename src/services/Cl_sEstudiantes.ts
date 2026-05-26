import Cl_mEstudiante from "../models/Cl_mEstudiante.js";
import mockapi from "../services/Cl_sMockApi.js";

export default class Cl_sEstudiantes {
  static async existe(
    cedula: number,
  ): Promise<{ ok: boolean; existe: boolean }> {
    const result = await mockapi.existeId({ tabla: "estudiante", id: cedula });
    return result;
  }

  static async agregar(
    nuevoEstudiante: Cl_mEstudiante,
  ): Promise<{ ok: boolean; mensaje: string }> {
    const result = await mockapi.post(nuevoEstudiante.toJSON());
    return result;
  }

  static async getEstudiantes(): Promise<{
    ok: boolean;
    tabla: Cl_mEstudiante[];
  }> {
    let entregas = mockapi.getTabla({ tabla: "estudiante" });
    return entregas;
  }
}
