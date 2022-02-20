import { Link, redirect, useActionData, json } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

function validateTitle(title) {
  console.log(`checking title ${title}`);
  if (typeof title !== "string" || title.length < 3) {
    return "Title should be at least 3 characters long";
  }
}
function validateBody(body) {
  console.log(`checking body ${body}`);

  if (typeof body !== "string" || body.length < 10) {
    return "body should be at least 10 characters long";
  }
}
function badRequest(data) {
  return json(data, { status: 400 });
}
export const action = async ({ request }) => {
  const user = await getUser(request);
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  const fields = { title, body };

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  console.log({ fieldErrors, fields });
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  console.log("Trying to create new post with fields.");
  const post = await db.post.create({ data: { ...fields, userId: user.id } });

  return redirect(`/posts/${post.id}`);
};

function NewPost() {
  const actionData = useActionData();
  console.log(actionData);
  return (
    <>
      <div className="page-header">
        <h1>New post</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={actionData?.fields?.title}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.title &&
                  actionData?.fieldErrors?.title}
              </p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Post body</label>
            <textarea
              name="body"
              id="body"
              defaultValue={actionData?.fields?.body}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.body && actionData?.fieldErrors?.body}
              </p>
            </div>
          </div>
          <button type="submit" className="btn btn-block">
            add post
          </button>
        </form>
      </div>
    </>
  );
}

export default NewPost;
