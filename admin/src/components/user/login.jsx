import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import "./login.css";
import { respons } from "../../servises/index.js";
import { connect } from "react-redux";
import { setUserData } from "../../redux/auth-reducer.js";
import { TextField } from "@material-ui/core";
export class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      ErrorLogin: false,
      ErrorPassword: false,
      ErrorLog: false,
    };
    this.changeVar = this.changeVar.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    let { ErrorLogin, ErrorPassword } = this.state;
    this.state.login.length > 0 ? (ErrorLogin = false) : (ErrorLogin = true);
    this.state.password.length > 0
      ? (ErrorPassword = false)
      : (ErrorPassword = true);

    this.setState({
      ErrorLogin: ErrorLogin,
      ErrorPassword: ErrorPassword,
    });

    if (!ErrorLogin && !ErrorPassword) {
      this.Submit();
    }
  }

  Submit() {
    const body = {
      Login: this.state.login,
      Password: this.state.password,
      Role: "admin",
    };

    respons("post", "/login", JSON.stringify(body))
      .then((data) => {
        try {
          if (data) {
            this.setState({
              login: "",
              password: "",
            });
            this.props.setUserData(
              data.userId,
              data.email,
              data.login,
              data.role
            );
            localStorage.setItem("tokenn", data.token);
            this.props.history.push(this.props.location.state.loc);
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((e) => {
        this.setState({
          ErrorLog: true,
        });
        console.error(e);
      });
  }
  changeVar(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { translate } = this.props;
    const { ErrorLogin, ErrorPassword, ErrorLog } = this.state;

    if (this.props.isAuth) {
      if (this.props.location.state) {
        this.props.history.push(this.props.location.state.loc);
      } else {
        this.props.history.push("/");
      }
    }
    return (
      <div className="login">
        <div className="form-login rounded border border-dark back-color">
          <form onSubmit={this.handleSubmit}>
            <div className="translate-2 my-3">
              <TextField
                id="standard-basic"
                label={translate("login")}
                variant="standard"
                type="text"
                name="login"
                value={this.login}
                onChange={this.changeVar}
                className="form-control"
              />
            </div>
            {ErrorLogin && (
              <span className="text-danger">
                {translate("error_RequireLogin")}
              </span>
            )}

            <div className="translate-2 my-3">
              <TextField
                id="outlined-basic"
                label={translate("password")}
                variant="standard"
                type="password"
                name="password"
                value={this.password}
                onChange={this.changeVar}
                className="form-control"
              />
            </div>
            {ErrorPassword && (
              <span className="text-danger">
                {translate("error_RequirePassword")}
              </span>
            )}
            {ErrorLog && (
              <span className="text-danger">{translate("error_login")}</span>
            )}
            <div className="registration mt-2">
              <a className="main-link" href={"/reset"}>
                {translate("reset")}
              </a>
            </div>
            <input
              type="submit"
              className="btn btn-success my-3 w-100"
              value={translate("log_in")}
            />
          </form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  language: state.Intl.locale,
  isAuth: state.user.isAuth,
  login: state.user.login,
});
export default connect(mapStateToProps, { setUserData })(withTranslate(login));
