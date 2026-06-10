import I_vAnalista from "../interfaces/I_vAnalista.js";
import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_mEstudio, { ESTUDIOS_DISPONIBLES } from "../models/Cl_mEstudio.js";
import Cl_sEstudio from "../services/Cl_sEstudio.js";
import Cl_sExamen from "../services/Cl_sExamen.js";

import Cl_mLaboratorio from "../models/Cl_mLaboratorio.js";

export default class Cl_cAnalista {
  private modelo: Cl_mLaboratorio;
  private vista: I_vAnalista;
  private examenActual: Cl_mExamen | null = null;
  private estudiosActuales: Cl_mEstudio[] = [];
  private porcentajesCalculados: Record<string, number> = {};

  constructor({ modelo, vista }: { modelo: Cl_mLaboratorio; vista: I_vAnalista }) {
    this.modelo = modelo;
    this.vista = vista;

    this.vista.onSeleccionarExamen((examen) => this.onSeleccionarExamen(examen));
    this.vista.onFiltrar((filtro) => {
      this.vista.mostrarExamenes(this.modelo.filtrarExamenes(filtro));
    });
    this.vista.onGuardarResultado((estudioId, resultado) =>
      this.onGuardarResultado(estudioId, resultado),
    );
    this.vista.onEnviarWhatsApp(() => this.onEnviarWhatsApp());

    this.vista.mostrar();
    this.cargarExamenes();
  }

  async cargarExamenes() {
    const resultado = await Cl_sExamen.getExamenes();
    if (!resultado.ok) {
      alert("Error: No se pudo conectar con el servidor");
      return;
    }
    const examenes = resultado.tabla.map(
      (e) =>
        new Cl_mExamen({
          id: e.id,
          nombrePaciente: e.nombrePaciente,
          cedulaPaciente: e.cedulaPaciente ?? "",
          whatsappPaciente: e.whatsappPaciente,
          estado: e.estado,
          monto: e.monto,
          metodoPago: e.metodoPago,
          fecha: new Date(e.fecha),
        }),
    );
    this.modelo.examenes = examenes;
    this.vista.mostrarExamenes(this.modelo.filtrarExamenes("todos"));
    await this.actualizarEstadisticas();
  }

  private async onSeleccionarExamen(examen: Cl_mExamen) {
    this.examenActual = examen;
    // Carga los estudios desde el MockAPI usando el ID del examen
    const resultado = await Cl_sEstudio.getEstudios(examen.id);
    if (!resultado.ok) {
      alert("Error al cargar estudios");
      return;
    }
    this.estudiosActuales = resultado.tabla.map((e) => new Cl_mEstudio({
      id: e.id,
      examenId: e.examenId,
      nombre: e.nombre,
      unidad: e.unidad,
      rangoReferencia: e.rangoReferencia,
      resultado: e.resultado ?? "",
    }));
    this.vista.mostrarEstudios(this.estudiosActuales, examen, this.porcentajesCalculados);
  }

  private async onGuardarResultado(estudioId: string, resultado: string) {
    const res = await Cl_sEstudio.actualizarResultado(estudioId, resultado);
    alert(res.mensaje);
    if (res.ok && this.examenActual) {
      // Actualizar en el arreglo local para evaluar
      const index = this.estudiosActuales.findIndex(e => e.id === estudioId);
      if (index !== -1) {
        this.estudiosActuales[index].resultado = resultado;
      }

      // Si todos los estudios tienen un resultado, cambia el estado a "listo"
      const todosListos = this.estudiosActuales.every(e => e.resultado && e.resultado.trim() !== "");
      if (todosListos && this.examenActual.estado !== "listo") {
        await Cl_sExamen.actualizarExamen(this.examenActual.id, { estado: "listo" });
        this.examenActual.estado = "listo";
      }

      this.onSeleccionarExamen(this.examenActual); // refresca tabla de estudios
      this.cargarExamenes(); // refresca tabla izquierda
    }
  }

  private onEnviarWhatsApp() {
    if (!this.examenActual) {
      alert("Seleccione un examen primero");
      return;
    }

    const lineas = this.estudiosActuales.map(
      (e) =>
        `*${e.nombre}*: ${e.resultado || "pendiente"} ${e.unidad} (ref: ${e.rangoReferencia})`,
    );

    const mensaje = encodeURIComponent(
      `Hola ${this.examenActual.nombrePaciente}, sus resultados de laboratorio son:\n\n` +
        lineas.join("\n") +
        `\n\nGracias por confiar en nosotros.`,
    );

    const numero = this.examenActual.whatsappPaciente.replace(/\D/g, "");
    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
  }

  private async actualizarEstadisticas() {
    const resEstudios = await Cl_sEstudio.getTodosEstudios();
    if (!resEstudios.ok) {
      return;
    }
    const todosEstudios = resEstudios.tabla;
    const totalExamenes = this.modelo.examenes.length;

    const conteo: Record<string, number> = {};
    todosEstudios.forEach((est: any) => {
      const nombre = est.nombre;
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    const porcentajes: Record<string, number> = {};
    const totales: Record<string, number> = {};

    for (const est of ESTUDIOS_DISPONIBLES) {
      const count = conteo[est.nombre] || 0;
      totales[est.nombre] = count;
      porcentajes[est.nombre] = totalExamenes > 0 ? (count / totalExamenes) * 100 : 0;
    }

    this.porcentajesCalculados = porcentajes;
    this.vista.mostrarEstadisticas(totalExamenes, porcentajes, totales);
  }
}
