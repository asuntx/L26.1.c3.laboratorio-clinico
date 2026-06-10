import I_vClinica from "../interfaces/I_vClinica.js";
import Cl_mLaboratorio from "../models/Cl_mLaboratorio.js";
import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_mEstudio from "../models/Cl_mEstudio.js";
import Cl_sExamen from "../services/Cl_sExamen.js";
import Cl_sEstudio from "../services/Cl_sEstudio.js";

export default class Cl_cClinica {
  private modelo: Cl_mLaboratorio;
  private vista: I_vClinica;
  
  private examenActual: Cl_mExamen | null = null;

  constructor({
    modelo,
    vista,
  }: {
    modelo: Cl_mLaboratorio;
    vista: I_vClinica;
  }) {
    this.modelo = modelo;
    this.vista = vista;

    // Conectar eventos
    this.vista.onFiltrar((filtro) => {
      this.vista.mostrarExamenes(this.modelo.filtrarExamenes(filtro));
    });

    this.vista.onVerEstudios((examen) => this.onVerEstudios(examen));

    this.vista.onGuardarExamen(() => this.onGuardarExamen());
    this.vista.onCancelarExamen(() => this.vista.ocultarPanelNuevoExamen());

    this.vista.onEliminarEstudio((id) => this.onEliminarEstudio(id));
    this.vista.onCerrarEstudios(() => {
      this.examenActual = null;
      this.vista.ocultarPanelEstudios();
    });

    this.cargarExamenes();
  }

  private recargarVistaLista() {
    this.vista.ocultarPanelEstudios();
    this.cargarExamenes();
  }

  // --- EXAMENES ---
  private async cargarExamenes() {
    const resultado = await Cl_sExamen.getExamenes();
    if (!resultado.ok) {
      alert("Error: No se pudo conectar con el servidor");
      return;
    }

    const examenes = resultado.tabla.map(
      (e) =>
        new Cl_mExamen({
          id: e.id ?? "",
          nombrePaciente: e.nombrePaciente ?? "",
          cedulaPaciente: e.cedulaPaciente ?? "",
          whatsappPaciente: e.whatsappPaciente ?? "",
          estado: e.estado ?? "pendiente",
          monto: e.monto ?? 0,
          metodoPago: e.metodoPago ?? "efectivo",
          fecha: new Date(e.fecha),
        }),
    );

    this.modelo.examenes = examenes;
    this.vista.mostrarExamenes(this.modelo.filtrarExamenes("todos"));
  }

  private async onGuardarExamen() {
    const seleccionados = this.vista.estudiosSeleccionados;
    if (seleccionados.length === 0) {
      alert("Debe seleccionar al menos un estudio a realizar.");
      return;
    }

    const cedula = this.vista.cedulaPaciente;
    const existe = await Cl_sExamen.verificarCedula(cedula);
    if (existe) {
      alert("Ya existe un examen registrado para esta cédula.");
      return;
    }

    const examen = new Cl_mExamen({
      nombrePaciente: this.vista.nombrePaciente,
      cedulaPaciente: cedula,
      whatsappPaciente: this.vista.whatsappPaciente,
      estado: "pendiente",
      monto: 0,
      metodoPago: this.vista.metodoPago,
      fecha: this.vista.fecha,
    });

    const resultadoExamen = await Cl_sExamen.agregar(examen);
    if (!resultadoExamen.ok) {
      alert(resultadoExamen.mensaje);
      return;
    }

    // Setear id devuelto por mockapi al modelo local
    examen.id = resultadoExamen.tabla.id;

    // Guardar todos los estudios seleccionados vinculados a este examen
    for (const estDef of seleccionados) {
      const estudio = new Cl_mEstudio({
        examenId: examen.id,
        nombre: estDef.nombre,
        unidad: estDef.unidad,
        rangoReferencia: estDef.rangoReferencia,
        precio: estDef.precio,
        resultado: "",
      });
      const resEstudio = await Cl_sEstudio.agregar(estudio);
      if (resEstudio.ok) {
        examen.agregarEstudio(estudio);
      }
    }

    // Actualizar el monto acumulado del examen
    examen.calcularMonto();
    await Cl_sExamen.actualizarExamen(examen.id, { monto: examen.monto });

    alert("Examen y estudios guardados correctamente.");
    this.vista.ocultarPanelNuevoExamen();
    this.cargarExamenes();
  }

  // --- ESTUDIOS ---
  private async onVerEstudios(examen: Cl_mExamen) {
    this.examenActual = examen;
    this.vista.mostrarPanelEstudios();
    await this.cargarEstudios();
  }

  private async cargarEstudios() {
    if (!this.examenActual) return;
    
    const res = await Cl_sEstudio.getEstudios(this.examenActual.id);
    if (!res.ok) { alert("Error al cargar estudios"); return; }
    
    this.examenActual.estudios = res.tabla.map(
      (e) => new Cl_mEstudio({ 
        id: e.id, 
        examenId: e.examenId, 
        nombre: e.nombre, 
        unidad: e.unidad, 
        rangoReferencia: e.rangoReferencia, 
        resultado: e.resultado ?? "",
        precio: e.precio ?? 0
      }),
    );
    
    this.vista.mostrarInfoExamen(
      this.examenActual.nombrePaciente, 
      `${this.examenActual.whatsappPaciente} — Total: Bs ${this.examenActual.monto.toFixed(2)}`
    );
    this.vista.mostrarEstudios(this.examenActual.estudios);
  }



  private async onEliminarEstudio(estudioId: string) {
    if (!this.examenActual) return;

    if (!estudioId) { alert("Seleccione un estudio de la tabla"); return; }
    
    if (!confirm("¿Eliminar este estudio?")) return;
    const res = await Cl_sEstudio.eliminar(estudioId);
    if (!res.ok) { alert(res.mensaje); return; }

    // Acumulador en examen (Lógica de negocio en el modelo)
    this.examenActual.eliminarEstudio(estudioId);
    this.examenActual.calcularMonto();
    await Cl_sExamen.actualizarExamen(this.examenActual.id, { monto: this.examenActual.monto });

    this.cargarEstudios();
    this.cargarExamenes();
  }
}
