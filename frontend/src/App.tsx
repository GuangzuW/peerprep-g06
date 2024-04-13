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
  useDocumentTitle,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People';
import { userDataProvider } from "./dataProviders";
import { authProvider } from "./authProvider";
import { accessControlProvider } from "./accessControlProvider";
import { Layout } from "./components/layout";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
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
import { Collaboration } from "./pages/collaborations";
import {
  MatchRequestEditForm,
  MatchRequestList,
  MatchRequestForm,
  MatchShow
} from "./pages/matches";

function App() {
  useDocumentTitle("PeerPrep");

  interface MatchRequest {
    id: number;
    difficulty: string;
    category: string;
    time_limit?: string;
    status?: string;
  }

  const matchRequest:  MatchRequest= {
    id: 1,
    difficulty: 'easy',
    category: 'Programming',
    time_limit: '60 minutes',
  };

  return (
    <BrowserRouter>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <Refine
            dataProvider={{
              default: userDataProvider,
              refineFake: dataProvider("https://api.fake-rest.refine.dev"),
            }}
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
                name: "blog_posts",
                list: "/blog-posts",
                create: "/blog-posts/create",
                edit: "/blog-posts/edit/:id",
                show: "/blog-posts/show/:id",
                meta: {
                  canDelete: true,
                  dataProviderName: "refineFake",
                },
              },
              {
                name: "categories",
                list: "/categories",
                create: "/categories/create",
                edit: "/categories/edit/:id",
                show: "/categories/show/:id",
                meta: {
                  canDelete: true,
                  dataProviderName: "refineFake",
                },
              },
              {
                name: "matches",
                list: "/matches",
                create: "/matches/create",
                edit: "/matches/edit/:id",
                show: "/matches/show/:id",
                meta: {
                  canDelete: true,
                },
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
                  element={<NavigateToResource resource="blog_posts" />}
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
                <Route path="/collaborate" element={<Collaboration />} />
                <Route path="/blog-posts">
                  <Route index element={<BlogPostList />} />
                  <Route path="create" element={<BlogPostCreate />} />
                  <Route path="edit/:id" element={<BlogPostEdit />} />
                  <Route path="show/:id" element={<BlogPostShow />} />
                </Route>
                <Route path="/categories">
                  <Route index element={<CategoryList />} />
                  <Route path="create" element={<CategoryCreate />} />
                  <Route path="edit/:id" element={<CategoryEdit />} />
                  <Route path="show/:id" element={<CategoryShow />} />
                </Route>
                <Route path="/matches">
                  <Route index element={<MatchRequestList />} />
                  <Route path="create" element={<MatchRequestForm />} />
                  <Route path="edit/:id" element={<MatchRequestEditForm />} />
                  <Route path="show/:id" element={<MatchShow />} />
                </Route>
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
            <DocumentTitleHandler />
          </Refine>
        </RefineSnackbarProvider>
      </ColorModeContextProvider>
    </BrowserRouter>
  );
}

export default App;
