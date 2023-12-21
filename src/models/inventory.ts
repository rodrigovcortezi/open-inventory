export type Inventory = {
  id: number
  name: string
  code: string
  businessId: number
}

export type SafeInventory = Omit<Inventory, 'id' | 'businessId'>

export const safeInventory = (inventory: Inventory): SafeInventory => {
  const {name, code} = inventory
  return {name, code}
}
