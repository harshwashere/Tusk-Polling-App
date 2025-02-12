import Poll from "../models/Poll.js";
import User from "../models/User.js";

export const createpoll = async (req, res) => {
    const { question, options, type, creatorId } = req.body;

    if (!question || !type || !creatorId) {
        return res.status(400).json({ message: "Question, type, and creatorId are required." });
    }

    try {
        let processedOptions = [];

        switch (type) {
            case "single-choice":
                if (!options || options.length < 2) {
                    return res.status(400).json({ message: "Single-Choice poll must have at least 2 options." });
                }
                processedOptions = options.map((option) => ({ optiontext: option }));
                break;

            case "open-ended":
                processedOptions = [];
                break;

            case "rating":
                processedOptions = [1, 2, 3, 4, 5].map((option) => ({
                    optiontext: option
                }));
                break;

            case "yes/no":
                processedOptions = ["Yes", "No"].map((option) => ({
                    optiontext: option
                }));
                break;

            case "image-based":
                if (!options || options.length < 2) {
                    return res.status(400).json({ message: "Image-based poll must have at least 2 images." });
                }
                processedOptions = options.map((url) => ({ optiontext: url }));  // Fix this to `optiontext` (lowercase 't')
                break;

            default:
                return res.status(400).json({ message: "Invalid poll type." });
        }

        const newPoll = await Poll.create({
            question,
            type,
            options: processedOptions,
            creator: creatorId
        });

        return res.status(201).json({ newPoll });
    } catch (error) {
        return res.status(500).json({ message: "Error creating poll.", error });
    }
};

export const getallpolls = async (req, res) => {
    const { type, creatorId, page = 1, limit = 10 } = req.params;
    const filter = {};
    const userId = req.user._id;

    if (type) filter.type = type;
    if (creatorId) {
        filter.creator = mongoose.Types.ObjectId(creatorId);
        if (!mongoose.Types.ObjectId.isValid(creatorId)) {
            return res.status(400).json({ message: "Invalid creatorId format" });
        }
    }

    try {
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        const polls = await Poll.find(filter)
            .populate("creator", "fullname username email profileimageUrl")
            .populate({
                path: "response",
                select: "username profileimageUrl fullname"
            })
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        const updatedPolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId));

            return {
                ...poll.toObject(),
                userHasVoted
            };
        });

        const totalPolls = await Poll.countDocuments(filter);

        const stats = await Poll.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                },
            }, {
                $project: {
                    type: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        const allTypes = [
            { type: "single-choice", label: "Single Choice" },
            { type: "yes/no", label: "Yes/No" },
            { type: "image-based", label: "Image Based" },
            { type: "open-ended", label: "Open Ended" },
            { type: "rating", label: "Rating" }
        ];

        const statsWithDefaults = allTypes.map((pollType) => {
            const stat = stats.find((item) => item.type === pollType.type);

            return {
                label: pollType.label,
                type: pollType.type,
                count: stat ? stat.count : 0
            };
        }).sort((a, b) => b.count - a.count);

        return res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPolls / pageSize),
            totalPolls,
            stats: statsWithDefaults
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching polls", error: error.message });
    }
};

export const getVotedPolls = async (req, res) => {
    try {
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const { page = 1, limit = 10, type } = req.query;
        const userId = req.user._id;

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const pageSize = Math.max(1, parseInt(limit, 10) || 10);
        const skip = (pageNumber - 1) * pageSize;

        const pollsQuery = { voters: userId };

        if (type) {
            pollsQuery.type = type;
        }

        const polls = await Poll.find(pollsQuery)
            .populate("creator", "fullname username email profileimageUrl")
            .populate({
                path: "response",
                select: "username profileimageUrl fullname",
            })
            .skip(skip)
            .limit(pageSize);

        const updatedPolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId));
            return {
                ...poll.toObject(),
                userHasVoted,
            };
        });

        const totalPolls = await Poll.countDocuments({ voters: userId });

        return res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPolls / pageSize),
            totalPolls,
        });
    } catch (error) {
        console.error("Error fetching voted polls:", error);
        return res.status(500).json({
            message: "Error fetching voted polls",
            error: error.message || error,
        });
    }
};

export const getpollbyid = async (req, res) => {
    const { id } = req.params
    try {
        const poll = await Poll.findById(id).populate("creator", "username email")

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" })
        }

        return res.status(200).json({ poll })
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error })
    }
}

export const voteonpoll = async (req, res) => {
    const { id } = req.params;
    const { optionindex, voterId, responseText } = req.body;

    try {
        const poll = await Poll.findById(id);

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (poll.closed) {
            return res.status(400).json({ message: "Poll is closed" });
        }

        if (poll.voters.includes(voterId)) {
            if (!responseText) {
                return res.status(400).json({ message: "User has already voted on this poll." });
            }
            poll.response.push({ voterId, responseText });
            await poll.save();
            return res.status(200).json({ poll });
        }

        if (poll.type === "open-ended") {
            poll.response.push({ voterId, responseText });
        } else {
            if (optionindex === undefined || optionindex < 0 || optionindex >= poll.options.length) {
                return res.status(400).json({ message: "Invalid option index." });
            }
            poll.options[optionindex].votes += 1;
        }

        if (!poll.voters.includes(voterId)) {
            poll.voters.push(voterId);
        }

        await poll.save();

        return res.status(200).json({ poll });
    } catch (error) {
        console.error("Error in voteonpoll:", error);
        return res.status(500).json({ message: "Error processing vote", error });
    }
};

export const closepoll = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    try {
        const poll = await Poll.findById(id)

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (poll.creator.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to close this poll." });
        }

        poll.closed = true
        await poll.save()

        return res.status(200).json({ message: "Poll closed successfully", poll })
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error })
    }
}

export const bookmarkpoll = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isBookmarked = user.bookmarkedPolls.includes(id)

        if (isBookmarked) {
            user.bookmarkedPolls = user.bookmarkedPolls.filter((pollId) => pollId.toString() !== id)
            await user.save()

            return res.status(200).json({
                message: "Poll removed from bookmarks",
                bookmarkedPolls: user.bookmarkedPolls
            })
        }

        user.bookmarkedPolls.push(id)
        await user.save()

        return res.status(200).json({
            message: "Poll Bookmarked Successfully",
            bookmarkedPolls: user.bookmarkedPolls
        })
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error })
    }
}

export const getbookmarkedpoll = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await User.findById(userId).populate({
            path: "bookmarkedPolls",
            populate: {
                path: "creator",
                select: "fullname username profileimageUrl"
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const bookmarkedPolls = user.bookmarkedPolls

        const updatedPolls = bookmarkedPolls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId))

            return {
                ...poll.toObject(),
                userHasVoted
            }
        })

        return res.status(200).json({ bookmarkedPolls: updatedPolls })
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error })
    }
}

export const deletepoll = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    try {
        const poll = await Poll.findById(id)

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (poll.creator.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to close this poll." });
        }

        await Poll.findByIdAndDelete(id)

        return res.status(200).json({ message: "Poll deleted successfully", poll })
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error })
    }
}