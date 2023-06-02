import React from "react";

const FilterIcon = (props: any) => {
    return (
        <svg
            {...props}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
                stroke="#70707B"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export { FilterIcon as default };