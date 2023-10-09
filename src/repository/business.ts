import {Business} from '~/models/business'

export type UpdateBusinessDTO = {
  name?: string
  cnpj?: string
}

export interface BusinessRepository {
  findByCNPJ: (cnpj: string) => Promise<Business | null>
  update: (id: number, data: UpdateBusinessDTO) => Promise<Business>
}
