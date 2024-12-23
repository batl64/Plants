import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { __RouterContext as RouterContext } from "react-router-dom";
import { RouterToUrlQuery } from "react-url-query";
import { withRouter, Redirect } from "react-router-dom";
//redux
import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import {
  IntlReducer as Intl,
  IntlProvider,
  IntlActions,
} from "react-redux-multilingual";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import authRedux from "./redux/auth-reducer.js";
import LinearProgress from "@material-ui/core/LinearProgress";
import translete from "./translate.js";
import Reset from "./components/user/reset.jsx";
import NewPassword from "./components/user/newPassword.jsx";

const Login = React.lazy(() => import("./components/user/login.jsx"));
const Tab = React.lazy(() => import("./components/tab/TabBar.jsx"));
const MainPage = React.lazy(() => import("./pages/Main/index.jsx"));

const NotFound = React.lazy(() => import("./pages/Errors/NotFound.jsx"));

class Routs extends React.Component {
  constructor(props) {
    super(props);
    let mainTranslations = Object.assign({}, translete);
    const reducers = combineReducers(
      Object.assign({}, { Intl }, { user: authRedux })
    );

    const changelanguage = (language) => {
      store.dispatch(IntlActions.setLocale(language));
    };
    let language = "en";
    if (
      localStorage.getItem("locale") !== "undefined" &&
      localStorage.getItem("locale") !== null
    ) {
      language = localStorage.getItem("locale");
    }

    const store = createStore(reducers, {
      user: this.props.userData,
      Intl: {
        locale: language,
        changelanguage: changelanguage,
      },
    });

    this.state = {
      mainTranslations,
      store,
      language,
    };
  }

  render() {
    const { mainTranslations, store } = this.state;

    return (
      <Provider store={store}>
        <IntlProvider translations={mainTranslations}>
          <RouterToUrlQuery routerContext={RouterContext}>
            <Suspense fallback={<LinearProgress />}>
              <Switch>
                <Route
                  exact
                  path={"/newPassword"}
                  render={(props) => (
                    <NewPassword {...store} {...this.props} {...this.state} />
                  )}
                />
                <Route
                  exact
                  path={"/login"}
                  render={() => <Login {...this.props} />}
                />
                <Route
                  exact
                  path={"/reset"}
                  render={() => <Reset {...store} {...this.props} />}
                />

                {store.getState().user.isAuth ? (
                  <>
                    <Tab {...store.getState()} />
                    <Route
                      exact
                      path={"/"}
                      render={(props) => (
                        <MainPage {...this.props} {...store} />
                      )}
                    />
                  </>
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { loc: this.props.location },
                    }}
                  />
                )}
              </Switch>
            </Suspense>
          </RouterToUrlQuery>
        </IntlProvider>
      </Provider>
    );
  }
}

export default withRouter(Routs);
