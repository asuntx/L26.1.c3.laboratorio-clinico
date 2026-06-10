export const ESTUDIOS_DISPONIBLES = [
  { nombre: "Glucosa",             unidad: "mg/dL", rangoReferencia: "70 - 100",       precio: 5  },
  { nombre: "Hemoglobina",         unidad: "g/dL",  rangoReferencia: "12 - 17",        precio: 5  },
  { nombre: "Hematocrito",         unidad: "%",     rangoReferencia: "36 - 50",        precio: 5  },
  { nombre: "Plaquetas",           unidad: "/mm³",  rangoReferencia: "150000 - 400000",precio: 8  },
  { nombre: "Colesterol total",    unidad: "mg/dL", rangoReferencia: "< 200",          precio: 8  },
  { nombre: "Triglicéridos",       unidad: "mg/dL", rangoReferencia: "< 150",          precio: 8  },
  { nombre: "Creatinina",          unidad: "mg/dL", rangoReferencia: "0.6 - 1.2",      precio: 10 },
  { nombre: "Urea",                unidad: "mg/dL", rangoReferencia: "10 - 50",        precio: 10 },
  { nombre: "HIV",                 unidad: "",      rangoReferencia: "Negativo",       precio: 15 },
  { nombre: "Proteína C reactiva", unidad: "mg/L",  rangoReferencia: "< 10",           precio: 12 },
];

export default class Cl_mEstudio {
  private _tabla: string = "estudio";
  private _id: string = "";
  private _nombre: string;
  private _unidad: string;
  private _rangoReferencia: string;
  private _examenId: string;
  private _resultado: string;
  private _precio: number;
  constructor({
    id = "",
    examenId,
    resultado,
    nombre,
    unidad,
    rangoReferencia,
    precio = 0,
  }: {
    id?: string;
    examenId: string;
    resultado: string;
    nombre: string;
    unidad: string;
    rangoReferencia: string;
    precio?: number;
  }) {
    this._id = id;
    this._examenId = examenId;
    this._resultado = resultado;
    this._nombre = nombre;
    this._unidad = unidad;
    this._rangoReferencia = rangoReferencia;
    this._precio = precio;
  }
  get id() {
    return this._id;
  }
  get examenId() {
    return this._examenId;
  }
  set examenId(examenId: string) {
    this._examenId = examenId;
  }
  get resultado() {
    return this._resultado;
  }
  set resultado(resultado: string) {
    this._resultado = resultado;
  }
  get nombre() {
    return this._nombre;
  }
  set nombre(nombre: string) {
    this._nombre = nombre;
  }
  get unidad() {
    return this._unidad;
  }
  set unidad(unidad: string) {
    this._unidad = unidad;
  }
  get rangoReferencia() {
    return this._rangoReferencia;
  }
  set rangoReferencia(rangoReferencia: string) {
    this._rangoReferencia = rangoReferencia;
  }
  get precio() {
    return this._precio;
  }
  set precio(precio: number) {
    this._precio = precio;
  }

  toJSON() {
    return {
      tabla: this._tabla,
      examenId: this._examenId,
      resultado: this._resultado,
      nombre: this._nombre,
      unidad: this._unidad,
      rangoReferencia: this._rangoReferencia,
      precio: this._precio,
    };
  }
}
