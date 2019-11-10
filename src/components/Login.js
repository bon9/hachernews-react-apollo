import React, { useReducer } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { AUTH_TOKEN } from "../constants";

const initialState = {
  name: "",
  email: "",
  password: "",
  login: true // switch between Login and SignUp
};

function reducer(state, action) {
  const { payload } = action;
  switch (action.type) {
    case "name":
      return { ...state, name: payload.value };
    case "email":
      return { ...state, email: payload.value };
    case "password":
      return { ...state, password: payload.value };
    case "toogleStateLogin":
      return { ...state, login: !state.login };
    default:
      return state;
  }
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

function Login({ history }) {
  const [authData, dispatch] = useReducer(reducer, initialState);

  const [authMutation] = useMutation(
    authData.login ? LOGIN_MUTATION : SIGNUP_MUTATION,
    {
      onCompleted: data => _confirm(data)
    }
  );

  const _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  const _confirm = async data => {
    const { token } = authData.login ? data.login : data.signup;
    _saveUserData(token);
    history.push(`/`);
  };

  return (
    <div>
      <h4 className="mv3">{authData.login ? "Login" : "Sign Up"}</h4>
      <div className="flex flex-column">
        {!authData.login && (
          <input
            value={authData.name}
            onChange={e =>
              dispatch({ type: "name", payload: { value: e.target.value } })
            }
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={authData.email}
          onChange={e =>
            dispatch({ type: "email", payload: { value: e.target.value } })
          }
          type="text"
          placeholder="Your email address"
        />
        <input
          value={authData.password}
          onChange={e =>
            dispatch({ type: "password", payload: { value: e.target.value } })
          }
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <div
          className="pointer mr2 button"
          onClick={() =>
            authMutation({
              variables: {
                name: authData.name,
                password: authData.password,
                email: authData.email
              }
            })
          }
        >
          {authData.login ? "login" : "create account"}
        </div>
        <div
          className="pointer button"
          onClick={() => dispatch({ type: "toogleStateLogin" })}
        >
          {authData.login
            ? "need to create an account?"
            : "already have an account?"}
        </div>
      </div>
    </div>
  );
}

export default Login;
