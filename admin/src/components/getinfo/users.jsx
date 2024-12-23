import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { respons } from "../../servises";
import { paternProject } from "../../const/const.js";
import { TableInfo } from "../table/table.jsx";

export class user extends Component {
  constructor(props) {
    super(props);
  }

  onRowDelete = (dat) => {
    respons("delete", "/users", JSON.stringify({ id: dat?.ID_User }));
  };
  onRowUpdate = (dat) => {
    if (paternProject.emailPattern.test(dat.Email)) {
      respons("put", "/users", JSON.stringify(dat));
    } else {
      setTimeout(() => {
        Swal.fire({
          showConfirmButton: true,
          icon: "error",
          text: this.props.translate("errorEmailPatern"),
        });
      }, 400);
    }
  };

  onRowCreate = (dat) => {
    const password = Math.random().toString(36).slice(2, 8);
    respons(
      "post",
      "/users",
      JSON.stringify({ ...dat, Password: password })
    ).then((data) => {
      if (emailPattern.test(dat.Email)) {
        if (data) {
          setTimeout(() => {
            Swal.fire({
              icon: "success",
              showConfirmButton: true,
              text: this.props.translate("yourPasswordSend"),
            });
          }, 400);
        }
      } else {
        setTimeout(() => {
          Swal.fire({
            showConfirmButton: true,
            icon: "error",
            text: this.props.translate("errorEmailPatern"),
          });
        }, 400);
      }
    });
  };

  render() {
    const { translate } = this.props;
    const tableRef = React.createRef();

    const response = (query) => {
      const body = {
        orderDirection: query.orderDirection ? query.orderDirection : "desc",
        orederFild: query.orderBy ? query.orderBy.field : "Login",
        pageSize: query.pageSize ? query.pageSize : 5,
        pageNumber: query.page ? query.page : 0,
        search: query.search ? query.search : "",
        searchFields: ["Login", "Email"],
      };

      return new Promise((res, rej) => {
        Promise.all([
          new Promise((res, rej) => {
            res(
              respons("get", "/users?" + new URLSearchParams(body)).then(
                (data) => data
              )
            );
          }),
          new Promise((res, rej) => {
            res(
              respons("get", "/usersPage?" + new URLSearchParams(body)).then(
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

    return (
      <div className="users m-4">
        <TableInfo
          tableRef={tableRef}
          title={translate("users")}
          columns={[
            { title: translate("login"), field: "Login" },
            { title: translate("email"), field: "Email" },
          ]}
          data={response}
          editable={{
            isDeletable: (rowData) => {
              if (this.props.userData.userId == rowData.UserId) {
                return false;
              } else {
                return true;
              }
            },
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

export default withTranslate(user);
