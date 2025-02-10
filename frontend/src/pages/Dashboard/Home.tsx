import DashboardLayout from "../../components/layout/DashboardLayout";
import useUserAuth from "../../hooks/useUserAuth";
import { useEffect, useState } from "react";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/helper";
import PollCards, { Poll } from "../../components/PollCards/PollCards";

const Home = () => {
  useUserAuth();

  const [allPolls, setAllPolls] = useState<Poll[]>([]);

  const [, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const PAGE_SIZE = 10;
  
  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}`
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
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
    return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <HeaderWithFilter
          title="Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {allPolls.map((poll) => (
          <PollCards
            key={`dashboard_${poll._id}`}
            id={poll._id}
            question={poll.question}
            type={poll.type}
            options={poll.options}
            votes={poll.votes} // Should be an array, not a number
            response={poll.response || []}
            creator={{
              profileImgUrl: poll.creator.profileImgUrl || "",
              fullname: poll.creator.fullname,
              username: poll.creator.username,
            }}
            userHasVoted={poll.userHasVoted || false}
            closed={poll.closed}
            createdAt={poll.createdAt} isBookmarked={false} toggleBookmark={function (): void {
              throw new Error("Function not implemented.");
            } }          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Home;
