import { ModuleResourceScreen } from '@/components/modules/module-resource-screen';
import { getModuleByKey } from '@/lib/access-control';

// Vincula a rota /funcionarios ao modulo "funcionarios".
const moduleConfig = getModuleByKey('funcionarios');

export default function FuncionariosPage() {
  if (!moduleConfig) {
    return null;
  }

  return <ModuleResourceScreen module={moduleConfig} />;
}
