import { GoFinancesRoutesList } from "./routesType";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends GoFinancesRoutesList {}
  }
}