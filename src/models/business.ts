export type Business = {
  id: number
  name: string
  cnpj: string
}

export type SafeBusiness = Omit<Business, 'id'>

export const safeBusiness = (business: Business): SafeBusiness => {
  const {name, cnpj} = business
  return {name, cnpj}
}
