import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Link from "./Link";

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        description
        createdAt
        url
      }
    }
  }
`;

function LinkList() {
  const { loading, error, data } = useQuery(FEED_QUERY);
  if (loading) return <div>Fetching</div>;
  if (error) return <div>{error.message}</div>;
  const linksToRender = data.feed.links;

  return (
    <div>
      {linksToRender.map(link => (
        <Link key={link.id} link={link} />
      ))}
    </div>
  );
}
export default LinkList;
