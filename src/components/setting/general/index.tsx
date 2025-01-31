import SettingsHeader from "../header";
import { Divider } from "antd";
import TinypngSetting from "./tinypng";

export default function SettingGeneral() {
  return (
    <div className="w-full">
      <SettingsHeader
        heading="General"
        text="Manage the general application settings and preferences."
      />
      <Divider />
      <TinypngSetting />
    </div>
  );
}
