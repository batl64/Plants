import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import "./login.css";
import { respons } from "../../servises/index.js";
import { connect } from "react-redux";
import { setUserData } from "../../redux/auth-reducer.js";

import { TextField } from "@material-ui/core";
import Swal from "sweetalert2";

export class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      checkpassword: "",
      ErrorLog: false,
      ErrorPassword: false,
      ErrorPasswordcheck: false,
    };
    this.changeVar = this.changeVar.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    let { ErrorPasswordcheck, ErrorPassword } = this.state;

    this.state.password.length > 0
      ? (ErrorPassword = false)
      : (ErrorPassword = true);
    this.state.checkpassword == this.state.password
      ? (ErrorPasswordcheck = false)
      : (ErrorPasswordcheck = true);

    this.setState({
      ErrorPasswordcheck: ErrorPasswordcheck,
    });

    if (!ErrorPasswordcheck && !ErrorPassword) {
      this.Submit();
    }
  }

  Submit() {
    const urlParams = new URLSearchParams(window.location.search);
    const body = {
      Login: urlParams.get("Login"),
      resetToken: urlParams.get("resetToken"),
      password: this.state.password,
    };

    respons("post", "/resetPassword", JSON.stringify(body))
      .then((data) => {
        try {
          if (data) {
            Swal.fire({
              showConfirmButton: true,
              text: this.props.translate("resetSendNewPassword"),
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
    const { ErrorPasswordcheck, ErrorPassword } = this.state;

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
              <div className="py-3">
                <TextField
                  required
                  id="outlined-basic"
                  label={translate("password")}
                  variant="outlined"
                  type="password"
                  name="password"
                  value={this.Password}
                  onChange={this.changeVar}
                  className="form-control"
                />
              </div>
              {ErrorPassword && (
                <span className="text-danger">
                  {translate("error_RequirePassword")}
                </span>
              )}

              <div className="py-3">
                <TextField
                  required
                  id="outlined-basic"
                  label={translate("checkPassword")}
                  variant="outlined"
                  type="password"
                  name="checkpassword"
                  value={this.checkpassword}
                  onChange={this.changeVar}
                  className="form-control"
                />
              </div>
              {ErrorPasswordcheck && (
                <span className="text-danger">
                  {translate("error_RequirePasswordCheck")}
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
export default connect(mapStateToProps, { setUserData })(withTranslate(Reset));
