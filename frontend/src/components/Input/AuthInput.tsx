import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

type PropsType = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // ✅ Fix: Accepts an event
  placeholder: string;
  label: string;
  type: string;
};

const AuthInput = ({ name, value, onChange, label, placeholder, type }: PropsType) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>
      <div className="input-box relative">
        <input
          name={name} // ✅ Ensure the input has a name attribute
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={onChange} // ✅ Pass event directly
        />

        {type === "password" && (
          <div className="absolute top-2.4 right-2.5">
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
