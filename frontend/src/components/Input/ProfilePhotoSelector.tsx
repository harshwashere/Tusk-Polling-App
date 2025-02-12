import { useRef, useState, ChangeEvent, SetStateAction, Dispatch } from "react";
import { LuUpload, LuUser, LuTrash } from "react-icons/lu";

// Define the type for the props
interface ProfilePhotoSelectorProps {
  profilePic: File | null;
  setProfilePic: (file: File | null) => Dispatch<SetStateAction<string>>;
}

const ProfilePhotoSelector = ({
  profilePic,
  setProfilePic,
}: ProfilePhotoSelectorProps) => {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profilePic ? URL.createObjectURL(profilePic) : null
  );

  // Define the event type for the image change
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setProfilePic(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleRemoveImage = () => {
    setProfilePic(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
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
            <img
              src={previewUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
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
