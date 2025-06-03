export const useStatusCodes: Record<number, { message: string; statusMessage: string }> = {
    300: {
        message: "Multiple Choices",
        statusMessage: "The request has multiple possible responses. Select one from the options provided."
    },
    301: {
        message: "Moved Permanently",
        statusMessage: "This resource has been permanently moved to a new URL. Update your bookmarks accordingly."
    },
    302: {
        message: "Found",
        statusMessage: "The requested resource is temporarily located at a different URL. Try again later."
    },
    303: {
        message: "See Other",
        statusMessage: "This resource can be found at another URL. Please follow the provided link."
    },
    304: {
        message: "Not Modified",
        statusMessage: "The resource has not changed since the last request. Use the cached version if available."
    },
    307: {
        message: "Temporary Redirect",
        statusMessage: "This resource is temporarily moved. Please use the original request method."
    },
    308: {
        message: "Permanent Redirect",
        statusMessage: "This resource has been permanently moved. Use the original request method when accessing the new URL."
    },

    400: {
        message: "Bad Request",
        statusMessage: "The request was invalid or malformed. Check your input and try again."
    },
    401: {
        message: "Unauthorized",
        statusMessage: "Access denied. Please provide valid authentication credentials."
    },
    402: {
        message: "Payment Required",
        statusMessage: "This resource requires payment before access is granted."
    },
    403: {
        message: "Forbidden",
        statusMessage: "You do not have permission to access this resource."
    },
    404: {
        message: "Page Not Found",
        statusMessage: "The page you're looking for doesn't exist or has been moved. Check the URL or return to the homepage."
    },
    405: {
        message: "Method Not Allowed",
        statusMessage: "The requested HTTP method is not allowed for this resource."
    },
    406: {
        message: "Not Acceptable",
        statusMessage: "The requested resource cannot be provided in the requested format."
    },
    407: {
        message: "Proxy Authentication Required",
        statusMessage: "Authentication is required for this proxy server."
    },
    408: {
        message: "Request Timeout",
        statusMessage: "The server took too long to respond. Please try again later."
    },
    409: {
        message: "Conflict",
        statusMessage: "There is a conflict with the current state of the resource. Please resolve the conflict and retry."
    },
    410: {
        message: "Gone",
        statusMessage: "This resource is no longer available and has been permanently removed."
    },
    411: {
        message: "Length Required",
        statusMessage: "The request must include a valid Content-Length header."
    },
    412: {
        message: "Precondition Failed",
        statusMessage: "A precondition for this request was not met."
    },
    413: {
        message: "Payload Too Large",
        statusMessage: "The request body is too large. Reduce the size and try again."
    },
    414: {
        message: "URI Too Long",
        statusMessage: "The requested URL is too long. Try simplifying your request."
    },
    415: {
        message: "Unsupported Media Type",
        statusMessage: "The server does not support the requested media format."
    },
    429: {
        message: "Too Many Requests",
        statusMessage: "You've made too many requests in a short time. Please slow down and try again later."
    },

    500: {
        message: "Internal Server Error",
        statusMessage: "Something went wrong on our end. Please try again later."
    },
    501: {
        message: "Not Implemented",
        statusMessage: "The server does not support the requested feature or method."
    },
    502: {
        message: "Bad Gateway",
        statusMessage: "The server received an invalid response from an upstream server."
    },
    503: {
        message: "Service Unavailable",
        statusMessage: "The server is currently unavailable due to maintenance or high load. Please try again later."
    },
    504: {
        message: "Gateway Timeout",
        statusMessage: "The server did not receive a timely response from an upstream server."
    },
    505: {
        message: "HTTP Version Not Supported",
        statusMessage: "The requested HTTP version is not supported by this server."
    },
};
