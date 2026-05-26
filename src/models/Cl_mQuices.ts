import Cl_mQuiz from "./Cl_mQuiz.js";

export default class Cl_mQuices {
  private quices: Cl_mQuiz[] = [];
  setQuices(array: any[]) {
    this.quices = [];
    array.forEach((quiz) => {
      this.quices.push(
        new Cl_mQuiz({
          cedula: quiz.cedula,
          nombre: quiz.nombre,
          respuesta1: quiz.respuesta1,
          respuesta2: quiz.respuesta2,
        }),
      );
    });
  }
  getQuices(soloCorrectos: boolean = false): Cl_mQuiz[] {
    let quicesFiltrados: Cl_mQuiz[] = [];
    if (soloCorrectos) {
      this.quices.forEach((quiz) => {
        if (quiz.esCorrecto()) {
          quicesFiltrados.push(quiz);
        }
      });
    } else {
      quicesFiltrados = this.quices;
    }
    return quicesFiltrados;
  }
}
