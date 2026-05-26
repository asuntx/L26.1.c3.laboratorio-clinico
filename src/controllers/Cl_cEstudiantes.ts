import sEstudiantes from "../services/Cl_sEstudiantes.js";
import I_vEstudiantes from "../interfaces/I_vEstudiantes.js";
import Cl_mEstudiante from "../models/Cl_mEstudiante.js";
import Cl_mEstudiantes from "../models/Cl_mEstudiantes.js";

export default class Cl_cEstudiantes {
  private modelo: Cl_mEstudiantes;
  private vista: I_vEstudiantes;
  private volverCallback: () => void;

  constructor({
    modelo,
    vista,
    volverCallback,
  }: {
    modelo: Cl_mEstudiantes;
    vista: I_vEstudiantes;
    volverCallback: () => void;
  }) {
    this.modelo = modelo;
    this.vista = vista;
    this.volverCallback = volverCallback;
    this.vista.onAgregar(() => this.onAgregar());
    this.vista.onVolver(() => this.onVolver());
    this.vista.mostrar();
    this.cargarEstudiantes();
  }

  private async onAgregar() {
    let estudiante = new Cl_mEstudiante({
      cedula: this.vista.cedula,
      nombre: this.vista.nombre,
    });
    let chkExiste = await sEstudiantes.existe(estudiante.cedula);
    if (chkExiste.ok === false) {
      alert("Error: No se pudo conectar con el servidor");
      return;
    }
    if (chkExiste.existe) {
      alert("Ya existe un estudiante registrado con esa cédula");
      return;
    }
    sEstudiantes.agregar(estudiante).then((resultado) => {
      alert(resultado.mensaje);
      if (resultado.ok) this.cargarEstudiantes();
    });
  }

  private onVolver() {
    this.vista.ocultar();
    this.volverCallback();
  }
  async cargarEstudiantes() {
    let resultado = await sEstudiantes.getEstudiantes();
    if (resultado.ok === false) {
      alert("Error: No se pudo conectar con el servidor");
      return;
    }
    this.modelo.setEstudiantes(resultado.tabla);
    this.vista.mostrarEstudiantes(this.modelo.getEstudiantes());
  }
}
