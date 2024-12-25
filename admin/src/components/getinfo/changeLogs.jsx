import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { respons } from "../../servises/index.js";
import { paternProject } from "../../const/const.js";
import { TableInfo } from "../table/table.jsx";

export class ChangeLogs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { translate } = this.props;
    const tableRef = React.createRef();

    const response = (query) => {
      const body = {
        orderDirection: query.orderDirection ? query.orderDirection : "desc",
        orederFild: query.orderBy ? query.orderBy.field : "ChangeDate",
        pageSize: query.pageSize ? query.pageSize : 5,
        pageNumber: query.page ? query.page : 0,
        search: query.search ? query.search : "",
        searchFields: [
          "ChangeDate",
          "AreaSize",
          "description",
          "NameRegion",
          "NamePlant",
        ],
      };

      return new Promise((res, rej) => {
        Promise.all([
          new Promise((res, rej) => {
            res(
              respons("get", "/changeLogs?" + new URLSearchParams(body)).then(
                (data) => data
              )
            );
          }),
          new Promise((res, rej) => {
            res(
              respons(
                "get",
                "/changeLogsPage?" + new URLSearchParams(body)
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
          title={translate("changeLogs")}
          columns={[
            { title: translate("nameRegion"), field: "NameRegion" },
            { title: translate("namePlant"), field: "NamePlant" },
            {
              title: translate("changeDate"),
              field: "ChangeDate",
              type: "datetime",
            },
            { title: translate("areaSize"), field: "AreaSize" },
            { title: translate("description"), field: "description" },
          ]}
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

export default withTranslate(ChangeLogs);
