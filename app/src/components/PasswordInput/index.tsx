import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const PasswordInput = ({ className = "", ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={isVisible ? "text" : "password"}
        className={`${className} w-full pr-12`}
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={isVisible}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
      >
        {isVisible ? <IoEyeOff size={20} /> : <IoEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
