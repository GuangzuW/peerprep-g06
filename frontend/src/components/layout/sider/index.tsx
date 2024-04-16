import { ThemedSiderV2, RefineThemedLayoutV2SiderProps, useThemedLayoutContext, } from "@refinedev/mui";

export const Sider: React.FC<RefineThemedLayoutV2SiderProps> = (props) => {
  const { siderCollapsed } = useThemedLayoutContext();
  return !siderCollapsed ? <ThemedSiderV2 {...props} /> : <></>;
}
