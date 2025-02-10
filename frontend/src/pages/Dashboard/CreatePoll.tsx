import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useUserContext } from "../../context/userContext";
import useUserAuth from "../../hooks/useUserAuth";
import { POLL_TYPE } from "../../utils/data";
import OptionInput from "../../components/Input/OptionInput";
import OptionImageSelector from "../../components/Input/OptionImageSelector";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/helper";

const CreatePoll = () => {
  useUserAuth();

  const { user, onPollCreateOrDelete } = useUserContext();

  const [pollData, setPollData] = useState({
    question: "",
    type: "",
    options: [],
    imageOptions: [],
    error: "",
  });

  const handleValueChange = (key: any, value: any) => {
    setPollData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearData = () => {
    setPollData({
      question: "",
      type: "",
      options: [],
      imageOptions: [],
      error: "",
    });
  };

  const updateImageAndGetLink = async (imageOptions: { file: File }[]) => {
    const optionPromises = imageOptions.map(async (imageOption) => {
      try {
        const imgUploadRes = await uploadImage(imageOption.file);
        return imgUploadRes.imageUrl || "";
      } catch (error) {
        toast.error(`Error uploading image: ${imageOption.file.name}`);
        return "";
      }
    });

    const optionArr = await Promise.all(optionPromises);
    return optionArr;
  };

  const getOptions = async () => {
    switch (pollData.type) {
      case "single-choice":
        return pollData.options;

      case "image-based":
        const option = await updateImageAndGetLink(pollData.imageOptions);
        return option;

      default:
        return [];
    }
  };

  const handleCreatePoll = async () => {
    const { question, options, imageOptions, type } = pollData;

    if (!user) {
      toast.error("User not found. Please log in again.");
      return;
    }

    if (!question || !type) {
      handleValueChange("error", "Question & Type are required.");
      return;
    }

    if (type === "single-choice" && (!options || options.length < 2)) {
      handleValueChange("error", "Enter at least 2 options.");
      return;
    }

    if (type === "image-based" && (!imageOptions || imageOptions.length < 2)) {
      handleValueChange("error", "Enter at least 2 image options.");
      return;
    }

    handleValueChange("error", "");

    const optionData = await getOptions();

    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CREATE, {
        question,
        type,
        options: optionData,
        creatorId: (user as unknown as { _id: string })._id,
      });
      if (response) {
        toast.success("Poll Created Successfully");
        onPollCreateOrDelete()
        clearData();
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Something went wrong. Please try again later";
      toast.error(errorMessage);
      handleValueChange("error", errorMessage);
    }
  };

  return (
    <DashboardLayout activeMenu="Create Poll">
      <div className="bg-gray-100/50 my-5 p-5 rounded-lg mx-auto">
        <h2 className="text-lg text-black font-medium">Create Poll</h2>

        <div className="mt-3">
          <label className="text-xs font-medium text-slate-600">QUESTION</label>

          <textarea
            placeholder="What's on your mind"
            className="w-full text-[13px] text-black outline-none bg-slate-200/80 p-2 rounded-md mt-2"
            rows={4}
            value={pollData.question}
            onChange={({ target }) =>
              handleValueChange("question", target.value)
            }
          ></textarea>
        </div>

        <div className="mt-3">
          <label className="text-xs font-medium text-slate-600">
            POLL TYPE
          </label>

          <div className="flex gap-4 flex-wrap mt-3">
            {POLL_TYPE.map((item, index) => (
              <div
                key={index}
                className={`option-chip ${
                  pollData.type === item.value
                    ? "text-white bg-blue-400 border-blue-400"
                    : "border-sky-100"
                }`}
                onClick={() => {
                  handleValueChange("type", item.value);
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {pollData.type === "single-choice" && (
          <div className="mt-5">
            <label className="text-xs font-medium text-slate-600">
              OPTIONS
            </label>

            <div className="mt-3">
              <OptionInput
                optionList={pollData.options}
                setOptionList={(value: any) => {
                  handleValueChange("options", value);
                }}
              />
            </div>
          </div>
        )}

        {pollData.type === "image-based" && (
          <div className="mt-5">
            <label className="text-xs font-medium text-slate-600">
              OPTIONS
            </label>

            <div className="mt-3">
              <OptionImageSelector
                imageList={pollData.imageOptions}
                setImageList={(value: any) => {
                  handleValueChange("imageOptions", value);
                }}
              />
            </div>
          </div>
        )}

        {pollData.error && (
          <p className="text-xs font-medium text-red-500 mt-5">
            {pollData.error}
          </p>
        )}

        <button
          className="btn-primary py-2 mt-6 cursor-pointer"
          onClick={handleCreatePoll}
        >
          CREATE
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CreatePoll;
