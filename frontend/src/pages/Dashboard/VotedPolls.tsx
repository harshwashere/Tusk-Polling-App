import DashboardLayout from "../../components/layout/DashboardLayout";
import useUserAuth from "../../hooks/useUserAuth";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/helper";
import PollCards, { Poll } from "../../components/PollCards/PollCards";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyCard from "../../components/cards/EmptyCard";
import { useNavigate } from "react-router-dom";
import CREATE_ICON from "../../assets/pen-svg.svg";
import { PollStats } from "../../components/layout/TrendingPolls";

const VotedPolls = () => {
  useUserAuth();

  const navigate = useNavigate();
  
  const [stats] = useState<PollStats[]>([]);
  const [votedPolls, setVotedPolls] = useState<Poll[]>([])
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 10;

  const loadMorePolls = () => {
    setPage((prevePage) => prevePage + 1);
  };

  const fetchAllPolls = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.VOTED_POLLS);

      if (response.data.polls.length > 0) {
        setVotedPolls((prevpolls) => [...prevpolls, ...response.data.polls]);

        setHasMore(response.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(!hasMore);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPolls();
    return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu="Voted Polls" stats={stats} showStats={true}>
      <div className="my-5 mx-auto">
        <h2 className="text-xl font-medium text-black">Voted Polls</h2>

        {votedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message="Welcome! You haven't voted on any polls. Start exploring and share your opinion by voting on polls now!"
            btntext="Explore"
            onClick={() => navigate("/dashboard")}
          />
        )}

        <InfiniteScroll
          dataLength={votedPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h2></h2>}
        >
          {votedPolls.map((poll) => (
            <PollCards
              key={`dashboard_${poll._id}`}
              id={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              votes={poll.votes}
              response={poll.response || []}
              creator={{
                profileImgUrl: poll.creator.profileImgUrl || "",
                fullname: poll.creator.fullname,
                username: poll.creator.username,
              }}
              userHasVoted={poll.userHasVoted || false}
              closed={poll.closed}
              createdAt={poll.createdAt}
              isBookmarked={false}
              toggleBookmark={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default VotedPolls;
