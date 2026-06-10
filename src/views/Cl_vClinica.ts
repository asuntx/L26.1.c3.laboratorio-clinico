import I_vClinica from "../interfaces/I_vClinica.js";
import Cl_mExamen from "../models/Cl_mExamen.js";
import { ESTUDIOS_DISPONIBLES } from "../models/Cl_mEstudio.js";

export default class Cl_vClinica implements I_vClinica {
  // Lista
  private secLaboratorio: HTMLElement;
  private tblExamenes: HTMLTableSectionElement;
  private statTotal = document.getElementById("stat-total");
  private statPendiente = document.getElementById("stat-pendiente");
  private statListo = document.getElementById("stat-listo");
  private btFiltroTodos = document.getElementById("lab_filtroTodos") as HTMLButtonElement;
  private btFiltroPendientes = document.getElementById("lab_filtroPendientes") as HTMLButtonElement;
  private btFiltroListos = document.getElementById("lab_filtroListos") as HTMLButtonElement;
  private btAbrirNuevoExamen = document.getElementById("lab_btNuevoExamen") as HTMLButtonElement;

  // Nuevo Examen (Modal)
  private modalNuevoExamen = document.getElementById("modal_nuevoExamen") as HTMLDialogElement;
  private btCerrarTop = document.getElementById("examen_btCerrarTop") as HTMLButtonElement;
  private inNombrePaciente = document.getElementById("examen_inNombrePaciente") as HTMLInputElement;
  private inCedulaPaciente = document.getElementById("examen_inCedulaPaciente") as HTMLInputElement;
  private inWhatsappPaciente = document.getElementById("examen_inWhatsappPaciente") as HTMLInputElement;
  private selMetodoPago = document.getElementById("examen_selMetodoPago") as HTMLSelectElement;
  private inFecha = document.getElementById("examen_inFecha") as HTMLInputElement;
  private btGuardarExamen = document.getElementById("examen_btEnviar") as HTMLButtonElement;
  private btCancelarExamen = document.getElementById("examen_btVolver") as HTMLButtonElement;

  private chkEstudiosContenedor = document.getElementById("examen_chkEstudios") as HTMLElement;

  // Estudios
  private secEstudio: HTMLElement;
  private emptyState = document.getElementById("lab-empty-state") as HTMLElement;
  private inEstudioId = document.getElementById("estudio_inEstudioId") as HTMLInputElement;
  private infoExamen = document.getElementById("estudio_pacienteInfo") as HTMLElement;
  private btCerrarEstudio = document.getElementById("estudio_btVolver") as HTMLButtonElement;
  private tblEstudios = document.getElementById("estudio_tblRegistros") as HTMLTableSectionElement;

  private _verEstudiosCallback: ((examen: Cl_mExamen) => void) | null = null;
  private _eliminarEstudioCallback: ((id: string) => void) | null = null;

  constructor() {
    this.secLaboratorio = document.getElementById("laboratorio") as HTMLElement;
    this.tblExamenes = document.getElementById("laboratorio_tblRegistros") as HTMLTableSectionElement;
    this.secEstudio = document.getElementById("estudio") as HTMLElement;

    ESTUDIOS_DISPONIBLES.forEach((estudio) => {
      const label = document.createElement("label");
      label.className = "checkbox-item";
      
      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.value = estudio.nombre;
      
      const span = document.createElement("span");
      span.textContent = `${estudio.nombre} (Bs ${estudio.precio})`;
      
      label.appendChild(chk);
      label.appendChild(span);
      this.chkEstudiosContenedor.appendChild(label);
    });

    this.btAbrirNuevoExamen.onclick = () => this.mostrarPanelNuevoExamen();
    this.btCerrarTop.onclick = () => this.ocultarPanelNuevoExamen();
  }

  // --- GETTERS EXAMEN ---
  get nombrePaciente() { return this.inNombrePaciente.value.trim(); }
  get cedulaPaciente() { return this.inCedulaPaciente.value.trim(); }
  get whatsappPaciente() { return this.inWhatsappPaciente.value.trim(); }
  get metodoPago() { return this.selMetodoPago.value as any; }
  get fecha() { return new Date(this.inFecha.value); }


  get estudioId() { return this.inEstudioId.value; }

  get estudiosSeleccionados() {
    const checkboxes = this.chkEstudiosContenedor.querySelectorAll("input[type='checkbox']:checked") as NodeListOf<HTMLInputElement>;
    const seleccionados: any[] = [];
    checkboxes.forEach(chk => {
      const estudioDef = ESTUDIOS_DISPONIBLES.find(e => e.nombre === chk.value);
      if (estudioDef) seleccionados.push(estudioDef);
    });
    return seleccionados;
  }

  // --- LISTA EXAMENES ---
  mostrarExamenes(examenes: Cl_mExamen[]): void {
    if (this.statTotal) this.statTotal.textContent = String(examenes.length);
    if (this.statPendiente) this.statPendiente.textContent = String(examenes.filter(e => e.estado === "pendiente").length);
    if (this.statListo) this.statListo.textContent = String(examenes.filter(e => e.estado === "listo").length);

    this.tblExamenes.innerHTML = "";
    if (examenes.length === 0) {
      this.tblExamenes.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:24px;">Sin exámenes registrados</td></tr>`;
      return;
    }
    examenes.forEach((examen) => {
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      const fechaStr = examen.fecha instanceof Date && !isNaN(examen.fecha.getTime())
        ? examen.fecha.toLocaleDateString("es-VE", { day: "2-digit", month: "short" })
        : "—";
      tr.innerHTML = `
        <td><strong>${examen.nombrePaciente}</strong><br><small style="color:var(--gray-400)">${examen.cedulaPaciente} · ${examen.whatsappPaciente}</small></td>
        <td><span class="badge badge-${examen.estado}">${examen.estado}</span></td>
        <td>${fechaStr}</td>
        <td><strong>Bs ${examen.monto.toFixed(2)}</strong></td>
        <td><button type="button" class="btn btn-secondary" style="font-size:12px;height:28px;">Ver estudios</button></td>
      `;
      const btn = tr.querySelector("button") as HTMLButtonElement;
      btn.onclick = (ev) => {
        ev.stopPropagation();
        this._verEstudiosCallback?.(examen);
      };
      this.tblExamenes.appendChild(tr);
    });
  }

  onFiltrar(callback: (filtro: "todos" | "pendiente" | "listo") => void): void {
    const botones = [this.btFiltroTodos, this.btFiltroPendientes, this.btFiltroListos];
    const setActivo = (btn: HTMLButtonElement) => {
      botones.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    this.btFiltroTodos.onclick = () => { setActivo(this.btFiltroTodos); callback("todos"); };
    this.btFiltroPendientes.onclick = () => { setActivo(this.btFiltroPendientes); callback("pendiente"); };
    this.btFiltroListos.onclick = () => { setActivo(this.btFiltroListos); callback("listo"); };
  }

  onVerEstudios(callback: (examen: Cl_mExamen) => void): void {
    this._verEstudiosCallback = callback;
  }

  // --- NUEVO EXAMEN ---
  onGuardarExamen(callback: () => void): void { this.btGuardarExamen.onclick = callback; }
  onCancelarExamen(callback: () => void): void { this.btCancelarExamen.onclick = callback; }

  // --- ESTUDIOS ---
  mostrarInfoExamen(paciente: string, info: string): void {
    this.infoExamen.textContent = `${paciente}  ·  ${info}`;
  }

  mostrarEstudios(estudios: any[]): void {
    this.tblEstudios.innerHTML = "";
    if (estudios.length === 0) {
      this.tblEstudios.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:20px;">Sin estudios registrados</td></tr>`;
      return;
    }
    estudios.forEach((est) => {
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      tr.innerHTML = `
        <td>${est.nombre}</td>
        <td>${est.unidad}</td>
        <td>${est.rangoReferencia}</td>
        <td>Bs ${est.precio?.toFixed(2) ?? "0.00"}</td>
        <td>${est.resultado || "<span style='color:var(--gray-400)'>Pendiente</span>"}</td>
        <td style="text-align: right;">
          <button type="button" class="btn btn-danger btn-eliminar-estudio" style="padding: 4px 8px; height: auto;">🗑️</button>
        </td>
      `;
      const btnEliminar = tr.querySelector(".btn-eliminar-estudio") as HTMLButtonElement;
      btnEliminar.onclick = (e) => {
        e.stopPropagation();
        this._eliminarEstudioCallback?.(est.id);
      };
      
      tr.onclick = () => {
        this.tblEstudios.querySelectorAll("tr").forEach(r => r.classList.remove("row-selected"));
        tr.classList.add("row-selected");
        this.inEstudioId.value = est.id;
      };
      this.tblEstudios.appendChild(tr);
    });
  }

  onEliminarEstudio(callback: (id: string) => void): void { this._eliminarEstudioCallback = callback; }
  onCerrarEstudios(callback: () => void): void { this.btCerrarEstudio.onclick = callback; }

  // --- PANELES VISIBILITY ---
  mostrarPanelNuevoExamen(): void {
    // Clear form
    this.inNombrePaciente.value = "";
    this.inCedulaPaciente.value = "";
    this.inWhatsappPaciente.value = "";
    this.inFecha.value = "";
    
    // Clear checkboxes
    const checkboxes = this.chkEstudiosContenedor.querySelectorAll("input[type='checkbox']") as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(chk => chk.checked = false);
    
    this.modalNuevoExamen.showModal();
  }

  ocultarPanelNuevoExamen(): void {
    this.modalNuevoExamen.close();
  }

  mostrarPanelEstudios(): void {
    this.secLaboratorio.removeAttribute("hidden");
    this.emptyState.setAttribute("hidden", "true");
    this.secEstudio.removeAttribute("hidden");
  }

  ocultarPanelEstudios(): void {
    this.secEstudio.setAttribute("hidden", "true");
    this.emptyState.removeAttribute("hidden");
  }
}
