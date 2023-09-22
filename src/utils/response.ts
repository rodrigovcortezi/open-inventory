type Response = {
  success: boolean
  data?: unknown
  error?: {
    message: string
    details?: unknown
  }
}

type ResponseParams = {
  data?: unknown
  err?: Error
}

export const buildResponse = ({data, err}: ResponseParams) => {
  let response: Response
  if (err) {
    response = {
      success: false,
      error: {
        message: err.message,
        details: 'details' in err ? err.details : undefined,
      },
    }
  } else {
    response = {
      success: true,
      data,
    }
  }
  return response
}
