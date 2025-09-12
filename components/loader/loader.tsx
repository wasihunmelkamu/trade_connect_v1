import { Loader as LoaderIcon } from "lucide-react";
import React from "react";

interface LoaderProps {
    mainText?: string; // "Just a moment..."
    subText?: string; // "We’re authenticating you securely..."
    size?: "sm" | "md" | "lg"; // spinner and layout size
    color?: string; // primary color (used for spinner, dots, etc.)
    showDots?: boolean; // show bouncing dots
    showOrbit?: boolean; // show the ping border around spinner
    className?: string; // additional wrapper class
    style?: React.CSSProperties; // custom inline styles
    logo?: React.ReactNode; // optional logo element
    background?: string; // custom background (gradient or color)
}

const Loader: React.FC<LoaderProps> = ({
    mainText = "Just a moment...",
    subText = "We’re authenticating you securely. Won’t be long!",
    size = "md",
    color = "indigo",
    showDots = true,
    showOrbit = true,
    className = "",
    style,
    logo,
    background = "bg-gradient-to-br from-indigo-50 via-white to-cyan-50",
}) => {
    // Size config
    const sizeConfig = {
        sm: { spinner: 32, spacing: "gap-4", text: "text-lg", maxWidth: "max-w-xs" },
        md: { spinner: 40, spacing: "gap-6", text: "text-xl", maxWidth: "max-w-xs" },
        lg: { spinner: 48, spacing: "gap-8", text: "text-2xl", maxWidth: "max-w-sm" },
    };

    const currentSize = sizeConfig[size];

    // Color classes — maps "indigo", "blue", "emerald", etc. to Tailwind classes
    const colorClasses = {
        indigo: {
            spinner: "text-indigo-600",
            orbit: "border-indigo-200",
            dots: "bg-indigo-400",
            textMain: "text-gray-800",
            textSub: "text-gray-500",
        },
        blue: {
            spinner: "text-blue-600",
            orbit: "border-blue-200",
            dots: "bg-blue-400",
            textMain: "text-gray-800",
            textSub: "text-gray-500",
        },
        emerald: {
            spinner: "text-emerald-600",
            orbit: "border-emerald-200",
            dots: "bg-emerald-400",
            textMain: "text-gray-800",
            textSub: "text-gray-500",
        },
        rose: {
            spinner: "text-rose-600",
            orbit: "border-rose-200",
            dots: "bg-rose-400",
            textMain: "text-gray-800",
            textSub: "text-gray-500",
        },
        violet: {
            spinner: "text-violet-600",
            orbit: "border-violet-200",
            dots: "bg-violet-400",
            textMain: "text-gray-800",
            textSub: "text-gray-500",
        },
        // Add more as needed
    };

    const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo;

    return (
        <main
            className={`h-screen w-full flex justify-center items-center p-4 ${background} ${className}`}
            style={style}
        >
            <div className={`flex flex-col justify-center items-center text-center animate-fade-in ${currentSize.spacing}`}>
                {/* Optional Logo */}
                {logo && <div className="mb-4">{logo}</div>}

                {/* Spinner */}
                {/* <div className="relative">
                    <LoaderIcon size={currentSize.spinner} className={`${colors.spinner} animate-spin`} />
                    {showOrbit && (
                        <div
                            className={`absolute inset-[-0.5rem] rounded-full border-2 ${colors.orbit} animate-ping opacity-30`}
                            // style={{ width: currentSize.spinner + 16, height: currentSize.spinner + 16 }}
                        ></div>
                    )}
                </div> */}

                {/* Message */}
                <div className="space-y-2">
                    <h3 className={`${currentSize.text} font-semibold ${colors.textMain} tracking-tight`}>
                        {mainText}
                    </h3>
                    <p className={`text-sm leading-relaxed ${colors.textSub} ${currentSize.maxWidth}`}>
                        {subText}
                    </p>
                </div>

                {/* Optional: Progress dots animation */}
                {showDots && (
                    <div className="flex space-x-1">
                        <div
                            className={`w-2 h-2 rounded-full ${colors.dots} animate-bounce`}
                            style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                            className={`w-2 h-2 rounded-full ${colors.dots} animate-bounce`}
                            style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                            className={`w-2 h-2 rounded-full ${colors.dots} animate-bounce`}
                            style={{ animationDelay: "300ms" }}
                        ></div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Loader;