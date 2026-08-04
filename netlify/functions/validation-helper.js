function formatValidationError(error) {
    const issue = error?.issues?.[0];
    
    // Check for HTTP 413 Payload Too Large on imageBase64
    if (issue?.path?.[0] === 'imageBase64' && issue?.message?.includes('Too big')) {
        return {
            statusCode: 413,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: {
                    code: 'PAYLOAD_TOO_LARGE',
                    message: 'Image data exceeds the maximum allowed size of 10MB.',
                    field: 'imageBase64'
                }
            })
        };
    }
    
    return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            error: {
                code: 'VALIDATION_ERROR',
                message: issue?.message || error.message || 'Invalid request body.',
                field: issue?.path?.[0] || 'body'
            }
        })
    };
}

module.exports = { formatValidationError };
