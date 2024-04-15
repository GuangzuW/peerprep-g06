import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { EditButton, List, ShowButton, useDataGrid } from "@refinedev/mui";
import axios from 'axios';
import React, { useEffect, useState } from "react";

export const MatchRequestList = () => {
  const { dataGridProps } = useDataGrid({ resource: 'match_request' });

  const [matchRequests, setMatchRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3003/matching-services/");
        const validData = response.data.filter((item: { _id: null; }) => item._id != null);
        setMatchRequests(validData);
        console.log(validData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);


  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "matching_service_id",
        headerName: "ID",
        type: "number",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 200,
      },
      {
        field: "difficulty",
        sortable: true,
        headerName: "Difficulty",
        minWidth: 200,
      },
      {
        field: "category",
        sortable: true,
        headerName: "Category",
        minWidth: 200,
      },
      {
        field: "createdAt",
        headerName: "Created At",
        minWidth: 200,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        // renderCell: ({ row }) => (
        //   <>
        //     <EditButton hideText recordItemId={row.id} />
        //     <ShowButton hideText recordItemId={row.id} />
        //     <DeleteButton hideText recordItemId={row.id} />
        //   </>
        // ),
        renderCell: (params) => (
          <>
            <EditButton hideText recordItemId={params.row._id} />
            <ShowButton hideText recordItemId={params.row._id} />
          </>
        ),
        align: "center",
        headerAlign: "center",
        minWidth: 130,
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        rows={matchRequests}
        getRowId={(row) => row._id}
        autoHeight
      />
    </List>
  );
};
