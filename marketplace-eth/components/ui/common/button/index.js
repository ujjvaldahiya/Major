export default function Button({
    children, 
    className="text-white bg-indigo-600 hover:bg-indigo-700",
    ...rest
}) {
    return (
        <button
            {...rest}
            className={`disabled:cursor-not-allowed disabled:opacity-75 px-8 py-3 border rounded-md text-base font-medium ${className}`}>
            {children}
        </button>
    )
}