export default class Cl_mQuiz {
  private tabla: string = "quiz";
  private _cedula: number = 0;
  private _nombre: string = "";
  private _respuesta1: number = 0;
  private _respuesta2: "negro" | "verde" | "plateado" = "negro";

  constructor({
    cedula,
    nombre,
    respuesta1,
    respuesta2,
  }: {
    cedula: number;
    nombre: string;
    respuesta1: number;
    respuesta2: "negro" | "verde" | "plateado";
  }) {
    this.cedula = cedula;
    this.nombre = nombre;
    this.respuesta1 = respuesta1;
    this.respuesta2 = respuesta2;
  }

  public get cedula(): number {
    return this._cedula;
  }

  public set cedula(value: number) {
    this._cedula = value;
  }

  public get nombre(): string {
    return this._nombre;
  }

  public set nombre(value: string) {
    this._nombre = value;
  }

  public get respuesta1(): number {
    return this._respuesta1;
  }

  public set respuesta1(value: number) {
    this._respuesta1 = value;
  }

  public get respuesta2(): "negro" | "verde" | "plateado" {
    return this._respuesta2;
  }

  public set respuesta2(value: "negro" | "verde" | "plateado") {
    if (value === "negro" || value === "verde" || value === "plateado") {
      this._respuesta2 = value;
    } else {
      throw new Error("Respuesta2 debe ser 'negro', 'verde' o 'plateado'");
    }
  }

  public esCorrecto(): boolean {
    return this.respuesta1 === 40 && this.respuesta2 === "verde";
  }

  toJSON() {
    return {
      tabla: this.tabla,
      cedula: this.cedula,
      nombre: this.nombre,
      respuesta1: this.respuesta1,
      respuesta2: this.respuesta2,
    };
  }
}
