import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import "./login.css";
import { respons } from "../../servises/index.js";
import { connect } from "react-redux";

import { TextField } from "@material-ui/core";
import Swal from "sweetalert2";

export class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      ErrorLog: false,
      ErrorEmail: false,
    };
    this.changeVar = this.changeVar.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    let { ErrorEmail } = this.state;
    this.state.login.length > 0 ? (ErrorEmail = false) : (ErrorEmail = true);

    this.setState({
      ErrorEmail: ErrorEmail,
    });

    if (!ErrorEmail) {
      this.Submit();
    }
  }

  Submit() {
    const body = {
      Login: this.state.login,
    };

    respons("post", "/reset", JSON.stringify(body))
      .then((data) => {
        try {
          if (data) {
            Swal.fire({
              showConfirmButton: true,
              icon: "success",
              text: this.props.translate("resetSend"),
            }).then((result) => {
              if (result.value) {
                this.props.history.push("/");
              }
            });
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((e) => {
        console.error(e);
        this.setState({
          ErrorLog: true,
        });
      });
  }
  changeVar(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { translate } = this.props;
    const { ErrorEmail } = this.state;

    if (this.props.isAuth) {
      if (this.props.location.state) {
        this.props.history.push(this.props.location.state.loc);
      } else {
        this.props.history.push("/userPage");
      }
    }
    return (
      <div className="Login">
        <div className="login">
          <div className="form-login rounded border border-dark back-color">
            <form onSubmit={this.handleSubmit}>
              <div style={{ textAlign: "center" }}>
                <h4>{translate("resetPasswordText")}</h4>
              </div>
              <div className="my-3">
                <TextField
                  id="standard-basic"
                  label={translate("loginAndEmail")}
                  variant="standard"
                  type="text"
                  name="login"
                  value={this.login}
                  onChange={this.changeVar}
                  className="form-control"
                />
              </div>
              {ErrorEmail && (
                <span className="text-danger">
                  {translate("error_RequireEmail")}
                </span>
              )}

              <input
                type="submit"
                className="btn btn-success my-3 w-100"
                value={translate("log_in")}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  language: state.Intl.locale,
});
export default connect(mapStateToProps)(withTranslate(Reset));
