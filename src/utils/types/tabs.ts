export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface TabData {
  label: string;
  content: React.ReactNode;
}

export interface DynamicTabsProps {
  tabs: TabData[];
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}
