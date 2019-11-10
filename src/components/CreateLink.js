import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FEED_QUERY } from "./LinkList";

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
    onCompleted: () => history.push("/"),
    update: (cache, { data: { post } }) => {
      const data = cache.readQuery({ query: FEED_QUERY });
      data.feed.links.push(post);
      cache.writeQuery({
        query: FEED_QUERY,
        data
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
