import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Link from "./Link";

export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        description
        createdAt
        url
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

function LinkList() {
  const { loading, error, data } = useQuery(FEED_QUERY);

  if (loading) return <div>Fetching</div>;
  if (error) return <div>{error.message}</div>;

  const linksToRender = data.feed.links;

  const _updateCacheAfterVote = (cache, createVote, linkId) => {
    const data = cache.readQuery({ query: FEED_QUERY });
    const votedLink = data.feed.links.find(link => link.id === linkId);
    // перезаписали votes на новые, пришедшие с ответа мутации
    votedLink.votes = createVote.link.votes;

    cache.writeQuery({ query: FEED_QUERY, data });
  };

  return (
    <div>
      {linksToRender.map((link, index) => (
        <Link
          key={link.id}
          index={index}
          link={link}
          updateCacheAfterVote={_updateCacheAfterVote}
        />
      ))}
    </div>
  );
}
export default LinkList;
