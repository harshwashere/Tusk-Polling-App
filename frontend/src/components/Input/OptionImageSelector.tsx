import React from "react";
import toast from "react-hot-toast";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";

interface ImageType {
  base64: string | ArrayBuffer | null;
  file: File;
}

interface PropType {
  imageList: ImageType[];
  setImageList: React.Dispatch<React.SetStateAction<ImageType[]>>;
}

const OptionImageSelector = ({ imageList, setImageList }: PropType) => {
  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    if (!validExtensions.includes(file.type)) {
      toast.error("Only .jpeg, .png, and .jpg formats are allowed!");
      return;
    }

    if (imageList.length >= 4) {
      toast.error("You can upload a maximum of 4 images.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageList([...imageList, { base64: reader.result, file }]);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleDeleteImage = (index: number) => {
    const updateArr = imageList.filter((_, i) => i !== index);
    setImageList(updateArr);
  };

  return (
    <div>
      {imageList.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {imageList.map((item: ImageType, index: number) => (
            <div
              key={index}
              className="bg-gray-gray-600-10 rounded-md relative"
            >
              <img
                className="w-full h-36 object-contain rounded-md"
                src={typeof item.base64 === "string" ? item.base64 : ""}
                alt="Uploaded preview"
              />

              <button
                onClick={() => handleDeleteImage(index)}
                className="text-red-500 bg-gray-100 rounded-full p-2 absolute top-2 right-2 cursor-pointer"
              >
                <HiOutlineTrash className="text-lg" />
              </button>
            </div>
          ))}
        </div>
      )}

      {imageList.length < 4 && (
        <div className="flex items-center gap-5">
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            className="hidden"
            id="imageInput"
            onChange={handleAddImage}
          />

          <label
            htmlFor="imageInput"
            className="btn-small text-nowrap py-1 cursor-pointer"
          >
            <HiMiniPlus className="text-lg" /> Select Image
          </label>
        </div>
      )}
    </div>
  );
};

export default OptionImageSelector;
