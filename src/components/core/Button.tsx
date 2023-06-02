import React from "react";

type ButtonProps = {
  disabled?: Boolean;
  className?: String;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
};

const Button: React.FC<ButtonProps> = ({
  disabled = false,
  className,
  children,
  onClick,
  type = "submit",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`outline-none flex justify-center items-center text-sm leading-[21px] rounded-[4px] hover:bg-opacity-90 transition-opacity ease-linear delay-150 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      disabled={disabled ? true : false}
    >
      {children}
    </button>
  );
};

export { Button as default };