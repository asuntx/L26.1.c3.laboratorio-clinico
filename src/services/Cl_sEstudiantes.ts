import Cl_mEstudiante from "../models/Cl_mEstudiante.js";
import Cl_sProyecto from "./Cl_sProyecto.js";

export default class Cl_sEstudiantes extends Cl_sProyecto {
  static async existe(
    tablaId: number,
  ): Promise<{ ok: boolean; existe: boolean }> {
    return super.existeId({
      tabla: "estudiante",
      tablaId,
      tablaIdName: "cedula",
    });
  }

  static async agregar(
    nuevoEstudiante: Cl_mEstudiante,
  ): Promise<{ ok: boolean; mensaje: string }> {
    return super.agregar(nuevoEstudiante.toJSON());
  }

  static async modificar(
    tablaId: number,
    datos: any,
  ): Promise<{ ok: boolean; mensaje: string }> {
    return super.modificar(tablaId, datos, "cedula");
  }

  static async eliminar(
    tablaId: number,
  ): Promise<{ ok: boolean; mensaje: string }> {
    return super.eliminar(tablaId, "estudiante", "cedula");
  }

  static async getEstudiantes(): Promise<{
    ok: boolean;
    tabla: Cl_mEstudiante[];
  }> {
    return super.getTabla({ tabla: "estudiante" });
  }
}
