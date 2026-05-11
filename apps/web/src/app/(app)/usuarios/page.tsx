import { ModuleResourceScreen } from '@/components/modules/module-resource-screen';
import { getModuleByKey } from '@/lib/access-control';

// Vincula a rota /usuarios ao modulo "usuarios" (endpoint + permissao + titulo).
const moduleConfig = getModuleByKey('usuarios');

export default function UsuariosPage() {
  if (!moduleConfig) {
    return null;
  }

  return <ModuleResourceScreen module={moduleConfig} />;
}
