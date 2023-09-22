export class ControllerError extends Error {
  status: number

  constructor(message: string) {
    super(message)
    this.status = 400
  }
}
