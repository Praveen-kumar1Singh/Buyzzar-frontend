import SummaryApi from "../common";

const fetchCategoryWiseProduct = async (category) => {
  try {

    if (!category || (Array.isArray(category) && category.length === 0)) {
      return { data: [] };
    }

    const categoryPayload = Array.isArray(category) ? category[0] : category;

    const response = await fetch(SummaryApi.categoryWiseProduct.url, {
      method: SummaryApi.categoryWiseProduct.method,
      credentials: "include",         // ✅ send cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: categoryPayload }),
    });

    const dataResponse = await response.json();
    return dataResponse;

  } catch (error) {
    console.error("Error fetching category-wise product:", error.message);
    return { data: [], error: error.message };
  }
};

export default fetchCategoryWiseProduct;

// import SummaryApi from "../common";

// const fetchCategoryWiseProduct = async (category) => {
//   try {
//     const response = await fetch(SummaryApi.categoryWiseProduct.url, {
//       method: SummaryApi.categoryWiseProduct.method,
//       headers: {
//         "content-type": "application/json",
//       },
//       body: JSON.stringify({ category }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const dataResponse = await response.json();
//     return dataResponse;
//   } catch (error) {
//     console.error("Error fetching category-wise product:", error.message);
//     return { data: [], error: error.message };
//   }
// };

// export default fetchCategoryWiseProduct;
