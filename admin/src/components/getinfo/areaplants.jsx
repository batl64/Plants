import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { respons } from "../../servises/index.js";
import { TableInfo } from "../table/table.jsx";
import Swal from "sweetalert2";

export class Areaplants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      plant: null,
    };
  }

  onRowDelete = (dat) => {
    respons("delete", "/areaplants", JSON.stringify({ id: dat?.id }));
  };

  onRowCreate = async (dat) => {
    try {
      await respons("post", "/areaplants", JSON.stringify(dat));
    } catch (e) {
      if (e.message === "Duplicate")
        Swal.fire({
          showConfirmButton: true,
          icon: "error",
          text: this.props.translate("duplicateAreaplants"),
        });
    }
  };

  onRowUpdate = async (dat) => {
    try {
      await respons("put", "/areaplants", JSON.stringify(dat));
    } catch (e) {
      if (e.message === "Duplicate") {
        Swal.fire({
          showConfirmButton: true,
          icon: "error",
          text: this.props.translate("duplicateAreaplants"),
        });
      }
    }
  };

  async componentDidMount() {
    await respons("get", "/regionList").then((data) => {
      this.setState({ region: data });
    });
    await respons("get", "/plantsList").then((data) => {
      this.setState({ plant: data });
    });
  }

  render() {
    const { translate } = this.props;
    const tableRef = React.createRef();

    const response = (query) => {
      const body = {
        orderDirection: query.orderDirection ? query.orderDirection : "desc",
        orederFild: query.orderBy ? query.orderBy.field : "NameRegion",
        pageSize: query.pageSize ? query.pageSize : 5,
        pageNumber: query.page ? query.page : 0,
        search: query.search ? query.search : "",
        searchFields: [
          "NameRegion",
          "NamePlant",
          "AreaSize",
          "Date_LastUpdated",
        ],
      };

      return new Promise((res, rej) => {
        Promise.all([
          new Promise((res, rej) => {
            res(
              respons("get", "/areaplants?" + new URLSearchParams(body)).then(
                (data) => data
              )
            );
          }),
          new Promise((res, rej) => {
            res(
              respons(
                "get",
                "/areaplantsPage?" + new URLSearchParams(body)
              ).then((data) => data)
            );
          }),
        ]).then((data) => {
          res({
            data: data[0],
            page: query.page,
            totalCount: data[1][0].pagesNumber,
          });
        });
      });
    };

    const regionLookup = this.state?.region?.reduce((acc, item) => {
      acc[item?.ID_Region] = item?.Name;
      return acc;
    }, {});
    const plantLookup = this.state?.plant?.reduce((acc, item) => {
      acc[item?.ID_Plant] = item?.Name;
      return acc;
    }, {});

    return (
      <div className="users m-4">
        <TableInfo
          tableRef={tableRef}
          title={translate("areaplants")}
          columns={[
            {
              title: translate("nameRegion"),
              field: "IDRegion",
              lookup: regionLookup,
            },
            {
              title: translate("namePlant"),
              field: "IDPlant",
              lookup: plantLookup,
            },
            {
              title: translate("areaSize"),
              field: "AreaSize",
            },
            {
              title: translate("dateLastUpdated"),
              field: "Date_LastUpdated",
              type: "datetime",
              editable: "never",
            },
          ]}
          editable={{
            onRowDelete: (dat) =>
              new Promise((res, rej) => {
                this.onRowDelete(dat);
                tableRef.current.onQueryChange();
                res();
              }),
            onRowUpdate: (dat) =>
              new Promise((res, rej) => {
                this.onRowUpdate(dat);
                tableRef.current.onQueryChange();
                res();
              }),
            onRowAdd: (dat) =>
              new Promise((res, rej) => {
                this.onRowCreate(dat);
                tableRef.current.onQueryChange();
                res();
              }),
          }}
          data={response}
          localization={{
            body: {
              addTooltip: translate("addTooltip"),
              editTooltip: translate("editTooltip"),
              deleteTooltip: translate("deleteTooltip"),
              editRow: {
                deleteText: translate("deleteText"),
                cancelTooltip: translate("deleteTooltipDelete"),
                saveTooltip: translate("saveTooltip"),
              },
            },
            header: {
              actions: translate("actions"),
            },
            pagination: {
              firstTooltip: translate("firstTooltip"),
              lastTooltip: translate("lastTooltip"),
              nextTooltip: translate("nextTooltip"),
              previousTooltip: translate("previousTooltip"),
            },
            toolbar: {
              exportTitle: translate("export"),
              searchTooltip: translate("search"),
              searchPlaceholder: translate("search"),
            },
          }}
          options={{
            sorting: true,
            search: true,
            exportButton: true,
            actionsColumnIndex: -1,
          }}
        />
      </div>
    );
  }
}

export default withTranslate(Areaplants);
