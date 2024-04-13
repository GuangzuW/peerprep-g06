import React, { useContext } from "react";
import { useGetIdentity, usePermissions, useNavigation } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps, useThemedLayoutContext } from "@refinedev/mui";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { ColorModeContext } from "../../../contexts/color-mode";
import { AccountMenu } from "../accountMenu";
import { PeerPrepIcon } from "../../icons";
import { IUser } from "../types";
import Button from "@mui/material/Button";

const Logo: React.FC = () => {
  const { siderCollapsed } = useThemedLayoutContext();

  if (!siderCollapsed) {
    return <></>;
  }

  return (
    <Link href="/" color="inherit" underline="none">
      <Stack direction="row">
        <PeerPrepIcon />
        <Typography sx={{ ml: 1 }}>PeerPrep</Typography>
      </Stack>
    </Link>
  );
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ColorModeContext);
  const { push } = useNavigation();
  const { data: user } = useGetIdentity<IUser>();
  const { data: permissions } = usePermissions();

  const handleSignIn = () => {
    push("/login");
  };

  return (
    <AppBar id="app-bar" position={sticky ? "sticky" : "relative"}>
      <Toolbar>
        <Stack direction="row" width="100%" alignItems="center">
          {(permissions as string[] | undefined)?.includes("admin") && <HamburgerMenu />}
          <Logo />
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
            gap={1}
          >
            <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>

            {(user?.avatar || user?.username)
              ? <AccountMenu />
              : <Button color="inherit" onClick={handleSignIn} sx={{ textTransform: "none" }}>
                Sign In
              </Button>
            }
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
