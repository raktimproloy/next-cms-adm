export function CurrentDate() {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
  
    return formattedDate;
  }
  
//   // Example usage
//   const formattedDate = formatDate();
//   console.log(formattedDate); // Output: March 23, 2024