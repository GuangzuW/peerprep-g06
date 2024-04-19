import { ThemedLayoutV2 } from "@refinedev/mui";
import Box from "@mui/material/Box";
import { Header } from "./header";
import { Title } from "./title";
import { Sider } from "./sider";
import { MatchingRequestor } from "./matchingRequestor";

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isCollaboratePage = location.pathname.toLowerCase().startsWith("/collaborate/");

  return (
    <ThemedLayoutV2
      Header={() => <Header sticky />}
      Title={Title}
      Sider={Sider}
      initialSiderCollapsed={true}
    >
      {children}
      {
        !isCollaboratePage &&
        <>
          <Box sx={{ height: 56 + 16 * 2 }} />
          <MatchingRequestor />
        </>
      }
    </ThemedLayoutV2>
  );
};
