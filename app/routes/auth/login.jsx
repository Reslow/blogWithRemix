import { useActionData, json, redirect } from "remix";
import { db } from "~/utils/db.server";
import { login } from "~/utils/session.server";

function badRequest(data) {
  return json(data, { status: 400 });
}

export const action = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");

  const fields = { loginType, username, password };

  const fieldErrors = {
    username: validateUsername(username),
    password: validateUsername(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  switch (loginType) {
    case "login": {
      //   find user
      const user = await login({ username, password });
      if (!user) {
        return badRequest({
          fields,
          fieldErrors: { username: " invalid credentials" },
        });
      }
      // check user
      // create user session
    }
    case "register": {
      //  check user exist
      // create user
      // create user session
    }
    default: {
      return badRequest({
        fields,
        formError: "Login type is  not valid",
      });
    }
  }
};

// both register and login on same form

function Login() {
  const actionData = useActionData();

  return (
    <section className="auth-container">
      <section className="page-header">
        <h1>login</h1>
      </section>

      <section className="page-content">
        <form method="POST">
          <fieldset>
            <legend>Login or register</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                id="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields.loginType ||
                  actionData?.fields.loginType === "login"
                }
              />{" "}
              Login
            </label>

            <label>
              <input
                type="radio"
                name="registerType"
                id="registerType"
                value="register"
              />{" "}
              Register
            </label>
          </fieldset>
          <section className="form-control">
            <label htmlFor="username">username</label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={actionData?.fields?.username}
            />
            <section className="error">
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </section>
          </section>

          <section className="form-control">
            <label htmlFor="password">password</label>

            <input
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields?.password}
            />
            <section className="error">
              {actionData?.fieldErrors?.password &&
                actionData?.fieldErrors?.password}
            </section>
          </section>

          <button className="btn btn-block" type="submit">
            submit
          </button>
        </form>
      </section>
    </section>
  );
}

export default Login;
