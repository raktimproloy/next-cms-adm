export function ArraySlice(pageNumber, itemsPerPage, array) {
    // Calculate the start index for the slice
    const startIndex = (pageNumber - 1) * itemsPerPage;
  
    // Use slice to get the desired portion of the array
    const arraySlice = array.slice(startIndex, startIndex + itemsPerPage);
  
    return arraySlice;
  }