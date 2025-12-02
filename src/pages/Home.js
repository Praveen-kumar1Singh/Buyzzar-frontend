import React, { useEffect, useState } from 'react';
import CategoryList from '../components/CategoryList';
import BannerProduct from '../components/BannerProduct';
import HorizontalCardProduct from '../components/HorizontalCardProduct';
import VerticalCardProduct from '../components/VerticalCardProduct';
import productCategory from '../helpers/productCategory';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';

const Home = () => {
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  useEffect(() => {
    const fetchAvailableCategories = async () => {
      const validCategories = [];

      // Filter only subcategories (with parent)
      const subCategories = productCategory.filter(cat => cat.parent);

      for (const sub of subCategories) {
        const res = await fetchCategoryWiseProduct(sub.value);
        if (res?.data?.length > 0) {
          validCategories.push(sub); // Push only those which have data
        }
      }

      setAvailableSubCategories(validCategories);
    };

    fetchAvailableCategories();
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <BannerProduct />

      {/* Category Section */}
      <CategoryList />

      {/* Horizontal Sections for Main Categories */}
      {productCategory
        .filter(cat => !cat.parent) // main categories only
        .map(mainCat => {
          const subCategories = productCategory.filter(sub => sub.parent === mainCat.value);
          return (
            <HorizontalCardProduct
              key={mainCat.id}
              category={mainCat.value}
              heading={mainCat.label}
              subCategories={subCategories}
            />
          );
        })}


      {/* Vertical Sections ONLY for available subcategories */}
      {availableSubCategories.map(subCategory => (
        <VerticalCardProduct key={subCategory.id} category={subCategory.value} heading={subCategory.label} />
      ))}
    </div>
  );
};

export default Home;
