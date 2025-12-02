import SummaryApi from "../common";
import { toast } from 'react-toastify';

const addToCart = async (e, id) => {
    e?.stopPropagation();
    e?.preventDefault();

    try {

        const response = await fetch(SummaryApi.addToCartProduct.url, {
            method: SummaryApi.addToCartProduct.method,
            credentials: "include",      // ✅ send cookies to backend
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: id })
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData.message);
        } else {
            toast.error(responseData.message || "Failed to add to cart");
        }

        return responseData;
    } catch (error) {
        toast.error("Something went wrong while adding to cart");
        console.error("Add to Cart Error:", error.message);
        return { success: false, message: error.message };
    }
};

export default addToCart;

// import SummaryApi from "../common"
// import { toast } from 'react-toastify'

// const addToCart = async(e,id) =>{
//     e?.stopPropagation()
//     e?.preventDefault()

//     const response = await fetch(SummaryApi.addToCartProduct.url,{
//         method : SummaryApi.addToCartProduct.method,
//         credentials : 'include',
//         headers : {
//             "content-type" : 'application/json'
//         },
//         body : JSON.stringify(
//             { productId : id }
//         )
//     })

//     const responseData = await response.json()

//     if(responseData.success){
//         toast.success(responseData.message)
//     }

//     if(responseData.error){
//         toast.error(responseData.message)
//     }


//     return responseData

// }


// export default addToCart
