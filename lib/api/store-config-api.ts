import { StoreInstanceService, type PublicStoreConfig } from "./generated"
import { withApiErrors } from "./api-error"

export const storeConfigApi = {
  async getStoreConfig(): Promise<PublicStoreConfig> {
    return withApiErrors(StoreInstanceService.storefrontConfigStorefrontConfigGet())
  },
}

