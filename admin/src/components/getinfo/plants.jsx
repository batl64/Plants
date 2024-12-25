import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { respons, upload } from "../../servises/index.js";
import { TableInfo } from "../table/table.jsx";

export class Plants extends Component {
  constructor(props) {
    super(props);
    super(props);
    this.state = {
      data: null,
    };
  }

  onRowDelete = (dat) => {
    respons(
      "delete",
      "/plants",
      JSON.stringify({ id: dat?.id, PhotoURL: dat?.PhotoURL })
    );
  };

  onRowCreate = (dat) => {
    const formData = new FormData();

    formData.append("file", dat.Photo);
    upload(
      "post",
      "/plants?" +
        new URLSearchParams({
          Area: dat.Area,
          IDCategory: dat.IDCategory,
          Name: dat.Name,
          NameCategory: dat.NameCategory,
          PhotoURL: dat.PhotoURL,
          Description: dat.Description,
        }),
      formData
    );
  };

  onRowUpdate = (dat) => {
    const formData = new FormData();

    formData.append("file", dat.Photo);
    upload(
      "put",
      "/plants?" +
        new URLSearchParams({
          Area: dat.Area,
          IDCategory: dat.IDCategory,
          Name: dat.Name,
          NameCategory: dat.NameCategory,
          PhotoURL: dat.PhotoURL,
          Description: dat.Description,
          id: dat.id,
        }),
      formData
    );
  };

  async componentDidMount() {
    await respons("get", "/categoriesList").then((data) => {
      this.setState({ data: data });
    });
  }

  render() {
    const { translate } = this.props;
    const tableRef = React.createRef();

    const response = (query) => {
      const body = {
        orderDirection: query.orderDirection ? query.orderDirection : "desc",
        orederFild: query.orderBy ? query.orderBy.field : "Name",
        pageSize: query.pageSize ? query.pageSize : 5,
        pageNumber: query.page ? query.page : 0,
        search: query.search ? query.search : "",
        searchFields: [
          "Name",
          "PhotoURL",
          "Area",
          "NameCategory",
          "Description",
        ],
      };

      return new Promise((res, rej) => {
        Promise.all([
          new Promise((res, rej) => {
            res(
              respons("get", "/plants?" + new URLSearchParams(body)).then(
                (data) => data
              )
            );
          }),
          new Promise((res, rej) => {
            res(
              respons("get", "/plantsPage?" + new URLSearchParams(body)).then(
                (data) => data
              )
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

    const categoriesLookup = this.state?.data?.reduce((acc, item) => {
      acc[item?.ID_Category] = item?.NameCategory;
      return acc;
    }, {});

    return (
      <div className="users m-4">
        <TableInfo
          tableRef={tableRef}
          title={translate("plants")}
          columns={[
            { title: translate("name"), field: "Name" },
            {
              title: translate("photo"),
              field: "Photo",
              render: (rowData) => (
                <>
                  {rowData.PhotoURL &&
                    rowData.PhotoURL != "null" &&
                    rowData.PhotoURL != "undefined" && (
                      <img
                        src={process.env.BACKEND + "/file/" + rowData.PhotoURL}
                        style={{ width: "auto", maxWidth: "400px" }}
                      />
                    )}
                </>
              ),
              editComponent: (el) => (
                <>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => {
                      el.onChange(e.target.files[0]);
                    }}
                  />
                </>
              ),
            },
            {
              title: translate("area"),
              field: "Area",
            },
            {
              title: translate("nameCategory"),
              field: "IDCategory",
              lookup: { ...categoriesLookup, null: translate("nullCategory") },
            },
            { title: translate("description"), field: "Description" },
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

export default withTranslate(Plants);
