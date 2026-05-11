import { ModuleResourceScreen } from '@/components/modules/module-resource-screen';
import { getModuleByKey } from '@/lib/access-control';

// Vincula a rota /pedidos ao modulo "pedidos".
const moduleConfig = getModuleByKey('pedidos');

export default function PedidosPage() {
  if (!moduleConfig) {
    return null;
  }

  return <ModuleResourceScreen module={moduleConfig} />;
}
