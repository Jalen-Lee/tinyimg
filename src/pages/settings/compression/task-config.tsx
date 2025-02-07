import { memo } from 'react';
import { Card} from '@/components/ui/card';
import { useI18n } from '@/i18n';
import Concurrency from './task-config-concurrency';
import Output from './task-config-output';
function SettingsCompressionTaskConfig() {
  return (
    <Card>
      <Concurrency />
      <Output />
    </Card>
  );
}

export default memo(SettingsCompressionTaskConfig);