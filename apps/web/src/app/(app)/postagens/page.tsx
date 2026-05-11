import { ModuleResourceScreen } from '@/components/modules/module-resource-screen';
import { getModuleByKey } from '@/lib/access-control';

// Vincula a rota /postagens ao modulo "postagens".
const moduleConfig = getModuleByKey('postagens');

export default function PostagensPage() {
  if (!moduleConfig) {
    return null;
  }

  return <ModuleResourceScreen module={moduleConfig} />;
}
