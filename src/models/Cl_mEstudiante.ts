export default class Cl_mEstudiante {
  private tabla: string = "estudiante";
  private _cedula: number = 0;
  private _nombre: string = "";
  constructor({ cedula, nombre }: { cedula: number; nombre: string }) {
    this.cedula = cedula;
    this.nombre = nombre;
  }
  set cedula(value: number) {
    this._cedula = +value;
  }
  get cedula(): number {
    return this._cedula;
  }
  set nombre(value: string) {
    this._nombre = value;
  }
  get nombre(): string {
    return this._nombre;
  }
  toJSON() {
    return {
      tabla: this.tabla,
      cedula: this.cedula,
      nombre: this.nombre,
    };
  }
}
