import { Authenticated, Refine } from "@refinedev/core";

import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import { dataProviders } from "./dataProviders";
import { authProvider } from "./authProvider";
import { accessControlProvider } from "./accessControlProvider";
import { Layout } from "./components/layout";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  PublicHome,
  PublicQuestion,
} from "./pages/public";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import {
  MyAccountShow,
  MyAccountEdit,
} from "./pages/my-account";
import {
  UserCreate,
  UserEdit,
  UserList,
  UserShow,
} from "./pages/users";
import {
  QuestionCreate,
  QuestionEdit,
  QuestionList,
  QuestionShow,
} from "./pages/questions";
import { Collaboration } from "./pages/collaborations";

function App() {
  return (
    <BrowserRouter>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <Refine
            dataProvider={{ ...dataProviders, refineFake: dataProvider("https://api.fake-rest.refine.dev") }}
            notificationProvider={notificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            accessControlProvider={accessControlProvider}
            resources={[
              {
                name: "users",
                list: "/users",
                create: "/users/create",
                edit: "/users/edit/:id",
                show: "/users/show/:id",
                meta: {
                  icon: <PeopleIcon />,
                  requiredPermissions: {
                    list: ["admin"],
                    create: ["admin"],
                    edit: ["admin"],
                    show: ["admin"],
                  }
                }
              },
              {
                name: "questions",
                list: "/questions",
                create: "/questions/create",
                edit: "/questions/edit/:id",
                show: "/questions/show/:id",
                meta: {
                  icon: <QuizIcon />,
                  dataProviderName: "questions",
                  requiredPermissions: {
                    list: ["admin"],
                    create: ["admin"],
                    edit: ["admin"],
                    show: ["admin"],
                  }
                }
              },
            ]}
            options={{
              disableTelemetry: true,
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "bqXaTU-x7QLWz-8voMO7",
            }}
          >
            <Routes>
              <Route index element={<PublicHome />} />
              <Route path="/question/:id" element={<PublicQuestion />} />
              <Route
                element={
                  <Authenticated
                    key="authenticated-inner"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="questions" />}
                />
                <Route path="/my-account">
                  <Route index element={<MyAccountShow />} />
                  <Route path="edit" element={<MyAccountEdit />} />
                </Route>
                <Route path="/users">
                  <Route index element={<UserList />} />
                  <Route path="create" element={<UserCreate />} />
                  <Route path="edit/:id" element={<UserEdit />} />
                  <Route path="show/:id" element={<UserShow />} />
                </Route>
                <Route path="/questions">
                  <Route index element={<QuestionList />} />
                  <Route path="create" element={<QuestionCreate />} />
                  <Route path="edit/:id" element={<QuestionEdit />} />
                  <Route path="show/:id" element={<QuestionShow />} />
                </Route>
                <Route path="/collaborate/:id" element={<Collaboration />} />
                <Route path="*" element={<ErrorComponent />} />
              </Route>
              <Route
                element={
                  <Authenticated
                    key="authenticated-outer"
                    fallback={<Outlet />}
                  >
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

            </Routes>

            <UnsavedChangesNotifier />
            <DocumentTitleHandler handler={({ autoGeneratedTitle }) => autoGeneratedTitle.replaceAll("refine", "PeerPrep")} />
          </Refine>
        </RefineSnackbarProvider>
      </ColorModeContextProvider>
    </BrowserRouter>
  );
}

export default App;
