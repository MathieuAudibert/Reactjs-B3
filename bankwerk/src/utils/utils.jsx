

export const convertTimestamp = (timestamp) => {
    if (timestamp?._seconds && timestamp._nanoseconds) {
      return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
    }
    return null
  }




