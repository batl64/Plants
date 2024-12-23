import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { respons } from "../../servises/index.js";
import { TableInfo } from "../table/table.jsx";

export class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  onRowDelete = (dat) => {
    respons("delete", "/categories", JSON.stringify({ id: dat?.id }));
  };

  onRowCreate = (dat) => {
    respons("post", "/categories", JSON.stringify(dat));
  };

  onRowUpdate = (dat) => {
    respons("put", "/categories", JSON.stringify(dat));
  };

  async componentDidMount() {
    await respons("get", "/categoriesList").then((data) => {
      this.setState({ data: data });
    });
  }

  render() {
    const { translate } = this.props;
    const tableRef = React.createRef();

    const categoriesLookup = this.state?.data?.reduce((acc, item) => {
      acc[item?.ID_Category] = item?.NameCategory;
      return acc;
    }, {});
    const response = (query) => {
      const body = {
        orderDirection: query.orderDirection ? query.orderDirection : "desc",
        orederFild: query.orderBy ? query.orderBy.field : "NameCategory",
        pageSize: query.pageSize ? query.pageSize : 5,
        pageNumber: query.page ? query.page : 0,
        search: query.search ? query.search : "",
        searchFields: ["NameCategory", "NameParentCategories", "Level"],
      };

      return new Promise((res, rej) => {
        Promise.all([
          new Promise((res, rej) => {
            res(
              respons("get", "/categories?" + new URLSearchParams(body)).then(
                (data) => data
              )
            );
          }),
          new Promise((res, rej) => {
            res(
              respons(
                "get",
                "/categoriesPage?" + new URLSearchParams(body)
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

    return (
      <div className="users m-4">
        <TableInfo
          tableRef={tableRef}
          title={translate("categories")}
          columns={[
            { title: translate("nameCategory"), field: "NameCategory" },
            {
              title: translate("nameParentCategories"),
              field: "IdParentCategories",
              lookup: {
                ...categoriesLookup,
                null: translate("nullCategory"),
              },
            },
            /*
            {
              title: translate("level"),
              field: "Level",
            },
            */
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

export default withTranslate(Categories);