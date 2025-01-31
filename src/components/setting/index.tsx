import { Divider, Tabs, Button } from "antd";
import type { TabsProps } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import SettingGeneral from "./general";

export interface SettingProps {
  onBack?: () => void;
}

export default function Setting(props: SettingProps) {
  const { onBack } = props;

  const tabItems: TabsProps["items"] = [
    {
      key: "general",
      label: "General",
      children: <SettingGeneral />,
    },
    {
      key: "about",
      label: "About",
      children: "Content of Tab Pane 1",
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <Button
            variant="text"
            type="text"
            onClick={() => onBack?.()}
            className="text-gray-500"
            icon={<ArrowLeftOutlined />}
          ></Button>
          <h3 className="text-2xl font-bold tracking-tight">Settings</h3>
        </div>
      </div>
      <div className="w-full flex-1">
        <Tabs tabPosition="left" items={tabItems} />
      </div>
    </div>
  );
}
