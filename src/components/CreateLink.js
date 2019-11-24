import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FEED_QUERY } from "./LinkList";
import { LINKS_PER_PAGE } from "../constants";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      description
      url
    }
  }
`;

function CreateLink({ history }) {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [addPost] = useMutation(POST_MUTATION, {
    onCompleted: () => history.push("/new/1"),
    update: (store, { data: { post } }) => {
      const first = LINKS_PER_PAGE;
      const skip = 0;
      const orderBy = "createdAt_DESC";
      const data = store.readQuery({
        query: FEED_QUERY,
        variables: { first, skip, orderBy }
      });
      data.feed.links.push(post);
      store.writeQuery({
        query: FEED_QUERY,
        data,
        variables: { first, skip, orderBy }
      });
    }
  });

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <button onClick={() => addPost({ variables: { description, url } })}>
        Submit
      </button>
    </div>
  );
}

export default CreateLink;
