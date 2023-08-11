import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductQuery } from "../../features/api/apiSlice";
import { ROUTES } from '../../utils/routes';
import Product from './Product';
// eslint-disable-next-line
import Products from './Products';
import { useDispatch, useSelector } from 'react-redux';
import { getRelatedProducts } from '../../features/products/productsSlice';

const SingleProduct = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching, isSuccess } = useGetProductQuery({ id });
  const navigate = useNavigate();
  const { related, list } = useSelector(({ products }) => products);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && !isFetching && !isSuccess) {
      navigate(ROUTES.HOME);
    }
    // eslint-disable-next-line
  }, [isLoading, isFetching, isSuccess]);

  useEffect(() => {
    if (!data || !list.length) return;
    dispatch(getRelatedProducts(data.category.id));

  }, [data, list.length, dispatch]);


  return !data ? (
    <section className='preloader'>Loading...</section>
  ) : (
    <>
      <Product {...data} />
      <Products products={related} amount={5} title='Related products' btnSeaMore={false} />
    </>
  );
};

export default SingleProduct;
