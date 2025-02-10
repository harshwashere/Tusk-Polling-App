import { useRef, useState } from "react";
import { LuUpload, LuUser, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ profilePic, setProfilePic }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(profilePic ? URL.createObjectURL(profilePic) : null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file); // Correctly update profilePic
      setPreviewUrl(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleRemoveImage = () => {
    setProfilePic(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="relative w-20 h-20">
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
              onClick={handleRemoveImage}
            >
              <LuTrash />
            </button>
          </>
        ) : (
          <div className="w-20 h-20 flex items-center justify-center bg-sky-100 rounded-full relative">
            <LuUser className="text-4xl text-primary" />
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full absolute -bottom-1 -right-1"
              onClick={onChooseFile}
            >
              <LuUpload />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoSelector;
