import { memo } from "react";
import { Card } from "antd";
import SettingsHeader from "../header";

export default memo(function TinypngSetting() {
  return (
    <Card>
      <SettingsHeader
        heading="TinyPNG"
        text="TinyPNG is a tool to compress images on the fly, reducing file size without losing quality."
      />
    </Card>
  );
});
