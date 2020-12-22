const paginationData = function (data, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  if (endIndex < data.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }
  results.result = data.slice(startIndex, endIndex);
  return results;
};
module.exports = {
  paginationData,
};
