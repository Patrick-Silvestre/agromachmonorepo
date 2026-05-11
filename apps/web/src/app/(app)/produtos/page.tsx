import { ModuleResourceScreen } from '@/components/modules/module-resource-screen';
import { getModuleByKey } from '@/lib/access-control';

// Vincula a rota /produtos ao modulo "produtos".
const moduleConfig = getModuleByKey('produtos');

export default function ProdutosPage() {
  if (!moduleConfig) {
    return null;
  }

  return <ModuleResourceScreen module={moduleConfig} />;
}
