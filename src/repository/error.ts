export class RepositoryError extends Error {
  details: Record<string, unknown> | undefined

  constructor(details?: Record<string, unknown>) {
    super('A repository error has occurred')
    this.details = details
  }
}
