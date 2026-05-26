import Cl_mEstudiante from "./Cl_mEstudiante.js";

export default class Cl_mEstudiantes {
  private estudiantes: Cl_mEstudiante[] = [];
  setEstudiantes(array: Cl_mEstudiante[]) {
    this.estudiantes = [];
    array.forEach((estudiante) => {
      this.estudiantes.push(
        new Cl_mEstudiante({
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
        }),
      );
    });
  }
  getEstudiantes(): Cl_mEstudiante[] {
    return this.estudiantes;
  }
}
