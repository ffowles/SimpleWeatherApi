export const buildResponseError = (message, status) => {
    const error = new Error(message)
    error.status = status
    error.stack = false
    return error
}
