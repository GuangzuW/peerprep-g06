import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DeleteButton, EditButton, List, ShowButton, useDataGrid } from "@refinedev/mui";
import axios from 'axios';
import { match } from "assert";
import React, { useEffect, useState } from "react";
import { appConfig } from "../../config";

export const MatchRequestList = () => {
  const { dataGridProps } = useDataGrid({ resource: 'match_request' });

  const [matchRequests, setMatchRequests] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log(appConfig.matchingService.listEndpoint);
  //       const response = await axios.get(appConfig.matchingService.listEndpoint);
  //       setMatchRequests(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3002/matching-services/");
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
