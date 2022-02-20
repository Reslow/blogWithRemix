import { useActionData, json, redirect } from "remix";
import { db } from "~/utils/db.server";
import { login, createUserSession, register } from "~/utils/session.server";

function validateUsername(username) {
  if (typeof username !== "string" || username.length < 3) {
    return "Username should be at least 3 characters long";
  }
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    return "Password should be at least 6 characters long";
  }
}

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
    password: validatePassword(password),
  };

  console.log(fieldErrors);
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  console.log(loginType);
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

      // create user session
      return createUserSession(user.id, "/posts");
    }
    case "register": {
      const userExist = await db.user.findFirst({
        where: { username },
      });

      if (userExist) {
        return badRequest({
          fields,
          fieldErrors: { username: `user ${username} already exist ` },
        });
      }

      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: "Something went wrong!",
        });
      }

      return createUserSession(user.id, "/posts");
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
                name="loginType"
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
