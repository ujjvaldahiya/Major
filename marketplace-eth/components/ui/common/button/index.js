export default function Button({
    children, 
    className,
    hoverable = true,
    variant = "indigo",
    ...rest
}) {
    const variants = {
        indigo: `text-white bg-indigo-600 ${hoverable && "hover:bg-indigo-700"}`,
        green: `text-white bg-green-600 ${hoverable && "hover:bg-green-700"}`,
        red: `text-white bg-red-600 ${hoverable && "hover:bg-red-700"}`,
        lightIndigo:`text-indigo-700 bg-indigo-100 ${hoverable && "hover:bg-indigo-200"}`,
        white:`text-black bg-white`
    }
    return (
        <button
            {...rest}
            className={`disabled:cursor-not-allowed disabled:opacity-75 xs:px-8 xs:py-3 p-2 border rounded-md text-base font-medium ${className} ${variants[variant]}`}>
            {children}
        </button>
    )
}