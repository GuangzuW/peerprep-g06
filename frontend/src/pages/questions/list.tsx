import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import * as questionUtils from "./utils";

export const QuestionList = () => {
  const { dataGridProps } = useDataGrid({
    sorters: {
      mode: "off",
    },
    filters: {
      mode: "off",
    },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "_id",
        flex: 1,
        headerName: "ID",
        minWidth: 100,
      },
      {
        field: "title",
        flex: 1,
        headerName: "Title",
        minWidth: 100,
        renderCell: ({ value }) => {
          const maxLength = 25;
          return (
            <Tooltip title={value}>
              <Box>
                {value.length > maxLength ? value.substring(0, maxLength - 1) + "…" : value}
              </Box>
            </Tooltip>
          );
        },
      },
      {
        field: "description",
        flex: 1,
        headerName: "Description",
        minWidth: 100,
        renderCell: ({ value }) => {
          const maxLength = 25;
          return (
            <Tooltip title={value}>
              <Box>
                {value.length > maxLength ? value.substring(0, maxLength - 1) + "…" : value}
              </Box>
            </Tooltip>
          );
        },
      },
      {
        field: "categories",
        flex: 1,
        headerName: "Categories",
        minWidth: 100,
        renderCell: ({ value }) => {
          return (
            <Tooltip title={value.join(", ")}>
              {questionUtils.renderCategories(value)}
            </Tooltip>
          );
        },
      },
      {
        field: "complexity",
        flex: 1,
        headerName: "Complexity",
        minWidth: 100,
        renderCell: ({ value }) => questionUtils.renderComplexity(value),
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row._id} />
              <ShowButton hideText recordItemId={row._id} />
              <DeleteButton hideText recordItemId={row._id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid
        getRowId={(row) => row._id}
        {...dataGridProps}
        columns={columns}
        autoHeight
      />
    </List>
  );
};
