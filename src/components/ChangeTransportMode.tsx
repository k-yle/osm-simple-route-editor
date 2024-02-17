import { useContext } from "react";
import { Menu, Select } from "@mantine/core";
import { IconRoad, IconShip, IconTrain } from "@tabler/icons-react";
import { NETWORK_HEIRARCHY, TransportMode } from "../constants";
import { SettingsContext } from "../context/SettingsContext";

const ICON_MAP: Record<TransportMode, typeof IconRoad> = {
  ROAD: IconRoad,
  TRAIN: IconTrain,
  FERRY: IconShip,
};

export const ChangeTransportMode: React.FC = () => {
  const { transportMode, setTransportMode } = useContext(SettingsContext);

  const Icon = ICON_MAP[transportMode];

  return (
    <Menu.Item
      icon={<Icon size="0.9rem" stroke={1.5} />}
      closeMenuOnClick={false}
      py={0}
    >
      <Select
        variant="unstyled"
        value={transportMode}
        onChange={(newValue) =>
          newValue && setTransportMode(newValue as TransportMode)
        }
        dropdownPosition="bottom"
        data={Object.entries(NETWORK_HEIRARCHY).map(([code, { getName }]) => ({
          value: code,
          label: getName(),
        }))}
      />
    </Menu.Item>
  );
};
