const uploadImage = async (image) => {
  try {
    const cloudName = process.env.REACT_APP_CLOUD_NAME_CLOUDINARY;
    console.log("cloudName:", cloudName);
    console.log("Image object:", image);

    if (!cloudName) {
      throw new Error("Cloudinary cloud name is not defined in env");
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "mern_product");

    const dataResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!dataResponse.ok) {
      const err = await dataResponse.json();
      throw new Error(err?.error?.message || "Image upload failed");
    }

    return await dataResponse.json();
  } catch (err) {
    console.error("Image upload error:", err.message);
    throw err;
  }
};

export default uploadImage;
