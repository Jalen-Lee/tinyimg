import { Separator } from '@/components/ui/separator';
import { SettingsHeader } from '../header';
import SettingsCompressionTinyPng from './tinypng';
export default function SettingsCompression() {
  return (
    <div className="space-y-6">
      <SettingsHeader
        heading="Compression"
        text="Manage the compression settings and preferences."
      />
      <Separator />
      <SettingsCompressionTinyPng />
    </div>
  );
}

