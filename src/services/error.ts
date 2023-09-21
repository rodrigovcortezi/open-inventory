export class ServiceError extends Error {
  status: number
  errors?: Record<string, unknown>

  constructor(
    message: string,
    status: number = 422,
    errors?: Record<string, unknown>,
  ) {
    super(message)
    this.status = status
    this.errors = errors
  }
}
