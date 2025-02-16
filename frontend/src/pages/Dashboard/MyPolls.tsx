import DashboardLayout from "../../components/layout/DashboardLayout";
import useUserAuth from "../../hooks/useUserAuth";
import { useEffect, useState } from "react";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/helper";
import PollCards, { Poll } from "../../components/PollCards/PollCards";
import Loader from "../../components/layout/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { useUserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import EmptyCard from "../../components/cards/EmptyCard";
import CREATE_ICON from "../../assets/pen-svg.svg";

const MyPolls = () => {
  useUserAuth();

  const { user } = useUserContext();

  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState<Poll[]>([]);

  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const PAGE_SIZE = 10;

  const loadMorePolls = () => {
    setPage((prevePage) => prevePage + 1);
  };

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}$creatorId=${user?._id}`
      );

      if (response.data.polls.length > 0) {
        setAllPolls((prevpolls) =>
          overridePage === 1
            ? response.data.polls
            : [...prevpolls, ...response.data.polls]
        );

        setStats(response.data.stats || []);
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
    setPage(1);
    fetchAllPolls(1);
    return () => {};
  }, [filterType, user]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
    return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu="My Polls" stats={stats} showStats={true}>
      <div className="my-5 mx-auto">
        <HeaderWithFilter
          title="My Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {allPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message="Welcome! You're the first user of the system, and there are no polls yet. Start by creating the first poll"
            btntext="Create Poll"
            onClick={() => navigate("/createpoll")}
          />
        )}

        <InfiniteScroll
          dataLength={allPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<Loader />}
        >
          {allPolls.map((poll) => (
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

export default MyPolls;
