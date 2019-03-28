function getStamp(date) {
  let timestamp = new Date(date.replace(/-/g, "/")).getTime()
  return timestamp / 1000
}




module.exports = {
  getStamp: getStamp,
}