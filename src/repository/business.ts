import {Business} from '~/models/business'

export interface BusinessRepository {
  findByCNPJ: (cnpj: string) => Promise<Business | null>
}
